DROP DATABASE IF EXISTS webappdb;
CREATE DATABASE webappdb;
USE webappdb;

CREATE TABLE campaigns (
  id integer PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  amount VARCHAR(255) NOT NULL
);
INSERT INTO campaigns (name, amount)
values
("March Charity", "5000"), ("Help Turkey and Syria Campaign", "10000"), ("Indigenous Honorary Fund", "4000");