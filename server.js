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
        { userId: 2, massage: 'ヘルパーの発言', id: 1, date: 1474140000000 },
        { userId: 123456, massage: 'ユーザーの発言', id: 2, date: 1474145000000 },
        { userId: 2, massage: 'ヘルパーの発言', id: 3, date: 1474145800000 },
        { userId: 123456, massage: 'ユーザーの発言', id: 4, date: 147414589000 },
        { userId: 123456, massage: 'ユーザーの発言', id: 5, date: 1474145896357 },
    ],
    '123456 323456': [
        { userId: 123456, massage: 'ユーザーの発言', id: 1, date: 1474140000000 }
    ]
}
function getLastLog(ids) {
    return getRoomData(ids).slice().reverse()[0];
}
// 会員情報
var dataBase = {
    123456: {
        name: 'login_id',
        imageUrl: 'img/image2.jpg',
        lastLogs: [
            {
                userId: 2,
                notCheck: 0
            }, {
                userId: 323456,
                notCheck: 0
            }
        ]
    },
    2: {
        name: 'スティーブ',
        imageUrl: 'img/images.jpg',
        lastLogs: [{
            userId: 123456,
            notCheck: 0
        }]
    },
    323456: {
        name: 'ジョブス',
        imageUrl: 'img/image2.jpg',
        lastLogs: [{
            userId: 123456,
            notCheck: 0
        }]
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
var userIds = {};
var store = {};

io.sockets.on('connection', function (socket) {
    socket.on('getHelperListData', function (id) {
        if (typeof id !== 'number') {
            if (id[1] != null) getLastLogFromDataBase(id[0], id[1]).notCheck = 0;
            id = id[0];
        }
        userIds[id] = socket.id;

        socket.emit('logined', {
            userId: id,
            user: getUserData(id),
            chat: dataBase[id].lastLogs.map(function (data) {
                return {
                    user: getUserData(data.userId),
                    lastLog: getLastLog([id, data.userId]),
                    notCheck: data.notCheck
                };
            }).sort(function (a, b) {
                return b.lastLog.date - a.lastLog.date;
            })
        });
    });
    socket.on('joinChatRoom', function (ids) {
        getLastLogFromDataBase(ids[1], ids[0]).notCheck = 0;

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
        var last = room[room.length - 1];
        var newId = last ? last.id + 1 : 0;
        // var newId = Date.now()

        var massage = {
            id: newId,
            user: getUserData(data.massageFrom),
            massage: data.text,
            date: Date.now()
        }

        room.push(massage);

        getLastLogFromDataBase(data.to, data.massageFrom).notCheck++

        if (userIds[data.to]) {
            socket.to(userIds[data.to]).emit('send', massage);
        }
    });

    socket.on('chat', function (msg) {
        io.to(store[msg.id].room).emit('chat', msg);
    });

    socket.on('disconnect', function (socket) {
    });
});

function getRoomData(ids) {
    return chatData[ids.sort().join(' ')];
}

function getLastLogFromDataBase(selfId, opponentId) {
    var lastLogs = dataBase[selfId].lastLogs;
    var lastLog = lastLogs.filter(function (v) {
        return v.userId === opponentId;
    });

    if (!lastLog) {
        lastLog = {
            userId: opponentId,
            notCheck: 0
        };

        lastLogs.push(lastLog);

        return lastLog;
    }

    return lastLog[0];
}