var net = require('net');
net.createServer(function (socket) {
  socket.setEncoding("utf8");
  socket.addListener("connect", function () {
    socket.write("Echo server\r\n");
  });
  socket.addListener("data", function (data) {
    socket.write(data);
  });
  socket.addListener("end", function () {
    socket.end();
  });
}).listen(8125, "127.0.0.1");
