/***********************

  Load Components!
  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pug          - A view engine for dynamically rendering HTML pages
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/

const express = require('express'); // Add the express framework has been added
let app = express();

const rp = require('request-promise');

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const pug = require('pug'); // Add the 'pug' view engine

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
        database: 'project',
        user: 'postgres',
        password: ' '
};

let db = pgp(dbConfig);

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory


var eldo = JSON.parse('{"name": "Eldora", "lat": "39.9372", "lng": "-105.5827"}');
var breck = JSON.parse('{"name": "Breckenridge", "lat": " 39.480227", "lng": "-106.066698"}');
var vail = JSON.parse('{"name": "Vail", "lat": "39.6403", "lng": "-106.3742"}')
var beav = JSON.parse('{"name": "Beaver Creek", "lat": "39.6042", "lng": "-106.5165"}');
var steam = JSON.parse('{"name": "Steamboat", "lat": "40.4850", "lng": "-106.8317"}');
var key = JSON.parse('{"name": "Keystone", "lat": "39.5792", "lng": "-105.9347"}');
var abay = JSON.parse('{"name": "Arapahoe Basin", "lat": "39.6425", "lng": "-105.8719"}');
var copp = JSON.parse('{"name": "Copper", "lat": "39.5021", "lng": "106.1510"}');
var winter = JSON.parse('{"name": "Winter Park", "lat": "39.8917", "lng": "-105.7631"}');
var resorts = [eldo, breck, vail, beav, steam, key, abay, copp, winter];

//function to post data to postgres
function retrieveNpost(url, resort, id){
    rp.get(url)
      .then( (res) => {
        let data = JSON.parse(res)[0].data[1];
        let snowpack = data['Snow Depth (in)'];
        let snowfall = data['Change In Snow Depth (in)'];
        let temp = data['Observed Air Temperature (degrees farenheit)'];
        let query1 = "CREATE TABLE IF NOT EXISTS weather( id INT PRIMARY KEY, mountain VARCHAR(30) , temperature INT,wind INT, snowpack INT, snowfall INT, conditions VARCHAR(30));";
        let query2 = `INSERT INTO weather (id, mountain, temperature, snowpack, snowfall) VALUES (${id}, ${resort}, ${temp}, ${snowpack}, ${snowfall}) ON CONFLICT (id) DO UPDATE SET temperature = ${temp}, snowpack = ${snowpack}, snowfall = ${snowfall};`;
        let query3 = "CREATE TABLE IF NOT EXISTS users( user_id int PRIMARY KEY, name VARCHAR(20), email VARCHAR(20), password VARCHAR(20), age INT, car VARCHAR(50), car_color VARCHAR(20), license VARCHAR(10));";
        let query4 = "CREATE TABLE IF NOT EXISTS available_rides(ride_id VARCHAR(10) NOT NULL,	user_id VARCHAR(30) NOT NULL,	ride_date DATE NOT NULL, ride_time TIME NOT NULL,	dest_mountain VARCHAR(30) NOT NULL, start_city VARCHAR(20), ride_cost SMALLINT NOT NULL, open_seats SMALLINT NOT NULL, optional_notes TEXT, PRIMARY KEY(ride_id);";
        console.log(query2);
        db.task( 'insert data', task => {
          return task.batch([
              task.any(query1),
              task.any(query2),
              task.any(query3),
              task.any(query4)
          ]);
        }).then( data => {
          return true;
        })
          .catch( error => {
            console.log(error)
          })
      })
      .catch( (err) => {
        console.log(err)
      })
}

app.get('/', (req, res) => {
    for (resort in resorts){
      var url = "http://api.powderlin.es/closest_stations?lat=" + resorts[resort].lat + "&lng=" + resorts[resort].lng + "&data=true&days=1&count=1";
      retrieveNpost(url, "'"+resorts[resort].name+"'", resort) //single quotes added to string
    }
    res.render('/Home.html');
});

app.get('/home/search_rides', function(req, res) {
	var destMountain = req.body.inputResortDest.value;
	var startCity = req.body.inputStartCity.value;
	var departDate = req.body.departDate.value;
  var searchReq = "select * from available_rides where dest_mountain = '" + destMountain + "' and  start_city = '" + startCity + "' and ride_date = '" + departDate + "';"; //Need to fill in names of tables and columns
	db.task('get-everything', task => {
        return task.batch([
            task.any(searchReq)
        ]);
    })
    .then(info => {
    	res.send(info)
    })
    .catch(error => {
        // display error message in case an error
            console.log(err)
            })
    });

});

app.get('/home/search_weather', function(req, res) {
	var weatherMountain = req.body.inputWeatherResort.value;
  var searchReq1 = "select * from weather where mountain = '" + weatherMountain + "';";
	db.task('get-everything', task => {
        return task.batch([
            task.any(searchReq1)
        ]);
    })
    .then(info1 => {
    	res.send(info1)
    })
    .catch(error => {
        // display error message in case an error
          console.log(err)
            })
    });

});

app.listen(3000);
console.log('3000 is the magic port');
