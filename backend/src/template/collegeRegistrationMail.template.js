export const buildCollegeRegistrationMailTemplate = (collegeName, credentials) => {

  const credentialRows = credentials
    .map(
      (c) => `
        <tr>
          <td>${c.role.toUpperCase()}</td>
          <td>${c.loginId}</td>
          <td><strong>${c.password}</strong></td>
        </tr>
      `
    )
    .join("");

  return `
    <h2>Welcome to Smart Campus System</h2>
    <p>Dear <strong>${collegeName}</strong>,</p>

    <p>Your college has been successfully registered in our system.</p>

    <p><strong>System Login Credentials:</strong></p>

    <table border="1" cellpadding="8" cellspacing="0">
      <tr>
        <th>Role</th>
        <th>Login ID</th>
        <th>Password</th>
      </tr>
      ${credentialRows}
    </table>

    <p>
      ⚠️ Please log in and change your password immediately after first login.
    </p>

    <p>
      Regards,<br/>
      <strong>SmartCollege Support Team</strong>
    </p>
  `;
};
