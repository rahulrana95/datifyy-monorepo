const template = (code: string) => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verify Your Email 💌 | Datifyy</title>
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
            font-size: 24px;
            font-weight: bold;
            color: #ff3366;
            background: #ffe4ea;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            letter-spacing: 4px;
            margin: 20px auto;
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
        <div class="header">💌 Verify Your Email</div>
        <div class="content">
            <p>Hello,</p>
            <p>You're just one step away from finding your perfect match on **Datifyy**! 💕</p>
            <p>Use the code below to verify your email and complete your signup:</p>
            <div class="code">${code}</div>
            <p>If you didn’t request this, please ignore this email.</p>
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
