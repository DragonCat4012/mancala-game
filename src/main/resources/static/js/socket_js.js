const url = '';
let stompClient;
let gameId;
let playerType;
let gamesShown = false;
let playersShown = false;
let playerList = []
let isConnected = false;
let self = new selfPlayer("x", "x", "fff")
let sessionRef = "";

async function connectToSocket() {
    let socket = new SockJS(url + "/sow");
    stompClient = Stomp.over(socket);

    let prom = new Promise((resolve, reject) => {
        stompClient.connect({}, function (frame) {
            sessionRef = stompClient.ws._transport.url.split("sow/")[1].split("/")[1]

            stompClient.subscribe("/topic/game-progress", function (response) {
                console.log("GameUpdate Players")
                let data = JSON.parse(response.body);
                console.log(data.topic, data);

                if (data.topic == "PlayerConnect") {
                    if (playersShown) {
                        updatePlayerList()
                    }
                    // playerList.push(data.player)
                } else if (data.topic == "PlayerDisconnect") {
                    playerList.forEach((p) => {
                        if (p.sessionID == data.sessionID) {
                            p.connected = false
                            $("#playerlist").text(playerList.filter(p => p.connected == true).map(obj => obj.name).join(","));
                            if (playersShown) {
                                updatePlayerList()
                            }
                        }
                    })
                }
            })
            resolve()
        })
    });


    return prom;
}

function subscribeToGame(gameId) {
    console.log("connecting to the game");
    hideOptionsOnConnect()

    if (!isConnected) {
        stompClient.subscribe("/topic/game-progress/" + gameId, function (response) {
            isConnected = true
            hideOptionsOnConnect()

            let data = JSON.parse(response.body);
            console.log(data.topic, data);
            if (data.topic == "GameUpdate") {
                refreshGameBoard(data);
            } else if (data.topic == "PlayerUpdate") {
                let name = document.getElementById("playerlist").textContent;
                $("#playerlist").text(name + ", " + data.player.name);
                playerList.push(data.player)
            }
        })
    }

}

function hideOptionsOnConnect() {
    document.getElementById("gameParts").hidden = true

    // show userinfo
    document.getElementById("userInfo").removeAttribute("hidden");
    let name = document.getElementById("userinfoName")
    name.textContent = self.getFullName()
    name.style.color = self.color
}

async function create_game() {
    await connectToSocket()
    let name = document.getElementById("name").value;
    let nationName = document.getElementById("nationName").value;
    let nationColor = document.getElementById("nationColor").value;
    self = new selfPlayer(name, nationName, nationColor)

    console.log("qqw", sessionRef)

    if (name == null || name === '' || nationName == null || nationName === '') {
        alert("Please enter name");
    } else {
        $.ajax({
            url: url + "/game/create",
            type: 'POST',
            transports: ['websocket'],
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "name": name,
                "nationName": nationName,
                "color": nationColor,
                "sessionID": sessionRef
            }),
            success: function (data) {
                gameId = data.id;
                playerType = 'FIRST_PLAYER';
                refreshGameBoard(data);

                subscribeToGame(gameId);
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
            // subscribeToGame(gameId);
        },
        error: function (error) {
            console.log(error);
        }
    })
}

async function connectToRandom() {
    await connectToSocket()
    let name = document.getElementById("name").value;
    let nationName = document.getElementById("nationName").value;
    let nationColor = document.getElementById("nationColor").value;
    self = new selfPlayer(name, nationName, nationColor)

    if (name == null || name === '' || nationName == null || nationName === '') {
        alert("Please enter name");
    } else {
        $.ajax({
            url: url + "/game/connect/random",
            type: 'POST',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                "name": name,
                "nationName": nationName,
                "color": nationColor,
                "sessionID": sessionRef
            }),
            success: function (data) {
                gameId = data.id;
                playerType = "SECOND_PLAYER";
                refreshGameBoard(data);
                subscribeToGame(gameId);
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

async function connectToSpecificGame() {
    await connectToSocket()
    let name = document.getElementById("name").value;
    let nationName = document.getElementById("nationName").value;
    let nationColor = document.getElementById("nationColor").value;
    self = new selfPlayer(name, nationName, nationColor)

    if (name == null || name === '' || nationName == null || nationName === '') {
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
                    "name": name,
                    "nationName": nationName,
                    "color": nationColor,
                    "sessionID": sessionRef
                },
                "gameId": gameId
            }),
            success: function (data) {
                gameId = data.id;
                playerType = "SECOND_PLAYER";
                refreshGameBoard(data);
                subscribeToGame(gameId);
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
                var datestring = ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

                const nodeDateParent = document.createElement("p");
                nodeDateParent.style.color = "gray"
                const dateNode = document.createTextNode(datestring);
                nodeDateParent.appendChild(dateNode);

                // button
                const finsihButton = document.createElement('button')
                finsihButton.classList.add("btn")
                const finsihButtonText = document.createTextNode("End");
                finsihButton.appendChild(finsihButtonText)
                finsihButton.onclick = function () { endgameFromList(game.id) };

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

    if (element.style.visibility == "hidden") {
        element.style.visibility = "visible"
    } else {
        element.style.visibility = "hidden"
    }
}

function updateCopyIDButton(style) {
    let element = document.getElementById("gameIDCopy")
    element.style.visibility = style
}

function togglePlayerList() {
    playersShown = !playersShown
    let e = document.getElementById("playerSideList");

    if (playersShown) {
        updatePlayerList()
    } else {
        e.classList.remove('sidenavRight');

        let child = e.lastElementChild;
        while (child) {
            e.removeChild(child);
            child = e.lastElementChild;
        }
    }
}

function updatePlayerList() {
    let e = document.getElementById("playerSideList");
    let child = e.lastElementChild;
    while (child) {
        e.removeChild(child);
        child = e.lastElementChild;
    }

    //update
    e.classList.add('sidenavRight');
    const node = document.createElement("h3");
    node.appendChild(document.createTextNode("Connected Players"));
    node.style.color = "white"
    e.appendChild(node)

    const playerlist2 = document.createElement("div");
    playerlist2.id = "playerlist2"
    e.appendChild(playerlist2)
    setPlayers(playerList)
}

function refreshGameBoard(data) {
    /*if (data.winner != null) {
        alert("Winner is " + data.winner.name);
    }
    playerTurnNow = data.playerTurn;*/

    $("#gameLastStr").text(data.lastStr + " <3");
    $("#playerlist").text(data.connectedPlayers.filter(p => p.connected == true).map(obj => obj.name).join(","));
    playerList = data.connectedPlayers
}