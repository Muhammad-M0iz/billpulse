from datetime import date
from decimal import Decimal
import uuid

from fastapi import BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.subscription import SubscriptionRepository
from app.repositories.transaction import TransactionRepository
from app.repositories.usage import UsageRepository
from app.schemas.transaction import TransactionCreate
from app.services.email import EmailService


class BillingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.subscription_repo = SubscriptionRepository(db)
        self.transaction_repo = TransactionRepository(db)
        self.usage_repo = UsageRepository(db)
        self.email_service = EmailService()

    async def run_billing_cycle(
        self,
        background_tasks: BackgroundTasks,
        target_date: date | None = None,
    ) -> dict:
        if target_date is None:
            target_date = date.today()

        due_subscriptions = await self.subscription_repo.get_due_subscription(
            target_date
        )

        processed_count = 0
        total_billed_amount = Decimal("0.00")
        processed_transactions = []

        for subscription in due_subscriptions:
            try:
                base_price = Decimal(str(subscription.plan.monthly_fee))

                extra_charges = await self._calculate_overuse_charges(subscription)

                transaction_in = TransactionCreate(
                    user_id=subscription.user_id,
                    subscription_id=subscription.id,
                    base_price=base_price,
                    extra_charges=extra_charges,
                    is_recurring=True,
                )

                transaction = await self.transaction_repo.create(transaction_in)

                subscription.last_billing_date = target_date

                total_amount = base_price + extra_charges
                processed_count += 1
                total_billed_amount += total_amount
                processed_transactions.append(transaction)

                if subscription.user:
                    idempotency_key = f"bill-{subscription.id}-{target_date.isoformat()}-{uuid.uuid4().hex[:6]}"
                    background_tasks.add_task(
                        self.email_service.send_invoice_email,
                        to_email=subscription.user.email,
                        user_name=subscription.user.name,
                        base_price=base_price,
                        extra_charges=extra_charges,
                        total_amount=total_amount,
                        idempotency_key=idempotency_key,
                        is_recurring=True,
                    )

            except Exception:
                await self.db.rollback()
                raise

        await self.db.commit()

        return {
            "processed_subscriptions": processed_count,
            "total_amount_billed": total_billed_amount,
            "target_date": target_date,
        }

    async def _calculate_overuse_charges(self, subscription) -> Decimal:
        extra_charges = Decimal("0.00")

        usages = await self.usage_repo.get_usage(subscription.id)
        if not usages:
            return extra_charges

        usage_by_feature: dict[int, int] = {}
        for usage in usages:
            usage_by_feature[usage.feature_id] = (
                usage_by_feature.get(usage.feature_id, 0) + usage.units_used
            )

        for feature in subscription.plan.features:
            total_units_used = usage_by_feature.get(feature.id, 0)
            max_limit = feature.max_unit_limit

            if total_units_used > max_limit:
                exceeded_units = Decimal(str(total_units_used - max_limit))
                unit_price = Decimal(str(feature.unit_price))
                overuse_fee = exceeded_units * unit_price
                extra_charges += overuse_fee

        return extra_charges
