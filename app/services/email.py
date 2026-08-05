import logging
import time
import uuid
from decimal import Decimal

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Header, Mail

from app.core.config import settings

logger = logging.getLogger(__name__)


class EmailService:
    def __init__(self):
        self.sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
        self.from_email = settings.SENDGRID_FROM_EMAIL

    def send_invoice_email(
        self,
        to_email: str,
        user_name: str,
        base_price: Decimal,
        extra_charges: Decimal,
        total_amount: Decimal,
        idempotency_key: str | None = None,
        is_recurring: bool = False,
        max_retries: int = 3,
    ):
        if not idempotency_key:
            idempotency_key = f"inv-{uuid.uuid4().hex}"

        charge_type = (
            "Monthly Recurring Subscription Invoice"
            if is_recurring
            else "Subscription Activation Invoice"
        )

        html_content = f"""
        <h2>Hello {user_name},</h2>
        <p>Thank you for your payment. Here is your invoice details:</p>
        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Item</th>
                <th>Amount</th>
            </tr>
            <tr>
                <td>Base Plan Fee</td>
                <td>${base_price:.2f}</td>
            </tr>
            <tr>
                <td>Feature Overuse Charges</td>
                <td>${extra_charges:.2f}</td>
            </tr>
            <tr>
                <th>Total Billed</th>
                <th>${total_amount:.2f}</th>
            </tr>
        </table>
        <p>If you have any questions, please contact our support team.</p>
        """

        message = Mail(
            from_email=self.from_email,
            to_emails=to_email,
            subject=f"Your Invoice - {charge_type}",
            html_content=html_content,
        )

        message.add_header(Header("X-Idempotency-Key", idempotency_key))

        for attempt in range(1, max_retries + 1):
            try:
                response = self.sg.send(message)
                logger.info(
                    f"Invoice email sent to {to_email}. Status code: {response.status_code} | Idempotency Key: {idempotency_key}"
                )
                return response
            except Exception as e:
                if attempt == max_retries:
                    logger.error(
                        f"Failed to send email to {to_email} after {max_retries} attempts: {str(e)}"
                    )
                    return None

                sleep_time = 2**attempt
                logger.warning(
                    f"Email send failed for {to_email}. Retrying in {sleep_time} seconds... (Attempt {attempt}/{max_retries})"
                )
                time.sleep(sleep_time)
