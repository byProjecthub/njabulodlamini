-- ========================================
-- DevX Portfolio Database Schema
-- ========================================

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS devx_portfolio 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE devx_portfolio;

-- ========================================
-- Contacts Table
-- Stores all contact form submissions
-- ========================================

CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    subject VARCHAR(200) DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    email_sent BOOLEAN DEFAULT FALSE,
    auto_reply_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Subscribers Table
-- For newsletter/email list (optional)
-- ========================================

CREATE TABLE IF NOT EXISTS subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(100) DEFAULT NULL,
    status ENUM('active', 'unsubscribed', 'bounced') DEFAULT 'active',
    ip_address VARCHAR(45) DEFAULT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_at TIMESTAMP NULL DEFAULT NULL,

    INDEX idx_email (email),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Blog Posts Table (optional, for future)
-- ========================================

CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT,
    content LONGTEXT,
    featured_image VARCHAR(500) DEFAULT NULL,
    category VARCHAR(100) DEFAULT 'General',
    tags VARCHAR(500) DEFAULT NULL,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views INT DEFAULT 0,
    published_at TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Admin Users Table (for admin panel)
-- ========================================

CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) DEFAULT NULL,
    role ENUM('admin', 'editor') DEFAULT 'editor',
    last_login TIMESTAMP NULL DEFAULT NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Activity Log Table
-- ========================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_action (action),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- Insert Sample Data (Optional)
-- ========================================

-- Sample admin user (password: admin123 - CHANGE IN PRODUCTION!)
-- Password hashed with bcrypt
INSERT INTO admin_users (username, email, password_hash, full_name, role) VALUES 
('admin', 'admin@devx.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin')
ON DUPLICATE KEY UPDATE id=id;

-- ========================================
-- Create Views (Optional)
-- ========================================

CREATE OR REPLACE VIEW contact_summary AS
SELECT 
    status,
    COUNT(*) as count,
    DATE(created_at) as date
FROM contacts
GROUP BY status, DATE(created_at)
ORDER BY date DESC;

-- ========================================
-- Stored Procedures (Optional)
-- ========================================

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS GetContactsByStatus(IN p_status VARCHAR(20))
BEGIN
    SELECT * FROM contacts 
    WHERE status = p_status 
    ORDER BY created_at DESC;
END //

CREATE PROCEDURE IF NOT EXISTS MarkContactAsReplied(IN p_id INT)
BEGIN
    UPDATE contacts 
    SET status = 'replied', updated_at = NOW() 
    WHERE id = p_id;
END //

DELIMITER ;

-- ========================================
-- Security: Create limited privilege user
-- ========================================

-- Uncomment and modify for production:
-- CREATE USER IF NOT EXISTS 'devx_app'@'localhost' IDENTIFIED BY 'strong_password_here';
-- GRANT SELECT, INSERT, UPDATE ON devx_portfolio.contacts TO 'devx_app'@'localhost';
-- GRANT SELECT, INSERT ON devx_portfolio.subscribers TO 'devx_app'@'localhost';
-- GRANT SELECT, INSERT ON devx_portfolio.activity_logs TO 'devx_app'@'localhost';
-- FLUSH PRIVILEGES;
