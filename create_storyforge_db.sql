-- to update run: mysql < create_storyforge_db.sql


DROP DATABASE IF EXISTS storyforge_db;
CREATE DATABASE storyforge_db;

-- delete user if exists
DROP USER IF EXISTS 'dev'@'localhost';

-- Use the database
USE storyforge_db;

-- Enable foreign key checks
SET foreign_key_checks = 1;

-- if tables exist, delete them
DROP TABLE IF EXISTS USER_LOGIN;
DROP TABLE IF EXISTS USER_INFO;
DROP TABLE IF EXISTS ADVENTURES;
DROP TABLE IF EXISTS TOKEN_TABLE;

-- Create USER_LOGIN Table
CREATE TABLE USER_LOGIN (
    USER_ID INT AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(255) NOT NULL,
    PASS VARCHAR(255) NOT NULL
);

-- Create USER_INFO Table
CREATE TABLE USER_INFO (
    USER_ID INT,
    EMAIL VARCHAR(255) NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USER_LOGIN(USER_ID)
);

-- Create ADVENTURES Table
CREATE TABLE ADVENTURES (
    ADVENTURE_ID INT AUTO_INCREMENT PRIMARY KEY,
    USER_ID INT NOT NULL,
    TIMESTAMP TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (USER_ID) REFERENCES USER_LOGIN(USER_ID)
);

-- CREATE TOKEN TABLE
CREATE TABLE TOKEN_TABLE (
    TOKEN CHAR(255) NOT NULL,
    EXPIRY_TIME INT NOT NULL,
    USER_ID INT NOT NULL,
    FOREIGN KEY (USER_ID) REFERENCES USER_LOGIN(USER_ID)
);

-- Create a new user 'dev' with a specified password
CREATE USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Password1!';

-- Grant privileges to the user 'dev'
GRANT ALL PRIVILEGES ON storyforge_db.* TO 'dev'@'localhost';


-- Apply changes
FLUSH PRIVILEGES;

DELIMITER //
-- INSERT USER_LOGIN
CREATE PROCEDURE insert_user_login(IN username VARCHAR(255), IN pass VARCHAR(255))
BEGIN
    -- Check if the username already exists
    DECLARE userExists INT;
    SELECT COUNT(*) INTO userExists FROM USER_LOGIN WHERE USERNAME = username;

    -- Insert the new user only if the username does not exist
    -- Signal error if the username already exists
    IF userExists > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'duplicate username';
    ELSE
        -- Insert the new user if the username does not exist
        INSERT INTO USER_LOGIN (USERNAME, PASS) VALUES (username, SHA2(pass, 256));
    END IF;
END //

DELIMITER ;


DELIMITER //
CREATE PROCEDURE validate_user(IN input_username VARCHAR(255), IN input_pass VARCHAR(255))
BEGIN
    DECLARE isValid INT DEFAULT 0;
    DECLARE userID INT;
    DECLARE token_id CHAR(255);
    SET token_id = UUID();
    SELECT COUNT(*) INTO isValid 
    FROM USER_LOGIN 
    WHERE USERNAME = input_username AND PASS = SHA2(input_pass, 256);
    IF isValid = 0 THEN
        SELECT 'Invalid' AS STATUS;
    ELSE
        SELECT USER_ID INTO userID FROM USER_LOGIN WHERE USERNAME = input_username;
        INSERT INTO TOKEN_TABLE (TOKEN, EXPIRY_TIME, USER_ID) VALUES (token_id, UNIX_TIMESTAMP() + 86400, userID); -- 1 day (we can change later)
        SELECT token_id AS TOKEN;
    END IF;
END //
DELIMITER ;


-- testing add user
CALL insert_user_login('test', 'test');

-- testing validate user
CALL validate_user('test', 'test');
CALL validate_user('test', 'test2');

