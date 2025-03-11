var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res) {
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            if (err) {
                console.error("Error parsing the form:", err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("Error parsing form");
                return;
            }

            // Check if file exists
            if (!files.filetoupload) {
                console.error("No file uploaded");
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end("No file uploaded");
                return;
            }

            // Correctly access file path
            var uploadedFile = files.filetoupload.filepath || files.filetoupload[0]?.filepath;
            if (!uploadedFile) {
                console.error("File path is undefined");
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end("File path is undefined");
                return;
            }

            console.log("Old Path:", uploadedFile);
            
            var newpath = '/Users/iwc/Documents/' + files.filetoupload.originalFilename;
            
            fs.rename(uploadedFile, newpath, function (err) {
                if (err) {
                    console.error("Error moving file:", err);
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end("Error moving file");
                    return;
                }
                
                res.write('File uploaded and moved!');
                res.end();
            });
        });
    } else {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write('<form action="fileupload" method="post" enctype="multipart/form-data">');
        res.write('<input type="file" name="filetoupload"><br>');
        res.write('<input type="submit">');
        res.write('</form>');
        return res.end();
    }
}).listen(8080);
