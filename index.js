var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/rates', function(req, res) {
	res.render('pages/rates', calculateRate(req.query.mailType, req.query.weight));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

function calculateRate(mailType, weight) {
	var mt = parseInt(mailType) || 0;
	var wt = parseFloat(weight) || 0;
	var rate = 0;

	if (mt < 1 || mt > 4) mt = 0;
	if (mt > 0 && mt < 4) {
		var br = wt > 3.5 || mt == 3 ? 0.77 : (mt == 1 ? 0.28 : 0.25);
		rate = br + (Math.ceil(wt) * 0.21);
	} else if (mt === 4) {
		rate = wt <= 4 ? 2.67 : (1.95 + (Math.ceil(wt) * 0.18));
	}

	rate = Math.round(rate * 100.0);
	rate = { dollars: Math.round((rate - (rate % 100)) / 100), cents: rate % 100 };
	rate.cents = (rate.cents < 10 ? "0" : "") + rate.cents;

	return { mailType: mt, weight: wt, rate: rate };
}
