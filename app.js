const { database }  = require("./public/db");
const express = require("express");
const validator = require('validator');
const bcrypt = require('bcrypt');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { availability } = require('./public/availability');
const { check_time_off } = require('./public/check_time_off');
const { error } = require("console");
const app = express();
const port = process.env.PORT;

// QUESTIONS
// 1. how can i send my console logs back to frontend (or json)
// 2. should i store the user in the session

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

// render calender page
app.get('/time_off', async(req, res) =>{
    try {
        res.render('ejs/request_time_off')
        
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

app.post('/request_time_off', async(req, res) =>{
    try {
        const { username, start_date, end_date, reason } = req.body;

        // pull timestamp from date inputs 
        const start = new Date(start_date);
        const end = new Date(end_date);
         
        // checking to see if username inputted exists
        // need to change this so that they can only use their username
        const user = await database.query('SELECT id FROM user_info WHERE username = $1;', [username]);

        if(user.rows.length === 0){
            return res.status(401).json({status: 401, message: "Username enetered was not found"});
        };

        const user_id = user.rows[0].id;

        const check = await check_time_off(start, end, user_id);

        if(check){
            return res.status(400).json({status: 400, message: "You have already requested this time off", reason: user.rows[0].reason});
        };

        await database.query(
            'INSERT INTO time_off (worker, approved, start_time, end_time, reason, created_at) VALUES ($1, $2, $3, $4, $5, $6);',
            [user_id, false, start, end, reason, new Date()]
        );

        console.log("Request has been sent");
        res.status(201).json({status: 201, message: "Your time off has been sent in and it waiting approval"})

    } catch (error) {
        console.error('Error sending time off request:', error);
        res.status(500).json({status: 500, error: "internal server error", message: error.message});
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
