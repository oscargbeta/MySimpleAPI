var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StockSchema = new Schema({
    Ticker: String,
	Sector: String,
	Country: String,
	Company: String,
	Price: Number
});

module.exports = mongoose.model('Stock', StockSchema, 'Stocks');