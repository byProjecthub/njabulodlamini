<?php
/* ========================================
   Email Mailer - PHPMailer Integration
   ======================================== */

// Note: Install PHPMailer via Composer:
// composer require phpmailer/phpmailer
// Or download manually from https://github.com/PHPMailer/PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require_once 'config.php';

/* ========================================
   Email Configuration
   ======================================== */

// SMTP Configuration - Update with your email provider settings
define('SMTP_HOST', 'smtp.gmail.com');      // e.g., smtp.gmail.com, smtp.mailgun.org
define('SMTP_PORT', 587);                    // 587 for TLS, 465 for SSL
define('SMTP_USERNAME', 'your-email@gmail.com'); // Your email address
define('SMTP_PASSWORD', 'your-app-password');   // App-specific password
define('SMTP_ENCRYPTION', 'tls');              // tls or ssl

// Email addresses
define('ADMIN_EMAIL', 'your-email@gmail.com');     // Where notifications go
define('ADMIN_NAME', 'John - DevX Portfolio');    // Admin name
define('FROM_EMAIL', 'noreply@devx.com');         // Sender email
define('FROM_NAME', 'DevX Portfolio');            // Sender name

/* ========================================
   Send Contact Form Email to Admin
   ======================================== */

function sendContactEmail($name, $email, $phone, $subject, $message) {
    try {
        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port = SMTP_PORT;

        // Enable debugging (0 = off, 1 = client, 2 = client & server)
        $mail->SMTPDebug = 0;

        // Recipients
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress(ADMIN_EMAIL, ADMIN_NAME);
        $mail->addReplyTo($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "New Contact Form Submission: " . $subject;

        // Email body
        $mail->Body = buildAdminEmailTemplate($name, $email, $phone, $subject, $message);
        $mail->AltBody = strip_tags($mail->Body);

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Email sending failed: " . $mail->ErrorInfo);
        return false;
    }
}

/* ========================================
   Send Auto-Reply to User
   ======================================== */

function sendAutoReply($name, $email) {
    try {
        $mail = new PHPMailer(true);

        // Server settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = SMTP_ENCRYPTION;
        $mail->Port = SMTP_PORT;

        // Recipients
        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress($email, $name);
        $mail->addReplyTo(ADMIN_EMAIL, ADMIN_NAME);

        // Content
        $mail->isHTML(true);
        $mail->Subject = "Thank you for contacting me!";

        // Email body
        $mail->Body = buildAutoReplyTemplate($name);
        $mail->AltBody = strip_tags($mail->Body);

        $mail->send();
        return true;

    } catch (Exception $e) {
        error_log("Auto-reply failed: " . $mail->ErrorInfo);
        return false;
    }
}

/* ========================================
   Email Templates
   ======================================== */

function buildAdminEmailTemplate($name, $email, $phone, $subject, $message) {
    $date = date('F j, Y g:i A');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';

    return ""
    . "<!DOCTYPE html>"
    . "<html>"
    . "<head>"
    . "<style>"
    . "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }"
    . ".container { max-width: 600px; margin: 0 auto; padding: 20px; }"
    . ".header { background: #6366f1; color: white; padding: 20px; text-align: center; }"
    . ".content { background: #f9fafb; padding: 30px; }"
    . ".field { margin-bottom: 15px; }"
    . ".label { font-weight: bold; color: #6366f1; }"
    . ".message-box { background: white; padding: 15px; border-left: 4px solid #6366f1; margin-top: 10px; }"
    . ".footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }"
    . "</style>"
    . "</head>"
    . "<body>"
    . "<div class='container'>"
    . "<div class='header'>"
    . "<h2>New Contact Form Submission</h2>"
    . "</div>"
    . "<div class='content'>"
    . "<div class='field'><span class='label'>Date:</span> {$date}</div>"
    . "<div class='field'><span class='label'>Name:</span> {$name}</div>"
    . "<div class='field'><span class='label'>Email:</span> {$email}</div>"
    . "<div class='field'><span class='label'>Phone:</span> " . ($phone ?: 'Not provided') . "</div>"
    . "<div class='field'><span class='label'>Subject:</span> {$subject}</div>"
    . "<div class='field'>"
    . "<span class='label'>Message:</span>"
    . "<div class='message-box'>" . nl2br(htmlspecialchars($message)) . "</div>"
    . "</div>"
    . "<div class='field'><span class='label'>IP Address:</span> {$ip}</div>"
    . "</div>"
    . "<div class='footer'>"
    . "<p>This email was sent from your portfolio contact form.</p>"
    . "</div>"
    . "</div>"
    . "</body>"
    . "</html>";
}

function buildAutoReplyTemplate($name) {
    return ""
    . "<!DOCTYPE html>"
    . "<html>"
    . "<head>"
    . "<style>"
    . "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }"
    . ".container { max-width: 600px; margin: 0 auto; padding: 20px; }"
    . ".header { background: #6366f1; color: white; padding: 30px; text-align: center; }"
    . ".content { background: #f9fafb; padding: 30px; }"
    . ".footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }"
    . ".social { margin-top: 20px; text-align: center; }"
    . ".social a { display: inline-block; margin: 0 10px; color: #6366f1; text-decoration: none; }"
    . "</style>"
    . "</head>"
    . "<body>"
    . "<div class='container'>"
    . "<div class='header'>"
    . "<h1>Thank You!</h1>"
    . "</div>"
    . "<div class='content'>"
    . "<p>Hi {$name},</p>"
    . "<p>Thank you for reaching out! I've received your message and will get back to you as soon as possible, usually within 24-48 hours.</p>"
    . "<p>In the meantime, feel free to check out my latest projects and blog posts on my portfolio.</p>"
    . "<div class='social'>"
    . "<p>Connect with me:</p>"
    . "<a href='#'>GitHub</a> | "
    . "<a href='#'>LinkedIn</a> | "
    . "<a href='#'>Twitter</a>"
    . "</div>"
    . "</div>"
    . "<div class='footer'>"
    . "<p>Best regards,<br>John - DevX Portfolio</p>"
    . "<p>This is an automated response. Please do not reply to this email.</p>"
    . "</div>"
    . "</div>"
    . "</body>"
    . "</html>";
}

/* ========================================
   Simple Mail Alternative (No PHPMailer)
   Use this if PHPMailer is not available
   ======================================== */

function sendSimpleEmail($to, $subject, $message, $headers = '') {
    $defaultHeaders = "MIME-Version: 1.0
";
    $defaultHeaders .= "Content-type: text/html; charset=UTF-8
";
    $defaultHeaders .= "From: " . FROM_NAME . " <" . FROM_EMAIL . ">
";
    $defaultHeaders .= "Reply-To: " . ADMIN_EMAIL . "
";
    $defaultHeaders .= "X-Mailer: PHP/" . phpversion();

    $allHeaders = $defaultHeaders . $headers;

    return mail($to, $subject, $message, $allHeaders);
}
?>
