var http = require('http');
var formidable = require('formidable');
var fs = require('fs');
//Modify logFile to change the name of the, well, log file
var logFile = "nodeHistory.log";

console.log('Using directory ' + __dirname);

http.createServer(function (req, res) {
  if (req.url == '/uploaded') {
	res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("This is a simple Node example. It uses formidable to upload a file, and fs to update a log (nodeHistory.log). The uploaded file is moved to the local directory of simplenode.js. <br> <br>");
	res.write("Currently uploading to " + __dirname + '\\ <br> <br>');
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      var oldpath = files.uploaded.path;
      var newpath = __dirname + '\\' + files.uploaded.name;
      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.write(files.uploaded.name + ' uploaded. <br>');
		var newUpload = req.connection.remoteAddress + ' uploaded ' + files.uploaded.name + ' at ' + Date();
		record(newUpload, logFile);
        res.end();
      });
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
	res.write("This is a simple Node example. It uses formidable to upload a file, and fs to update a log (nodeHistory.log). The uploaded file is moved to the local directory of simplenode.js. <br> <br>");
	var logVisitor = "User IP " + req.connection.remoteAddress + " visited at " + Date();
	record(logVisitor, logFile);
	res.write("Currently uploading to " + __dirname + '\\ <br> <br>');
    res.write('<form action="uploaded" method="post" enctype="multipart/form-data">');
    res.write('<input type="file" name="uploaded"><br>');
    res.write('<input type="submit">');
    res.write('</form>');
    return res.end();
  }
}).listen(1453);

function record(logText, logFile){
  var logText2 = logText + ".\n";
  console.log(logText);
  fs.appendFile(logFile, logText2, function(err){
	if (err) throw err;
  });
}