import uuid
from datetime import date
from decimal import Decimal

from fastapi import BackgroundTasks, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import APIError
from app.models.subscription import Subscription
from app.repositories.plan import PlanRepository
from app.repositories.subscription import SubscriptionRepository
from app.repositories.transaction import TransactionRepository
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate
from app.schemas.transaction import TransactionCreate
from app.services.email import EmailService


class SubscriptionService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.subscription_repo = SubscriptionRepository(db)
        self.transaction_repo = TransactionRepository(db)
        self.plan_repo = PlanRepository(db)
        self.email_service = EmailService()

    async def create_subscription(
        self,
        user_id: int,
        payload: SubscriptionCreate,
        background_tasks: BackgroundTasks,
    ) -> Subscription:
        plan = await self.plan_repo.get_by_id(payload.plan_id)
        if not plan:
            raise APIError("Plan not found", status_code=404)

        today_day = date.today().day
        billing_day = min(today_day, 28)

        try:
            subscription = await self.subscription_repo.create(
                user_id=user_id,
                subscription_in=payload,
                billing_day=billing_day,
                last_billing_date=date.today(),
            )

            monthly_fee = Decimal(str(plan.monthly_fee))
            transaction_in = TransactionCreate(
                user_id=user_id,
                subscription_id=subscription.id,
                base_price=monthly_fee,
                extra_charges=Decimal("0.00"),
                is_recurring=False,
            )
            await self.transaction_repo.create(transaction_in)
            await self.db.commit()

            subscription_full = await self.subscription_repo.get_by_id(subscription.id)

            if subscription_full and subscription_full.user:
                idempotency_key = f"sub-{subscription.id}-{uuid.uuid4().hex[:8]}"
                background_tasks.add_task(
                    self.email_service.send_invoice_email,
                    to_email=subscription_full.user.email,
                    user_name=subscription_full.user.name,
                    base_price=monthly_fee,
                    extra_charges=Decimal("0.00"),
                    total_amount=monthly_fee,
                    idempotency_key=idempotency_key,
                    is_recurring=False,
                )

            return subscription_full

        except Exception:
            await self.db.rollback()
            raise

    async def update_subscription(
        self,
        subscription_id: int,
        payload: SubscriptionUpdate,
        current_user_id: int,
        background_tasks: BackgroundTasks,
        is_admin: bool = False,
    ) -> Subscription:
        subscription = await self.subscription_repo.get_by_id(subscription_id)
        if not subscription:
            raise APIError(
                "Subscription not found", status_code=status.HTTP_404_NOT_FOUND
            )

        if not is_admin and subscription.user_id != current_user_id:
            raise APIError("Access denied", status_code=status.HTTP_403_FORBIDDEN)

        try:
            if payload.plan_id is not None and payload.plan_id != subscription.plan_id:
                new_plan = await self.plan_repo.get_by_id(payload.plan_id)
                if not new_plan:
                    raise APIError(
                        "Target plan not found", status_code=status.HTTP_404_NOT_FOUND
                    )

                today = date.today()

                payload.billing_day = min(today.day, 28)
                payload.last_billing_date = today

                base_price = Decimal(str(new_plan.monthly_fee))
                transaction_in = TransactionCreate(
                    user_id=subscription.user_id,
                    subscription_id=subscription.id,
                    base_price=base_price,
                    extra_charges=Decimal("0.00"),
                    is_recurring=False,
                )
                await self.transaction_repo.create(transaction_in)

                if subscription.user:
                    idempotency_key = (
                        f"sub-upd-{subscription.id}-{uuid.uuid4().hex[:8]}"
                    )
                    background_tasks.add_task(
                        self.email_service.send_invoice_email,
                        to_email=subscription.user.email,
                        user_name=subscription.user.name,
                        base_price=base_price,
                        extra_charges=Decimal("0.00"),
                        total_amount=base_price,
                        idempotency_key=idempotency_key,
                        is_recurring=False,
                    )

            await self.subscription_repo.update(
                subscription_id=subscription_id,
                subscription_in=payload,
            )

            await self.db.commit()

            updated_subscription = await self.subscription_repo.get_by_id(
                subscription_id
            )
            return updated_subscription

        except Exception:
            await self.db.rollback()
            raise

    async def cancel_subscription(
        self,
        subscription_id: int,
        current_user_id: int,
        is_admin: bool = False,
    ) -> Subscription:
        subscription = await self.subscription_repo.get_by_id(subscription_id)
        if not subscription:
            raise APIError(
                "Subscription not found", status_code=status.HTTP_404_NOT_FOUND
            )

        if not is_admin and subscription.user_id != current_user_id:
            raise APIError("Access denied", status_code=status.HTTP_403_FORBIDDEN)

        if not subscription.is_active:
            raise APIError(
                "Subscription is already canceled",
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            await self.subscription_repo.deactivate(subscription_id)
            await self.db.commit()

            return await self.subscription_repo.get_by_id(subscription_id)

        except Exception:
            await self.db.rollback()
            raise

    async def get_user_subscriptions(
        self,
        user_id: int,
    ) -> list[Subscription]:
        return await self.subscription_repo.get_by_user_id(user_id)
