//call the packages needed for MySimpleAPI

//calling express
var express = require('express');
var app = express(); //defining the app with express
var bodyParser = require('body-parser');

//configure the app with bodyParser, which will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080; //setting the port

// connect to our database
var mongoose = require('mongoose');
// Replace <dbpassword> with actual password
mongoose.connect('mongodb://testgooduser:<dbpassword>@ds125906.mlab.com:25906/simplemongodb');

var db = mongoose.connection;

//db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log("db connection good");
});

var Stock = require('./app/models/stock');

//Routes
//setting an instance of express router
var router = express.Router(); 

// logging all requests
router.use(function(req, res, next) {
    //logging
    console.log('Request received.');
    next(); // proceed to the next routes
});

// Test url: GET http://localhost:8080/api
router.get('/', function(req, res){ 
	res.json({ message: 'Just testing my api' });
});

router.route('/stocks')

    // create a stock (accessed at POST http://localhost:8080/api/stocks)
    // .post(function(req, res) {

        // var stock = new Stock();      // create a new instance of the Stock model
        // stock.Ticker = req.body.Ticker;  // set the stock Ticker (comes from the request)

		// save the stock and check for errors
        // stock.save(function(err) {
            // if (err)
                // res.send(err);

            // res.json({ message: 'Stock created!' });
        // });

    // })
	
	// get all the stocks (accessed at GET http://localhost:8080/api/stocks)
    .get(function(req, res) {
        console.log('Attempting to fetch all Stocks!');
		Stock.find({}, '-_id Ticker', function(err, stocks) {
            if (err)
			  res.send(err);

            res.json(stocks);
			
        });
    });


// Routes that end in /stocks/:stock_ticker
router.route('/stocks/:stock_ticker')

    // Get the stock with that id (accessed at GET http://localhost:8080/api/stocks/:stock_ticker)
    .get(function(req, res) {
		console.log('Attempting to find ticker: ' + req.params.stock_ticker);
		Stock.findOne({ 'Ticker': req.params.stock_ticker }, '-_id Ticker Sector Country Company Price', function (err, stock) {
		  if (err) 
			res.send(err);
		
		  //console.log('Ticker:%s Sector:%s Country:%s Company:%s Price:%s', stock.Ticker, stock.Sector, stock.Country, stock.Company, stock.Price.toString());
		  res.json(stock);
		});        
    });
	
//routes will be prefixed with /api
app.use('/api', router);

// Start the server
app.listen(port);
console.log('API on port ' + port);
