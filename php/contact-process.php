<?php
/* ========================================
   Contact Form Processor
   Saves to Database + Sends Email
   ======================================== */

session_start();
require_once 'config.php';
require_once 'mailer.php';

// Set headers for AJAX
header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse([
        'status' => 'error',
        'message' => 'Invalid request method'
    ]);
}

// Get and sanitize form data
$name = isset($_POST['name']) ? sanitize($_POST['name']) : '';
$email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
$phone = isset($_POST['phone']) ? sanitize($_POST['phone']) : '';
$subject = isset($_POST['subject']) ? sanitize($_POST['subject']) : 'General Inquiry';
$message = isset($_POST['message']) ? sanitize($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name)) {
    $errors[] = 'Name is required';
} elseif (strlen($name) < 2) {
    $errors[] = 'Name must be at least 2 characters';
}

if (empty($email)) {
    $errors[] = 'Email is required';
} elseif (!isValidEmail($email)) {
    $errors[] = 'Please enter a valid email address';
}

if (empty($message)) {
    $errors[] = 'Message is required';
} elseif (strlen($message) < 10) {
    $errors[] = 'Message must be at least 10 characters';
}

// Return errors if validation fails
if (!empty($errors)) {
    jsonResponse([
        'status' => 'error',
        'message' => implode(', ', $errors)
    ]);
}

try {
    // Save to database
    $stmt = $pdo->prepare("
        INSERT INTO contacts (name, email, phone, subject, message, ip_address, created_at, status) 
        VALUES (:name, :email, :phone, :subject, :message, :ip, NOW(), 'new')
    ");

    $stmt->execute([
        ':name' => $name,
        ':email' => $email,
        ':phone' => $phone,
        ':subject' => $subject,
        ':message' => $message,
        ':ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
    ]);

    $contactId = $pdo->lastInsertId();

    // Send email notification
    $emailSent = sendContactEmail($name, $email, $phone, $subject, $message);

    // Send auto-reply to user
    $autoReplySent = sendAutoReply($name, $email);

    // Log activity
    logActivity('Contact Form', "New message from $name ($email), ID: $contactId");

    // Return success response
    jsonResponse([
        'status' => 'success',
        'message' => 'Thank you! Your message has been sent successfully. I will get back to you soon.',
        'data' => [
            'id' => $contactId,
            'email_sent' => $emailSent,
            'auto_reply_sent' => $autoReplySent
        ]
    ]);

} catch (PDOException $e) {
    error_log("Contact Form Database Error: " . $e->getMessage());

    jsonResponse([
        'status' => 'error',
        'message' => 'Database error occurred. Please try again later.'
    ]);
} catch (Exception $e) {
    error_log("Contact Form Error: " . $e->getMessage());

    jsonResponse([
        'status' => 'error',
        'message' => 'An unexpected error occurred. Please try again.'
    ]);
}
?>
