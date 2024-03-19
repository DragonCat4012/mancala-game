const url = '';
let stompClient;
let gameId;
let playerType;
let gamesShown = false;
let playersShown = false;
let playerList =[]

function connectToSocket(gameId) {
    console.log("connecting to the game");
    let socket = new SockJS(url + "/sow");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log("connected to the frame: " + frame);
        stompClient.subscribe("/topic/game-progress/" + gameId, function (response) {
            let data = JSON.parse(response.body);
            console.log(data.topic, data);
            if (data.topic == "GameUpdate") {
                refreshGameBoard(data);
            } else if (data.topic == "PlayerUpdate") {
                playerList.push(data.player)
            }
        })
    })
}

function create_game() {
    let name = document.getElementById("name").value;
    if (name == null || name === '') {
        alert("Please enter name");
    } else {
        $.ajax({
            url: url + "/game/create",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "name": name
            }),
            success: function (data) {
                gameId = data.id;
                playerType = 'FIRST_PLAYER';
                refreshGameBoard(data);
                connectToSocket(gameId);
                document.getElementById("playElemnt").textContent = "Doggo";
                document.getElementById("game_id_display").textContent = data.id;
                updateCopyIDButton("visible")
             //   alert("Your created a game. Game id is: " + data.id);
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
}

function makeTurn() {
    let name = document.getElementById("playElemnt").textContent;

    $.ajax({
        url: url + "/game/move",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "gameId": gameId,
            "newName": name
        }),
        success: function (data) {
            gameId = data.id;
            refreshGameBoard(data);
            connectToSocket(gameId);
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function connectToRandom() {
    let name = document.getElementById("name").value;
    if (name == null || name === '') {
        alert("Please enter name");
    } else {
        $.ajax({
            url: url + "/game/connect/random",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "name": name
            }),
            success: function (data) {
                gameId = data.id;
                playerType = "SECOND_PLAYER";
                refreshGameBoard(data);
                connectToSocket(gameId);
                document.getElementById("playElemnt").textContent = "Gatze";
                document.getElementById("game_id_display").textContent = data.id;
                alert("Congrats you're playing with: " + data.firstPlayer.name);
                updateCopyIDButton("visible")
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
}

function showAllGames() {
    deleteOldGameslog()

    if (gamesShown) {
        gamesShown = false;
        return
    }
    gamesShown = true;
    loadGameLog()
}

function loadGameLog() {
    $.ajax({
        url: url + "/game/gameslog",
        type: 'GET',
        success: function (data) {
            let div = document.getElementById("gameslog");
            const titleNode = document.createElement("h3");
            const title = document.createTextNode("Active Games");
            titleNode.appendChild(title);
            div.appendChild(titleNode);
            div.classList.add('sidenav');
            
            for (const game of data) {
                // ...use `element`...
                const node = document.createElement("div");
                node.id = "gamesLogEntry"
                const gameiD = document.createTextNode(game.id);

                // date
                var d = new Date(game.createdAt)
                var datestring = ("0" + d.getDate()).slice(-2) + "." + ("0"+(d.getMonth()+1)).slice(-2) + "." +  d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                const nodeDateParent = document.createElement("p");
                nodeDateParent.style.color = "gray"
                const dateNode = document.createTextNode(datestring);
                nodeDateParent.appendChild(dateNode);

               // button
                const finsihButton = document.createElement('button')
                finsihButton.classList.add("btn")
                const finsihButtonText = document.createTextNode("End");
                finsihButton.appendChild(finsihButtonText)
                finsihButton.onclick = function(){endgameFromList(game.id)};

                node.appendChild(gameiD);
                node.appendChild(nodeDateParent);
                node.appendChild(finsihButton);
                div.appendChild(node);
            }
        },
        error: function (error) {
            console.log(error);
        }
    })
}

function endgameFromList(gameId) {
$.ajax({
    url: url + "/game/endgame",
    type: 'POST',
    dataType: "json",
    contentType: "application/json",
    data: gameId,
    success: function () {
        showAllGames()
    },
    error: function (error) {
       // console.log(error);
        showAllGames()
    }
})
}

function deleteOldGameslog() {
    let e = document.getElementById("gameslog");
    e.classList.remove('sidenav');
        //e.firstElementChild can be used. 
        let child = e.lastElementChild;
        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
}

function hideGameOptions() {
    let element = document.getElementById("gameParts")

    if (element.style.visibility=="hidden") {
        element.style.visibility="visible"
    } else {
        element.style.visibility="hidden"
    } 
}

function updateCopyIDButton(style) {
    let element = document.getElementById("gameIDCopy")
    element.style.visibility=style
}

function connectToSpecificGame() {
    let name = document.getElementById("name").value;
    if (name == null || name === '') {
        alert("Please enter name");
    } else {
        gameId = document.getElementById("game_id").value;
        if (gameId == null || gameId === '') {
            alert("Please enter game id");
        }
        $.ajax({
            url: url + "/game/connect",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "player": {
                    "name": name
                },
                "gameId": gameId
            }),
            success: function (data) {
                gameId = data.id;
                playerType = "SECOND_PLAYER";
                refreshGameBoard(data);
                connectToSocket(gameId);
                document.getElementById("playElemnt").textContent = "Gatze";
                document.getElementById("game_id_display").textContent = data.id;
                updateCopyIDButton("visible")
            //    alert("Congrats you're playing with: " + data.firstPlayer.name);
            },
            error: function (error) {
                console.log(error);
            }
        })
    }
}

function togglePlayerList() {
    playersShown = !playersShown
    let e = document.getElementById("playerSideList");

    if (playersShown) {
        e.classList.add('sidenavRight');
        const node = document.createElement("h3");
        node.appendChild(document.createTextNode("Connected Players"));
        node.style.color = "white"
        e.appendChild(node)
        
        const playerlist2 = document.createElement("div");
        playerlist2.id = "playerlist2"
        e.appendChild(playerlist2)
        setPlayers(playerList)
    } else {
        e.classList.remove('sidenavRight');

        let child = e.lastElementChild;
        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
    }
}