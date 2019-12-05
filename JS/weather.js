/***********************
 
  Load Components!
  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pug          - A view engine for dynamically rendering HTML pages
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/

const express = require('express'); // Add the express framework has been added
const request = require('request');
let app = express();

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

//Create Database Connection
const pgp = require('pg-promise')();


/**********************
  
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: named weather
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
**********************/
// REMEMBER to chage the password

const dbConfig = {
        host: 'localhost',
        port: 5432,
        database: 'weather',
        user: 'postgres',
        password: ' '
};

let db = pgp(dbConfig);

//app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory

app.get('/', (req, res) => {
    var resort_id = 303001;
    var url = "https://api.weatherunlocked.com/api/resortforecast/"+resort_id+"?app_id=d44f1845&app_key=5a6a2d2d9719e39d3ba892ac6c320680";
    request.get(url, (err, res) => {
        console.log(res);
    })
    res.send('Hello Boi!');
});

app.listen(3000);
console.log('3000 is the magic port');