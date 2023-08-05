CREATE DATABASE todoapp;

CREATE TABLE todos (
    id varchar(255) PRIMARY KEY,
    user_email varchar(255),
    title varchar(30),
    progress int,
    date varchar(255)
);


CREATE TABLE users (
    email varchar(255) PRIMARY KEY,
    hashed_password varchar(255)
);

