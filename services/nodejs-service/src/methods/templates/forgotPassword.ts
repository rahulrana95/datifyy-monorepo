const template = (code: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reset Your Password | Datifyy</title>
    <style>
        body {
            background-color: #fff5f8;
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #ff758c, #ff7eb3);
            padding: 20px;
            text-align: center;
            color: #fff;
            font-size: 24px;
            font-weight: bold;
        }
        .content {
            padding: 20px;
            text-align: center;
        }
        .content p {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
        }
        .code {
            font-size: 28px;
            font-weight: bold;
            background: #ffebf0;
            padding: 10px 20px;
            display: inline-block;
            border-radius: 8px;
            color: #ff3366;
            margin: 20px 0;
        }
        .button {
            background: #ff3366;
            color: #fff;
            padding: 12px 20px;
            text-decoration: none;
            font-size: 18px;
            border-radius: 8px;
            display: inline-block;
            margin-top: 20px;
        }
        .footer {
            padding: 15px;
            text-align: center;
            font-size: 14px;
            color: #777;
            background: #ffe4ea;
            border-top: 1px solid #ffb6c1;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">💖 Reset Your Password</div>
        <div class="content">
            <p>Hey there,</p>
            <p>We heard that you need to reset your password. No worries! Use the code below to set up a new password and get back to finding your perfect match. 💑</p>
            <div class="code">${code}</div>
            <p>Click the button below to reset your password:</p>
            <a href="https://datifyy.com/reset-password" class="button">Reset Password</a>
            <p>If you didn’t request this, you can ignore this email. Your password will remain unchanged.</p>
        </div>
        <div class="footer">
            With Love, <br> 💕 The Datifyy Team
        </div>
    </div>

</body>
</html>


`;
};

export default template;
