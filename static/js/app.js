const http = require('http')
const app = http.createServer()
var fs = require('fs');
const io = require('socket.io')(app);

 app.on('request',(req,res) >={
	 fs.readFile(__dirname + '/index.html',
		function (err, data) {
		  if (err) {
			res.writeHead(500);
			return res.end('Error loading index.html');
		  }
		  res.writeHead(200);
		  res.end(data);
		});
	 
	 })
 /*app.listen(8080,() =>{
	 console.log('服务器启动成功');
	 });*/

/*function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}*/
//监听用户链接事件
io.on('connection', function (socket) {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});