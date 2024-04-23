const { database }  = require("./db");
const express = require("express");
const validator = require('validator');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = process.env.PORT;

app.use(express.json());

// register new user
app.post('/register', async(req, res) =>{
    try {
        // retrieve user info
        const {fName, lName, username, email, password} = req.body;

        // generate uuid
        const uuid = uuidv4();

        // validate email
        if(!validator.isEmail(email)){
            return res.status(401).json({message : "Invalid credentials"});
        };

        // validate password
        if(validator.isStrongPassword(password) != true){
            return res.status(401).json({message : "Not a strong enough password"});
        };

        // hash password
        let hashedPassword = await bcrypt.hash(password, 10);

        // create timestamp
        const timestamp = new Date();

        // add user to user_info DB
        const data = await database.query("INSERT INTO user_info (id, first_name, last_name, username, email, password, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;", [uuid, fName, lName, username, email, hashedPassword, timestamp]);

        res.status(201).json({status: 201, message: "Success", user: data.rows[0]});
        return

    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({status: 500, error: "Internal Server Error", message: error.message});
    };
});

// login existing user
app.post('/login', async(req, res) =>{
    try {
        const {username, password} = req.body;

        const data = await database.query('SELECT * FROM user_info WHERE (username = $1);', [username]);

        if(data.rows.length === 0){
            res.status(401).json({status: 401, error: error.message, message: "Invalid credentials"});
            return
        };
        
        if (await bcrypt.compare(password, data.rows[0].password)) {
            res.status(200).json({status: 200, message: "Success"});
            // add code to redirect to home page
            return
        } else {
            res.status(401).json({status: 401, error: error.message, message: "Invalid credentials"});
            return
        };

    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({status: 500, error: "Internal Server Error", message: error.message});
    }
});

// database.query("SELECT * FROM user_info", (err, res) =>{
//     if(err) {
//         console.log(err)
//     } else{
//         console.log(res.rows);
//     }
// });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });