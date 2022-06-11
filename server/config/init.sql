CREATE DATABASE mathshowdown;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32),
    email VARCHAR(128),
    password_hash VARCHAR(256)
);