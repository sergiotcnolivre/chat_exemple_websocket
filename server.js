const express = require('express');
const path = require('path');

const app = express();
//configurando o protocolo HTTP
const server = require('http').createServer(app);
//configurando o protocolo Websocket
const io = require('socket.io')(server);

//arquivos públicos acessados pela aplicação
app.use(express.static(path.join(__dirname, 'public')));
//defininco como padrão de view o HTMl pois o node usa por padrão ejs
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log(`Socket conectado: ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        messages.push(data);
        socket.broadcast.emit('recivedMessage', data);
    })
});

server.listen(3000);