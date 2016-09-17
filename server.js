'use strict'

var mime = require('mime');
var fs = require('fs');
var path = require('path');
var port = process.env.PORT || 3000;
var app = require('http').createServer(function (req, res) {
    var url = 'public' + req.url.replace(/\/$/, '/index.html');

    console.log('> ' + url);

    fs.readFile(url, function (err, data) {
        if (err) {
            res.writeHead(500);
            res.end('Error');
            return;
        }

        res.writeHead(200, {
            'Content-Type': mime.lookup(url)
        });
        res.end(data);
    })
});

app.listen(port);
console.log('Server running at http://localhost:' + port + '/');

var chatData = {
    '123456 2': [
        { userId: 2, massage: 'ヘルパーの発言', id: 1 },
        { userId: 123456, massage: 'ユーザーの発言', id: 2 },
        { userId: 2, massage: 'ヘルパーの発言', id: 3 },
        { userId: 123456, massage: 'ユーザーの発言', id: 4 },
        { userId: 123456, massage: 'ユーザーの発言', id: 5 },
    ],
    '123456 323456': [
        { userId: 123456, massage: 'ユーザーの発言', id: 1 },
        { userId: 323456, massage: 'ヘルパーの発言ヘルパーの発言ヘルパーの発言ヘルパーの発言ヘルパーの発言ヘルパーの発言', id: 2 },
        { userId: 123456, massage: 'ユーザーの発言ユーザーの発言ユーザーの発言ユーザーの発言ユーザーの発言', id: 3 },
        { userId: 323456, massage: 'ヘルパーの発言ヘルパーの発言ヘルパーの発言', id: 4 },
        { userId: 123456, massage: 'ユーザーの発言', id: 5 },
    ]
}
// 会員情報
var dataBase = {
    123456: {
        name: 'login_id',
        imageUrl: 'img/image2.jpg',
        lastLogs: [
            {
                userId: 2,
                lastLog: { massage: 'ユーザーの発言', id: 5 }
            }, {
                userId: 323456,
                lastLog: { massage: 'ユーザーの発言ユーザーの発言', id: 5 }
            }
        ]
    },
    2: {
        name: 'スティーブ',
        imageUrl: 'img/images.jpg',
        lastLogs: [
            {
                userId: 123456,
                lastLog: { massage: 'ユーザーの発言', id: 5 }
            }
        ]
    },
    323456: {
        name: 'ジョブス',
        imageUrl: 'img/image2.jpg',
        lastLogs: [
            {
                userId: 123456,
                lastLog: { massage: 'ユーザーの発言ユーザーの発言', id: 5 }
            }
        ]
    }
};
function getUserData(id) {
    return {
        userId: id,
        name: dataBase[id].name,
        imageUrl: dataBase[id].imageUrl
    }
}

var io = require('socket.io').listen(app);
var member = {};
var userIds = {};
var store = {};

io.sockets.on('connection', function (socket) {
    member[socket.id] = socket;

    function login(id) {
        userIds[id] = socket.id;

        socket.emit('logined', {
            userId: id,
            user: getUserData(id),
            chat: dataBase[id].lastLogs.map(function (chat) {
                return {
                    user: getUserData(chat.userId),
                    lastLog: chat.lastLog,
                }
            }),
        });
    }

    socket.on('login', login);
    socket.on('joinChatRoom', function (ids) {
        socket.emit('joinChatRoom', {
            id: ids[1],
            data: getRoomData(ids).map(function (massage) {
                massage.user = massage.user || getUserData(massage.userId);

                return massage;
            })
        });
    });

    socket.on('send', function (data) {
        var room = getRoomData([data.massageFrom, data.to]);
        // var newId = room[room.length - 1].id + 1
        var newId = Date.now()

        var massage = {
            id: newId,
            user: getUserData(data.massageFrom),
            massage: data.text
        }

        room.push(massage);
        console.log('#', userIds[data.to], data.text)
        if (userIds[data.to]) {
            socket.to(userIds[data.to]).emit('send', massage);
        }
    });

    socket.on('chat', function (msg) {
        io.to(store[msg.id].room).emit('chat', msg);
    });

    socket.on('disconnect', function (socket) {
        member[socket.id] = null;
        delete member[socket.id];
    });
});

function getRoomData(ids) {
    return chatData[ids.sort().join(' ')];
}