CREATE DATABASE mathshowdown;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(32),
    email VARCHAR(128),
    password_hash VARCHAR(256),
    rating int NOT NULL default 1500,
    registration_date bigint,
    is_admin boolean NOT NULL default False,
    UNIQUE(username),
    UNIQUE(email)
);

CREATE TABLE btokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(256)
);

CREATE TABLE contests (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    division int,
    start_time bigint,
    end_time bigint,
    graded boolean NOT NULL default False
);

CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(64),
    problem_index VARCHAR(1),
    problem_text VARCHAR,
    answer VARCHAR(32),
    image_url VARCHAR(64),
    contest_id int REFERENCES contests(id)
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
    id SERIAL PRIMARY KEY,
    user_id int REFERENCES users(id),
    contest_id int REFERENCES contests(id),
    UNIQUE(user_id, contest_id),
    rating_before int,
    rating_after int,
    solved int,
    penalty int,
    rank int
);

CREATE TABLE submissions (
    participant_id int REFERENCES participants(id),
    problem_id int REFERENCES problems(id),
    PRIMARY KEY (participant_id, problem_id),
    answer VARCHAR(32),
    submission_time bigint,
    verdict boolean
);

CREATE TABLE authors (
    user_id int REFERENCES users(id),
    contest_id int REFERENCES contests(id),
    PRIMARY KEY (user_id, contest_id)
);

INSERT INTO tags (tag) VALUES ('Geometry');
INSERT INTO tags (tag) VALUES ('Algebra');
INSERT INTO tags (tag) VALUES ('Trigonometry');
INSERT INTO tags (tag) VALUES ('Calculus');
INSERT INTO tags (tag) VALUES ('Linear Algebra');
INSERT INTO tags (tag) VALUES ('Number Theory');
INSERT INTO tags (tag) VALUES ('Probability');
INSERT INTO tags (tag) VALUES ('Logic');
INSERT INTO tags (tag) VALUES ('Combinatorics');
INSERT INTO tags (tag) VALUES ('Graph Theory');
INSERT INTO tags (tag) VALUES ('Complex Numbers');