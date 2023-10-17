const express = require('express');
const cors = require('cors');
const sqlite3 = require("sqlite3").verbose();

const app = express();
const db = new sqlite3.Database("./experiment.db");

app.use(express.json()); // parse the json file that is sent from the React app.

const allowedOrigins = [
    'http://localhost:3000',  // Allow from this specific port on localhost
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            console.log(msg);
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    }
};

app.use(cors(corsOptions));

app.post('/save', (req, res) => {
    console.log(`${req.body.ID} is doing the experiment at ${Date.now().toString()}`);
    const userInput = req.body;

    db.run(`INSERT INTO pilot_individual_bandit_experiment VALUES ();`, (err) => {
        if (err) {
            res.status(500).send("Error inserting data");
            return;
        }
        res.send("Data inserted!");
    });

});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
