DROP DATABASE test;
CREATE DATABASE test;
USE test;

CREATE TABLE participants
(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    room_number VARCHAR(150) NOT NULL,
    kind VARCHAR(150) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    PRIMARY KEY (id)
);

CREATE TABLE individual_bandit_data
(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    participant_id INT unsigned NOT NULL,
    session INT NOT NULL,
    trial INT NOT NULL,
    choice INT NOT NULL,
    rt REAL NOT NULL,
    reward INT NOT NULL,
    choice_index VARCHAR(150) NOT NULL,
    reward_prob VARCHAR(150) NOT NULL,
    ts DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

CREATE TABLE face
(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    participant_id INT unsigned NOT NULL,
    image_path VARCHAR(150) NOT NULL,
    lr REAL NOT NULL,
    beta REAL NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE
);

CREATE TABLE social_bandit_data
(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    participant_id INT unsigned NOT NULL,
    session INT NOT NULL,
    trial INT NOT NULL,
    choice INT NOT NULL,
    reward INT NOT NULL,
    rt REAL NOT NULL,
    partner_choice INT NOT NULL,
    partner_reward INT NOT NULL,
    choice_index VARCHAR(150) NOT NULL,
    reward_prob VARCHAR(150) NOT NULL,
    face_id INT unsigned NOT NULL,
    ts DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (face_id) REFERENCES face(id)
);

CREATE TABLE observation_data
(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    participant_id INT unsigned NOT NULL,
    session INT NOT NULL,
    trial INT NOT NULL,
    choice INT NOT NULL,
    reward INT NOT NULL,
    choice_index VARCHAR(150) NOT NULL,
    reward_prob VARCHAR(150) NOT NULL,
    face_id INT unsigned,
    ts DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (face_id) REFERENCES face(id)
);

CREATE TABLE selection_data
(
    id INT unsigned NOT NULL AUTO_INCREMENT,
    participant_id INT unsigned NOT NULL,
    session INT NOT NULL,
    choice INT NOT NULL,
    left_face_id INT unsigned,
    right_face_id INT unsigned,
    ts DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE CASCADE,
    FOREIGN KEY (left_face_id) REFERENCES face(id),
    FOREIGN KEY (right_face_id) REFERENCES face(id)
);

CREATE TABLE exploration_face_assignment
(
  id INT unsigned NOT NULL AUTO_INCREMENT,
  pair VARCHAR(150) NOT NULL,
  sex VARCHAR(150) NOT NULL,
  count INT DEFAULT 0,
  PRIMARY KEY (id)
);

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('1,2', 'male');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('1,3', 'male');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('1,4', 'male');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('2,3', 'male');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('2,4', 'male');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('3,4', 'male');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('1,2', 'female');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('1,3', 'female');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('1,4', 'female');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('2,3', 'female');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('2,4', 'female');

INSERT INTO exploration_face_assignment (pair, sex)
VALUES ('3,4', 'female');
