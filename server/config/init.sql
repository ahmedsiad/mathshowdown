CREATE DATABASE mathshowdown;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32),
    email VARCHAR(128),
    password_hash VARCHAR(256),
    rating int,
    registration_date bigint
);

CREATE TABLE contests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    division int,
    start_time bigint,
    end_time bigint
);

CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    problem_index VARCHAR(1),
    problem_text VARCHAR,
    answer VARCHAR(32)
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    tag VARCHAR(64)
);

CREATE TABLE problem_tags (
    problem_id int REFERENCES problems(id),
    tag_id int REFERENCES tags(id),
    PRIMARY KEY (problem_id, tag_id)
);

CREATE TABLE participants (
    user_id int REFERENCES users(id),
    contest_id int REFERENCES contests(id),
    PRIMARY KEY (user_id, contest_id),
    rating_before int,
    rating_after int,
    solved int,
    rank int
);

CREATE TABLE submissions (
    user_id int REFERENCES users(id),
    problem_id int REFERENCES problems(id),
    PRIMARY KEY (user_id, problem_id),
    answer VARCHAR(32),
    submission_time bigint,
    verdict boolean
);