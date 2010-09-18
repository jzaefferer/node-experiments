var http = require('http');
var parse = require('url').parse;
var fs = require('fs');
var client = http.createClient(80, '192.168.50.121');

function update(name, value, callback) {
	var request = client.request('/ctrl.cgi?' + name + '=' + value);
	request.end();
	request.on('response', function (response) {
		response.setEncoding('utf8');
		var body = "";
		response.on('data', function (chunk) {
			body += chunk;
		});
		response.on('end', function() {
			var inputs = body.match(/<input class="bt" .+?>/g);
			var sockets = inputs.map(function(input) {
				var parts = input.match(/type="submit" value="(\d+?)" name="(.+?)" /);
				return {
					value: parts[1],
					name: parts[2]
				};
			});
			callback(sockets);
		});
	});
}


if (process.argv.length == 3) {
	update(process.argv[2] || 0, function(sockets) {
		console.log(JSON.stringify(sockets));
	});
} else {
	var http = require('http');
	var port = 8124;
	var ui = fs.readFileSync("ui.html", "utf-8");
	http.createServer(function (req, res) {
		var params = parse(req.url, true);
		console.log(JSON.stringify(params));	
		if (params.pathname == "/") {
			res.writeHead(200, {'Content-Type': 'text/html'});
			res.end(ui);
		} else {
			update(params.query.name, params.query.value, function(sockets) {
				res.writeHead(200, {'Content-Type': 'text/json'});
				res.end(JSON.stringify(sockets));
			});
		}
	}).listen(port, "127.0.0.1");
	console.log('Server running at http://127.0.0.1:' + port + '/');
}
