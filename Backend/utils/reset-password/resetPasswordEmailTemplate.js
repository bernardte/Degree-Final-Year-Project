export const resetPasswordEmailTemplate = (resetLink, hotelDetail) => `
 <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset Request</title>
        <style>
      body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f7f9fc;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #1e88e5, #0d47a1);
            padding: 30px 40px;
            text-align: center;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 40px;
        }
        .button {
            color: white;
            display: block;
            width: 250px;
            margin: 30px auto;
            padding: 16px;
            background-color:#007BFF;
            color: #fcfcfc;
            text-decoration: none;
            border-radius: 50px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
        }
        .button:hover {
            background-color: #0f6dd1;
        }
        .button-text {
            color: white;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            background-color: #f5f5f5;
        }
        .code {
            font-family: monospace;
            font-size: 24px;
            letter-spacing: 5px;
            background-color: #f5f5f5;
            padding: 15px;
            text-align: center;
            margin: 20px 0;
            border-radius: 5px;
            color: #333;
        }
        .divider {
            border-top: 1px solid #e0e0e0;
            margin: 30px 0;
        }
        .warning {
            background-color: #fff8e1;
            padding: 15px;
            border-left: 4px solid #ffc107;
            margin: 20px 0;
        }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Password Reset Request</h1>
            </div>
            
            <div class="content">
                <h2>Hi!</h2>
                <p>We have received your request to reset your password. Please click the button below to reset your password:</p>
                
                <a href="${resetLink}" class="button">
                    <span class="button-text">Reset Password</span>
                </a>
                
                <p>Or copy the following link and open it in your browser:</p>
                <p>${resetLink}</p>
                
                <div class="divider"></div>
                
                <p>If you did not request a password reset, please ignore this email。</p>
                
                <div class="warning">
                    <p><strong>Safety Tips: </strong>Please do not share this email or link with others. This link will expire in 15 minutes.</p>
                </div>
            </div>
            
            <div style="background: #1a365d; padding: 20px; text-align: center; border-radius: 0 0 12px 12px;">
                <div style="color: #ffffff; font-size: 12px;">
                    © ${new Date().getFullYear()} ${
  hotelDetail?.name
}. All rights reserved.
                </div>
            </div>
        </div>
        </body>
        `;
