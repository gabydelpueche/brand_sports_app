const { database }  = require("./public/db");
const express = require("express");
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { availability } = require('./public/availability');
const e = require("express");
const app = express();
const port = process.env.PORT;

// set ejs as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// GET REQUESTS
// render calender page
app.get('/', async(req, res) =>{
    try {
        res.render('ejs/register')
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    
    };
});

app.get('/login', async(req, res) =>{
    try {
        res.render('ejs/login')
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    
    };
});

// render calender page
app.get('/calender', async(req, res) =>{
    try {
        res.render('ejs/calender')
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    
    };
});

// render home page
app.get('/home', async(req, res) =>{
    try {
        res.render('ejs/home')
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal Server Error');
    
    };
});

// generate workers
app.get('/available_workers', async(req, res) =>{
    try {
        const { start_date } = req.query;
        // const start_date = new Date(parseInt(date));
        const get_date = start_date.getDate();
        const end_date = new Date(start_date).setDate(get_date + 1);

        // const x = new Date(end_date)
        
        // console.log(date)
        // console.log(start_date);
        // console.log(end_date);
        // console.log(x);

        availability(start_date, end_date);

        res.status(200).json({status: 200, workers: data.rows});

    } catch (error) {
        console.error('error loading users:', error);
        res.status(500).json({status: 500, error: "internal server error", message: error.message});
    };
});



// POST REQUESTS
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

        // add user into time_off DB
        await database.query("INSERT INTO time_off (worker) VALUES ($1);", [uuid])

        // res.status(201).json({status: 201, message: "Success", user: data.rows[0]});
        // return

        res.redirect('/home')

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
            // res.status(200).json({status: 200, message: "Success"});
            // // add code to redirect to home page
            // return

            res.redirect('/home');
        } else {
            res.status(401).json({status: 401, error: error.message, message: "Invalid credentials"});
            return
        };

    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({status: 500, error: "Internal Server Error", message: error.message});
    }
});


// database.query("select * from user_info", (err, res) =>{
//     if(err) {
//         console.log(err)
//     } else{
//         console.log(res.rows);
//     }
// });

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});