export const buildCollegeRegistrationMailTemplate = (collegeName, credentials) => {

  const credentialRows = credentials.map(
    (c) => `
      <tr style="background:#ffffff;">
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;">${c.role.toUpperCase()}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;">${c.loginId}</td>
        <td style="padding:10px;border-bottom:1px solid #e2e8f0;"><strong>${c.password}</strong></td>
      </tr>
    `
  ).join("");

  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f8ff;font-family:Segoe UI,Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" style="padding:40px 15px;">

      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:14px;box-shadow:0 10px 40px rgba(37,99,235,0.18);overflow:hidden;">

        <!-- HEADER -->
        <tr>
          <td style="background:linear-gradient(135deg,#2563EB,#22D3EE);padding:26px 28px;color:#ffffff;">
            <h1 style="margin:0;font-size:22px;font-weight:600;">Smart Campus</h1>
            <p style="margin:6px 0 0;font-size:13px;opacity:0.9;">
              AI-Powered Campus Operations Platform
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:34px 30px;color:#0f172a;">

            <h2 style="margin:0 0 10px;font-size:21px;">Welcome to Smart Campus 🎓</h2>

            <p style="margin:0 0 16px;line-height:1.6;color:#334155;">
              Dear <strong>${collegeName}</strong>,
            </p>

            <p style="margin:0 0 20px;line-height:1.6;color:#334155;">
              Your college has been successfully onboarded into the Smart Campus system.
              Below are your official system login credentials:
            </p>

            <!-- CREDENTIAL TABLE -->
            <div style="margin:18px 0;border-radius:12px;overflow:hidden;border:1px solid #bfdbfe;">
              <table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;">
                <tr style="background:#2563EB;color:#ffffff;">
                  <th align="left">Role</th>
                  <th align="left">Login ID</th>
                  <th align="left">Password</th>
                </tr>
                ${credentialRows}
              </table>
            </div>

            <div style="margin:18px 0;padding:14px 16px;background:#eff6ff;border-left:4px solid #2563EB;border-radius:6px;">
              ⚠️ <strong>Important:</strong> Please change all passwords immediately after first login for security.
            </div>

            <p style="margin:22px 0 6px;color:#475569;">
              We’re excited to help your campus become smarter, safer, and more efficient.
            </p>

            <p style="margin:0;color:#475569;">
              Regards,<br>
              <strong>Smart Campus Support Team</strong>
            </p>

            <hr style="border:none;border-top:1px solid #e2e8f0;margin:26px 0;">

            <p style="font-size:13px;color:#64748b;line-height:1.6;">
              This is an automated system message from Smart Campus.  
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
