// Create web server
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var fs = require('fs');
var path = require('path');
var comments = [];

http.createServer(function(req, res) {
	//console.log(req.url);
	var url_parts = url.parse(req.url);
	//console.log(url_parts);
	//console.log(url_parts.pathname);
	var pathname = url_parts.pathname;
	if (pathname == '/') {
		//console.log('root');
		display_form(res);
	} else if (pathname == '/comment') {
		//console.log('comment');
		save_comment(req, res);
	} else {
		//console.log('other');
		res.writeHead(404, {'Content-Type': 'text/plain'});
		res.end('Page not found');
	}
}).listen(8080);

function display_form(res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	fs.readFile('comment.html', function(err, data) {
		res.end(data);
	});
}

function save_comment(req, res) {
	var body = '';
	req.on('data', function(data) {
		body += data;
	});
	req.on('end', function() {
		var post = querystring.parse(body);
		comments.push(post.comment);
		console.log(comments);
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.write('<html><head><title>Comment</title></head><body>');
		res.write('<h1>Comments</h1>');
		res.write('<ul>');
		comments.forEach(function(comment) {
			res.write('<li>' + comment + '</li>');
		});
		res.write('</ul>');
		res.write('<a href="/">Back</a>');
		res.write('</body></html>');
		res.end();
	});
}
console.log('Server running at http://localhost:8080/');
// End of comment.js