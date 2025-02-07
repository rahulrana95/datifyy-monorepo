const template = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Your Date is Set! 💖 | Datifyy</title>
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
        .details {
            font-size: 18px;
            font-weight: bold;
            color: #ff3366;
            background: #ffe4ea;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            margin: 20px auto;
        }
        .btn {
            display: inline-block;
            background: #ff3366;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            text-decoration: none;
            font-size: 16px;
            font-weight: bold;
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
        <div class="header">💕 Your Date is Confirmed!</div>
        <div class="content">
            <p>Hey there,</p>
            <p>Exciting news! We’ve found a **perfect match** for you on **Datifyy**! 💖</p>
            <p>Your virtual date details are below:</p>
            <div class="details">
                🗓️ **Date:** <strong>February 14, 2025</strong><br>
                ⏰ **Time:** <strong>7:00 PM (Your Local Time)</strong><br>
                🎥 **Google Meet Link:** <a href="https://meet.google.com/your-meet-link" style="color:#ff3366;">Join Here</a>
            </div>
            <p>Please use the same Google account to join the meeting.</p>
            <p>We hope this is the beginning of something special! 💕</p>
            <a href="https://datifyy.com" class="btn">View My Matches</a>
        </div>
        <div class="footer">
            With Love, <br> 💖 The Datifyy Team
        </div>
    </div>

</body>
</html>

`;

export default template;
