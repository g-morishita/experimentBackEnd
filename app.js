const express = require("express");
const cors = require("cors");
const { all } = require("express/lib/application");
const mysql = require("mysql2");
const { DateTime } = require("luxon");

const app = express();
const connection = mysql.createConnection({
  host: "localhost",
  user: process.env.MYSQL_USER || "test",
  password: process.env.MYSQL_PASSWORD || "testtest",
  database: process.env.DATABASE || "test",
  port: 3306,
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

const PORT = process.env.BACKEND_PORT || 8080;
const CLIENT_PORT = process.env.CLIENT_PORT || 3000;

app.use(express.json()); // parse the json file that is sent from the React app.

const allowedOrigins = [
  // Allow from this specific port on localhost
  // You can add allowed origins. Now, it's empty
];

if (process.env.YOUR_OWN_IP !== undefined) {
  allowedOrigins.push(process.env.YOUR_OWN_IP + `:${CLIENT_PORT}`);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";
      console.log(msg);
      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
};

if (allowedOrigins.length !== 0) {
  app.use(cors(corsOptions));
} else {
  app.use(cors());
}

app.get("/test", (req, res) => {
  const result = connection.query("SELECT 1 + 1 AS SOLUTION");
  console.log(result);
  res.send("It is working now");
});

app.get("/assign_high_exp", (req, res) => {
  connection.query(
    `(SELECT * FROM exploration_face_assignment 
WHERE sex = 'male' AND count = (
  SELECT MIN(count) FROM exploration_face_assignment WHERE sex = 'male'
))

UNION ALL

(SELECT * FROM exploration_face_assignment 
WHERE sex = 'female' AND count = (
  SELECT MIN(count) FROM exploration_face_assignment WHERE sex = 'female'
))
`,
    (e, r, f) => {
      console.log(r);
      if (e) {
        console.log("error during get assign_high_exp");
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      res.send({ result: r });
    },
  );
});

app.post("/update_assignment", (req, res) => {
  const malePair = req.body.highExpMale;
  const femalePair = req.body.highExpFemale;
  console.log(malePair);
  console.log(femalePair);
  connection.query(
    "UPDATE exploration_face_assignment SET count = count + 1 WHERE sex = 'male' AND pair = ?",
    [malePair],
    (e, r, f) => {
      if (e) {
        console.log("error during get update_assignment");
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
    },
  );

  connection.query(
    "UPDATE exploration_face_assignment SET count = count + 1 WHERE sex = 'female' AND pair=?",
    [femalePair],
    (e, r, f) => {
      if (e) {
        console.log("error during get update_assignment");
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      res.status(200).send({ result: "done" });
    },
  );
});

app.post("/participants", (req, res) => {
  connection.query(
    "INSERT INTO participants (room_number, kind, start_time) VALUES (?, ?, ?)",
    [req.body.room_number, req.body.kind, req.body.start_time],
    (e, r, f) => {
      if (e) {
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      console.log(
        `participant ${r.insertId} has started at ${req.body.start_time}`,
      );
      res.send({ userID: r.insertId });
    },
  );
});

app.post("/individual_bandit_data", (req, res) => {
  console.log(req.body);
  connection.query(
    "INSERT INTO individual_bandit_data (participant_id, session, trial, choice, reward, rt, choice_index, reward_prob, ts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.participant_id,
      req.body.session,
      req.body.trial,
      req.body.choice,
      req.body.reward,
      req.body.rt,
      req.body.choice_index,
      req.body.reward_prob,
      DateTime.now().setZone("Australia/Melbourne").toString(),
    ],
    (e, r, f) => {
      if (e) {
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      console.log(
        `participant ${req.body.participant_id} chose ${req.body.choice} and get reward of ${req.body.reward} at ${DateTime.now().setZone("Australia/Melbourne").toString()}`,
      );
      res.send({ experimentID: r.insertId });
    },
  );
});

app.post("/face", (req, res) => {
  connection.query(
    "INSERT INTO face (participant_id, image_path, lr, beta) VALUES (?, ?, ?, ?)",
    [
      req.body.participantId,
      req.body.faceImagePath,
      req.body.lr,
      req.body.beta,
    ],
    (e, r, f) => {
      if (e) {
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      res.send({ faceId: r.insertId });
    },
  );
});

app.post("/social_bandit_data", (req, res) => {
  console.log(req.body);
  connection.query(
    "INSERT INTO social_bandit_data (participant_id, session, trial, choice, reward, rt, partner_choice, partner_reward, choice_index, reward_prob, face_id, ts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.participant_id,
      req.body.session,
      req.body.trial,
      req.body.choice,
      req.body.reward,
      req.body.rt,
      req.body.partner_choice,
      req.body.partner_reward,
      req.body.choice_index,
      req.body.reward_prob,
      req.body.face_id,
      DateTime.now().setZone("Australia/Melbourne").toString(),
    ],
    (e, r, f) => {
      if (e) {
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      console.log(
        `participant ${req.body.participant_id} chose ${req.body.choice} and get reward of ${req.body.reward} at ${DateTime.now().setZone("Australia/Melbourne").toString()}`,
      );
      console.log(
        `face ${req.body.face_id} chose ${req.body.partner_choice} and get reward of ${req.body.partner_reward} at ${DateTime.now().setZone("Australia/Melbourne").toString()}`,
      );
      res.send({ result: r });
    },
  );
});

app.post("/social_bandit_data_in_selection", (req, res) => {
  console.log(req.body);
  connection.query(
    "SELECT id FROM face WHERE participant_id = ? AND image_path = ?",
    [req.body.participant_id, req.body.face_image_path],
    (e, r, f) => {
      if (e) {
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      if (r.length !== 1)
        return res.status(500).send({ error: "Data is broken." });
      connection.query(
        "INSERT INTO social_bandit_data (participant_id, session, trial, choice, reward, rt, partner_choice, partner_reward, choice_index, reward_prob, face_id, ts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          req.body.participant_id,
          req.body.session,
          req.body.trial,
          req.body.choice,
          req.body.reward,
          req.body.rt,
          req.body.partner_choice,
          req.body.partner_reward,
          req.body.choice_index,
          req.body.reward_prob,
          r[0].id,
          DateTime.now().setZone("Australia/Melbourne").toString(),
        ],
        (e2, r2, f2) => {
          if (e2) {
            console.log(e2);
            return res.status(500).send({ error: "Database query failed" });
          }
          console.log(
            `participant ${req.body.participant_id} chose ${req.body.choice} and get reward of ${req.body.reward} at ${req.body.ts}`,
          );
          console.log(
            `face ${r[0].id} chose ${req.body.partner_choice} and get reward of ${req.body.partner_reward} at ${req.body.ts}`,
          );
          res.send({ result: r2 });
        },
      );
    },
  );
});

app.post("/observation_data", (req, res) => {
  console.log(req.body);
  connection.query(
    "INSERT INTO observation_data (participant_id, session, trial, choice, reward, choice_index, reward_prob, face_id, ts) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      req.body.participant_id,
      req.body.session,
      req.body.trial,
      req.body.choice,
      req.body.reward,
      req.body.choice_index,
      req.body.reward_prob,
      req.body.face_id,
      DateTime.now().setZone("Australia/Melbourne").toString(),
    ],
    (e, r, f) => {
      if (e) {
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      console.log(
        `participant ${req.body.participant_id} observe partner choose ${req.body.choice} and get reward of ${req.body.reward} at ${req.body.ts}`,
      );
      res.send({ result: r });
    },
  );
});

app.post("/selection_data", (req, res) => {
  console.log(req.body);
  connection.query(
    "SELECT id, image_path FROM face WHERE participant_id = ? AND image_path IN (?, ?)",
    [
      req.body.participant_id,
      req.body.leftFaceImagePath,
      req.body.rightFaceImagePath,
    ],
    (e, r, f) => {
      if (e) {
        console.log(e);
        return res.status(500).send({ error: "Database query failed" });
      }
      let leftFaceId, rightFaceId;
      for (const face of r) {
        if (face.image_path === req.body.leftFaceImagePath) {
          leftFaceId = face.id;
        }
        if (face.image_path === req.body.rightFaceImagePath) {
          rightFaceId = face.id;
        }
      }
      connection.query(
        "INSERT INTO selection_data (participant_id, session, choice, left_face_id, right_face_id, ts) VALUES (?, ?, ?, ?, ?, ?)",
        [
          req.body.participant_id,
          req.body.session,
          req.body.choice === req.body.leftFaceImagePath
            ? leftFaceId
            : rightFaceId,
          leftFaceId,
          rightFaceId,
          DateTime.now().setZone("Australia/Melbourne").toString(),
        ],
        (e, r, f) => {
          if (e) {
            console.log(e);
            return res.status(500).send({ error: "Database query failed" });
          }
          console.log(
            `left face id ${leftFaceId} right face id ${rightFaceId}`,
          );
          console.log(
            `participant ${req.body.participant_id} chose ${req.body.choice}`,
          );
        },
      );
    },
  );
});

app.post("/complete", (req, res) => {
  connection.query(
    "UPDATE participants SET end_time = ? WHERE id = ? ",
    [req.body.end_time, req.body.participant_id],
    (e, r, f) => {
      if (e) {
        console.log(e);
      }
      console.log(
        `participant ${r.insertId} has ended at ${req.body.start_time}`,
      );
      res.send({ result: r });
    },
  );
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
