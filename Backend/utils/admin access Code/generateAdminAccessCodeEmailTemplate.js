export const generateAdminAccessCodeEmailTemplate = (accessCode, hotelName) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Access Code</title>
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
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
            font-weight: 600;
        }
        .content {
            padding: 40px;
        }
        .access-code {
            font-family: monospace;
            font-size: 32px;
            letter-spacing: 8px;
            background-color: #f0f6ff;
            padding: 20px;
            text-align: center;
            margin: 30px 0;
            border-radius: 8px;
            color: #1a56db;
            font-weight: bold;
            border: 1px dashed #1e88e5;
        }
        .button {
            display: block;
            width: 250px;
            margin: 30px auto;
            padding: 16px;
            background-color: #1e88e5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 50px;
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 4px 8px rgba(33, 150, 243, 0.4);
        }
        .button:hover {
            background-color: #0d47a1;
        }
        .footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #999;
            background-color: #f5f5f5;
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
            border-radius: 4px;
        }
        .timer {
            display: inline-block;
            background-color: #ff3b30;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
            margin: 0 5px;
        }
        .logo {
            text-align: center;
            margin-bottom: 20px;
        }
        .logo-placeholder {
            font-size: 24px;
            font-weight: bold;
            color: #1e88e5;
        }
        .instructions {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .instructions ol {
            margin: 10px 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Admin Access Code</h1>
        </div>
        
        <div class="content">
            <div class="logo">
                <div class="logo-placeholder">HOTEL ADMIN</div>
            </div>
            
            <h2>Hello Administrator,</h2>
            <p>You have requested an access code to log in to the admin portal. Here is your one-time access code:</p>
            
            <div class="access-code" id="accessCode">${accessCode}</div>
            
            <p>Please use this code within the next <span class="timer">5 minutes</span> to access the admin portal.</p>
            
            <div class="instructions">
                <h3>How to use this code:</h3>
                <ol>
                    <li>Go to the login page</li>
                    <li>Enter your email address</li>
                    <li>Click login</li>
                    <li>Enter your access code shown above</li>
                </ol>
            </div>
            
            <div class="warning">
                <p><strong>Security Notice:</strong> For your protection, this access code will expire in <span class="timer">5 minutes</span>. Do not share this code with anyone.</p>
            </div>
            
            <div class="divider"></div>
            
            <p>If you did not request this access code, please ignore this email and contact your system administrator immediately.</p>
        </div>
        
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${hotelName}. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
`;