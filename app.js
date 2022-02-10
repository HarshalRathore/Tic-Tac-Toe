const express = require('express');
const app = express();
const port = 3000;
const admin = require('firebase-admin');


const path = require('path');

var serviceAccount = require("./tic-tac-toe-9fdee-firebase-adminsdk-4tkhc-20776ad637.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tic-tac-toe-9fdee-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const database = admin.database();

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('index');
});

app.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/game.html'));;
});

app.post('/create-room', (req, res) => {

    const roomRef = database.ref('/rooms');
    const roomId = roomRef.push().key;
    const name = req.body.name;
    var board = [["", "", ""], ["", "", ""], ["", "", ""]];

    roomRef.child(roomId).set({
        'board': board
    })

    roomRef.child(roomId).child('user1').set({
        'user-name': name,
        'move': 1
    })


    return res.json({ name, roomId });
})

app.post('/join-room', (req, res) => {

    const roomId = req.body.roomId;
    const roomRef = database.ref('/rooms/' + roomId);
    const name = req.body.name;
    const board = [["", "", ""], ["", "", ""], ["", "", ""]];

    roomRef.child('user2').set({
        'user-name': name,
        'move': 0
    })

    return res.json({ name, roomId, board });
})

app.post('/know-move', (req, res) => {
    const roomId = req.body.roomId;
    var user1, user2, move;

    database.ref('/rooms/' + roomId + '/user1').child('user-name').once("value").then((snapshotUser1) => {
        user1 = snapshotUser1.val();
        database.ref('/rooms/' + roomId + '/user2').child('user-name').once("value").then((snapshotUser2) => {
            user2 = snapshotUser2.val();
            database.ref('/rooms/' + roomId + '/user1').child('move').once("value").then((snapshotMove) => {
                move = snapshotMove.val();
                move = move ? user1 : user2;

                return res.json({ move });
            });
        });
    });
})

app.post('/update-board', (req, res) => {
    const roomId = req.body.roomId;
    const roomRef = database.ref('/rooms/' + roomId);
    const board = req.body.board;

    roomRef.update({
        'board': board,
    })

    var user1Move;
    var user2Move;

    database.ref('/rooms/' + roomId + '/user1').child('move').once("value").then((snapshotUser1) => {
        user1Move = snapshotUser1.val();
        database.ref('/rooms/' + roomId + '/user2').child('move').once("value").then((snapshotUser2) => {
            user2Move = snapshotUser2.val();

            user1Move = user1Move ? 0 : 1;
            user2Move = user2Move ? 0 : 1;

            roomRef.child('user1').update({
                "move": user1Move
            })
            roomRef.child('user2').update({
                "move": user2Move
            })

            return res.json({ user1Move, user2Move });
        });
    });

})

app.post('/reset-board', (req, res) => {
    const roomId = req.body.roomId;
    const roomRef = database.ref('/rooms/' + roomId);

    const board = [["", "", ""], ["", "", ""], ["", "", ""]];

    roomRef.update({
        'board': board
    })

    return res.send(200);
})

app.post('/check-win', (req, res) => {
    const roomId = req.body.roomId;

    database.ref('/rooms/' + roomId + '/board').once("value").then((snapshotBoard) => {
        let board = snapshotBoard.val();
        let won = false, mark;

        if (board[0][0] == board[0][1] == board[1][2] || board[1][0] == board[1][1] == board[1][2] || board[2][0] == board[2][1] == board[2][2]) {
            won = true;
            mark = board[0][0];
        }
        if (board[0][0] == board[1][0] == board[2][0] || board[0][1] == board[1][1] == board[2][1] || board[0][3] == board[1][3] == board[2][3]) {
            won = true;
            mark = board[0][0];
        }
        if (board[0][0] == board[1][1] == board[2][2] || board[0][2] == board[1][1] == board[2][0]) {
            won = true;
            mark = board[0][0];
        }
        if (won) {
            return res.json({ won, mark });
        }
        return res.json({ won });
    });

})

app.listen(port, () => {
    console.log(`App is listning on port ${port}`);
})

module.exports = database;