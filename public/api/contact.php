<?php
/**
 * AL-ARYAM Website Contact API Endpoint
 * PHP 7.4+ compatible, zero dependencies.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(0);

header('Content-Type: application/json; charset=UTF-8');

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'method_not_allowed']);
    exit;
}

// Read raw body with max 10KB
$maxBodySize = 10240; // 10KB
$rawInput = file_get_contents('php://input', false, null, 0, $maxBodySize + 1);

if ($rawInput === false || strlen($rawInput) === 0) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

if (strlen($rawInput) > $maxBodySize) {
    http_response_code(413);
    echo json_encode(['ok' => false, 'error' => 'payload_too_large']);
    exit;
}

$data = json_decode($rawInput, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

// Extract and trim fields
$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$organization = trim((string)($data['organization'] ?? ''));
$service = trim((string)($data['service'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$website = trim((string)($data['website'] ?? ''));
$ts = isset($data['ts']) ? (float)$data['ts'] : 0;
$lang = trim((string)($data['lang'] ?? 'ar'));

// Honeypot check: if filled, quietly return 200 without sending email
if ($website !== '') {
    echo json_encode(['ok' => true]);
    exit;
}

// Timestamp check: if submitted in under 3 seconds, quietly return 200
$nowSeconds = microtime(true);
$submissionSeconds = $ts > 100000000000 ? ($ts / 1000) : $ts;
if ($submissionSeconds > 0 && ($nowSeconds - $submissionSeconds) < 3) {
    echo json_encode(['ok' => true]);
    exit;
}

// Enforce maximum lengths
if (
    mb_strlen($name) > 100 ||
    mb_strlen($email) > 254 ||
    mb_strlen($organization) > 150 ||
    mb_strlen($service) > 60 ||
    mb_strlen($message) > 5000
) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

// Required fields validation
if ($name === '' || $email === '' || $message === '' || mb_strlen($message) < 10) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

// Email format validation
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

// Service slug validation (allowed list)
$allowedServices = [
    '',
    'other',
    'software-development',
    'technical-support',
    'security-surveillance',
    'networks-infrastructure',
    'project-management',
    'iot',
];

if (!in_array($service, $allowedServices, true)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'validation']);
    exit;
}

// Client IP detection & rate limiting: 5 requests per IP per hour
$clientIp = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown';
// In case of multiple IPs in X-Forwarded-For, take the first one
if (strpos($clientIp, ',') !== false) {
    $parts = explode(',', $clientIp);
    $clientIp = trim($parts[0]);
}

$rateLimitDir = sys_get_temp_dir() . '/alaryam_rl';
if (!is_dir($rateLimitDir)) {
    @mkdir($rateLimitDir, 0700, true);
}

$ipHash = md5($clientIp);
$rateLimitFile = $rateLimitDir . '/' . $ipHash . '.json';
$currentTime = time();
$requests = [];

if (file_exists($rateLimitFile)) {
    $existing = json_decode((string)file_get_contents($rateLimitFile), true);
    if (is_array($existing)) {
        // Filter out timestamps older than 3600 seconds (1 hour)
        $requests = array_filter($existing, function ($timestamp) use ($currentTime) {
            return ($currentTime - (int)$timestamp) < 3600;
        });
    }
}

if (count($requests) >= 5) {
    http_response_code(429);
    echo json_encode(['ok' => false, 'error' => 'rate_limit']);
    exit;
}

// Add current timestamp and save rate limit cache
$requests[] = $currentTime;
@file_put_contents($rateLimitFile, json_encode(array_values($requests)), LOCK_EX);

// Prevent header injection: strip CR and LF from headers
$safeName = str_replace(["\r", "\n"], '', $name);
$safeEmail = str_replace(["\r", "\n"], '', $email);
$safeService = str_replace(["\r", "\n"], '', $service);

// Set timezone for Libyan local timestamp
date_default_timezone_set('Africa/Tripoli');
$dateTimeString = date('Y-m-d H:i:s T');
$userAgent = (string)($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown');

// Build email body
$to = 'Info@Alaryam.ly';
$subjectText = 'رسالة جديدة من الموقع — ' . $safeName;
$encodedSubject = mb_encode_mimeheader($subjectText, 'UTF-8', 'B', "\r\n");

$body = "تفاصيل الرسالة الواردة من موقع الأريام:\n";
$body .= "--------------------------------------------------\n";
$body .= "الاسم: " . $safeName . "\n";
$body .= "البريد الإلكتروني: " . $safeEmail . "\n";
if ($organization !== '') {
    $body .= "الجهة / المؤسسة: " . $organization . "\n";
}
if ($safeService !== '') {
    $body .= "الخدمة المطلوبة: " . $safeService . "\n";
}
$body .= "اللغة: " . ($lang === 'en' ? 'English' : 'العربية') . "\n";
$body .= "التاريخ والوقت: " . $dateTimeString . "\n";
$body .= "عنوان IP: " . $clientIp . "\n";
$body .= "المتصفح: " . $userAgent . "\n";
$body .= "--------------------------------------------------\n\n";
$body .= "نص الرسالة:\n" . $message . "\n";

$headers = [
    'From: AL-ARYAM Website <no-reply@alaryam.ly>',
    'Reply-To: ' . $safeEmail,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
];

$sent = @mail($to, $encodedSubject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    // In environments where mail() is not configured (e.g. localhost dev), respond with error or logged
    http_response_code(500);
    echo json_encode(['ok' => false, 'error' => 'server']);
}
