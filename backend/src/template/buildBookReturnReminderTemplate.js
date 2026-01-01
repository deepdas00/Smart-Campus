export const buildBookReturnReminderTemplate = (name, bookTitle, daysLeft, returnDate, collegeName, fineAmount) => {

  const urgencyText = daysLeft === 1 
    ? "⚠️ Urgent: Only 1 day remaining!" 
    : "⏰ Reminder: 2 days remaining";

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f8ff;font-family:Segoe UI,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:40px 15px;">

      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:14px;box-shadow:0 10px 40px rgba(37,99,235,0.18);overflow:hidden;">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#2563EB,#22D3EE);padding:26px 28px;color:#ffffff;">
            <h1 style="margin:0;font-size:22px;font-weight:600;">${collegeName}</h1>
            <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">
              Library Return Reminder
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:34px 30px;color:#0f172a;">

            <h2 style="margin:0 0 10px;font-size:21px;">
              ${urgencyText}
            </h2>

            <p style="margin:0 0 16px;line-height:1.6;color:#334155;">
              Hello <strong>${name}</strong>,
            </p>

            <p style="margin:0 0 20px;line-height:1.6;color:#334155;">
              This is a friendly reminder that your borrowed book:
            </p>

            <!-- BOOK INFO BOX -->
            <div style="margin:22px 0;padding:18px;border-radius:12px;background:#eff6ff;border:1px dashed #2563EB;text-align:center;">
              <span style="font-size:18px;font-weight:600;color:#2563EB;">
                📚 ${bookTitle}
              </span>
            </div>

            <p style="margin:0 0 12px;color:#0f172a;">
              🗓 <strong>Return Date:</strong> ${returnDate}
            </p>

            <p style="margin:0 0 22px;color:#0f172a;">
              ⏳ <strong>Time Remaining:</strong> ${daysLeft} day(s)
            </p>

            <p style="margin:0 0 22px;line-height:1.6;color:#475569;">
              Please make sure to return the book on or before the due date to avoid any late fine or penalties(<b>₹${fineAmount}/day</b>).
            </p>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:26px 0;">

            <p style="font-size:13px;color:#64748b;line-height:1.6;">
              This is an automated message from the Smart Campus Library System.  
              Please do not reply to this email.
            </p>

          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#f1f5ff;padding:14px 10px;text-align:center;font-size:12px;color:#64748b;">
            © 2025 Smart Campus Platform
          </td>
        </tr>

      </table>

    </td>
  </tr>
</table>

</body>
</html>
`;
};
