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

-- Create USER_LOGIN Table
CREATE TABLE USER_LOGIN (
    USER_ID INT AUTO_INCREMENT PRIMARY KEY,
    USERNAME VARCHAR(255) NOT NULL,
    PASSWORD VARCHAR(255) NOT NULL
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

-- Create a new user 'dev' with a specified password
CREATE USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Password1!';

-- Grant privileges to the user 'dev'
GRANT ALL PRIVILEGES ON storyforge_db.* TO 'dev'@'localhost';


-- Apply changes
FLUSH PRIVILEGES;