-- Drop existing tables to ensure clean state
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS email_reminders; -- just in case
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS call_logs;
DROP TABLE IF EXISTS hr_contacts;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS preapproved_emails;
DROP TABLE IF EXISTS users;

-- ======================
-- USERS TABLE
-- ======================
CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    full_name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20),
    is_approved BOOLEAN DEFAULT FALSE,
    branch VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    verification_token TEXT,
    verification_token_expires_at TIMESTAMP NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    
    reset_password_token TEXT,
    reset_password_token_expires_at TIMESTAMP NULL,
    last_active_at TIMESTAMP NULL
);

-- ======================
-- COMPANIES TABLE
-- ======================
CREATE TABLE companies (
    company_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    company_name VARCHAR(150),
    website VARCHAR(255),
    industry_sector VARCHAR(100),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- HR CONTACTS TABLE
-- ======================
CREATE TABLE hr_contacts (
    contact_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    full_name VARCHAR(100),
    company_id CHAR(36),
    designation VARCHAR(100),
    email VARCHAR(100),
    phone_1 VARCHAR(20),
    phone_2 VARCHAR(20),
    linkedin_profile VARCHAR(255),
    source VARCHAR(100),
    status VARCHAR(20),
    notes TEXT,
    tags TEXT,
    discipline VARCHAR(100),
    contact_type VARCHAR(50),
    deletion_requested BOOLEAN DEFAULT FALSE,
    past_engagement TEXT,
    added_by_user_id CHAR(36),
    is_approved BOOLEAN DEFAULT FALSE,
    assigned_to_user_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (company_id) REFERENCES companies(company_id) ON DELETE CASCADE,
    FOREIGN KEY (added_by_user_id) REFERENCES users(user_id),
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(user_id)
);

-- ======================
-- CALL LOGS TABLE
-- ======================
CREATE TABLE call_logs (
    log_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    contact_id CHAR(36),
    caller_id CHAR(36),
    call_mode VARCHAR(50),
    call_outcome VARCHAR(50),
    hiring_tag VARCHAR(50),
    duration INTEGER,
    conversation_summary TEXT,
    next_follow_up_date DATE,
    call_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    admin_comments TEXT,
    recruitment_cycle VARCHAR(20),

    FOREIGN KEY (contact_id) REFERENCES hr_contacts(contact_id) ON DELETE CASCADE,
    FOREIGN KEY (caller_id) REFERENCES users(user_id)
);

-- ======================
-- ATTACHMENTS TABLE
-- ======================
CREATE TABLE attachments (
    attachment_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    log_id CHAR(36),
    file_url VARCHAR(255),
    file_name VARCHAR(150),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (log_id) REFERENCES call_logs(log_id) ON DELETE CASCADE
);

-- ======================
-- PREAPPROVED EMAILS
-- ======================
CREATE TABLE preapproved_emails (
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- NOTIFICATIONS TABLE
-- ======================
CREATE TABLE notifications (
    notification_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    user_id CHAR(36),
    title VARCHAR(255),
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ======================
-- FILES TABLE (REPLACING CLOUDINARY)
-- ======================
CREATE TABLE files (
    file_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    mime_type VARCHAR(100),
    file_data LONGBLOB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================
-- THREADS TABLE
-- ======================
CREATE TABLE threads (
    thread_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    author_id CHAR(36),
    title VARCHAR(255) NOT NULL,
    text TEXT,
    file_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE SET NULL
);

-- ======================
-- COMMENTS TABLE
-- ======================
CREATE TABLE comments (
    comment_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    thread_id CHAR(36),
    author_id CHAR(36),
    text TEXT,
    file_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (thread_id) REFERENCES threads(thread_id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (file_id) REFERENCES files(file_id) ON DELETE SET NULL
);

-- ======================
-- THREAD VOTES
-- ======================
CREATE TABLE thread_upvotes (
    thread_id CHAR(36),
    user_id CHAR(36),
    PRIMARY KEY (thread_id, user_id),
    FOREIGN KEY (thread_id) REFERENCES threads(thread_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE thread_downvotes (
    thread_id CHAR(36),
    user_id CHAR(36),
    PRIMARY KEY (thread_id, user_id),
    FOREIGN KEY (thread_id) REFERENCES threads(thread_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ======================
-- JOB POSTINGS
-- ======================
CREATE TABLE job_postings (
    job_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    required_skills TEXT, -- Store as JSON array or comma separated
    job_type VARCHAR(50) NOT NULL, -- 'on-campus', 'off-campus'
    batch INTEGER NOT NULL,
    deadline DATETIME,
    application_link VARCHAR(255),
    expiry DATETIME,
    author VARCHAR(255),
    relevance_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ======================
-- SAVED JOBS
-- ======================
CREATE TABLE saved_jobs (
    user_id CHAR(36),
    job_id CHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, job_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_postings(job_id) ON DELETE CASCADE
);

-- ======================
-- JOB APPLICATIONS
-- ======================
CREATE TABLE job_applications (
    application_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    student_id CHAR(36),
    job_id CHAR(36),
    resume_url VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    status VARCHAR(50) DEFAULT 'applied',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_postings(job_id) ON DELETE CASCADE
);

-- ======================
-- STUDENTS PROFILE
-- ======================
CREATE TABLE students (
    student_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    user_id CHAR(36) UNIQUE,
    discipline VARCHAR(255) NOT NULL,
    program VARCHAR(255) DEFAULT '',
    cgpa FLOAT,
    status VARCHAR(50) NOT NULL,
    student_roll_no VARCHAR(100) UNIQUE NOT NULL,
    batch INTEGER NOT NULL,
    resume_link VARCHAR(255),
    profile_photo_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- ======================
-- STUDENT OFF-CAMPUS JOB STATUS (replaces Jobstatus array in student schema)
-- ======================
CREATE TABLE student_offcampus_jobs (
    record_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    student_id CHAR(36),
    job_id CHAR(36),
    application_status VARCHAR(50),
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

-- ======================
-- ALUMNI
-- ======================
CREATE TABLE alumni (
    alumni_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    linkedin VARCHAR(255),
    institute_id VARCHAR(100) NOT NULL,
    mobile_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    batch INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alumni_jobs (
    record_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    alumni_id CHAR(36),
    job_id VARCHAR(255), -- Could potentially reference job_postings if related
    role VARCHAR(255),
    FOREIGN KEY (alumni_id) REFERENCES alumni(alumni_id) ON DELETE CASCADE
);

-- ======================
-- REFERRALS
-- ======================
CREATE TABLE referrals (
    referral_id CHAR(36) PRIMARY KEY DEFAULT UUID(),
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255) NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    job_id VARCHAR(255) NOT NULL,
    resume_link VARCHAR(255) NOT NULL,
    alumni_email VARCHAR(255),
    referral_link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
