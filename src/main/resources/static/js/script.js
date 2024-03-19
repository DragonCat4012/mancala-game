/*var playerTurnNow = "";

function playerTurn(id) {
    if (playerTurnNow != playerType) {
        alert("It's not your turn!")
    } else {
        if ((playerType == "FIRST_PLAYER" && id > 7) || (playerType == "SECOND_PLAYER" && id < 7)) {
            alert("choose from your pits!")
            return;
        }
        var stones = $("#" + id).text();
        if (stones != "0") {
            makeAMove(id);
        }
    }
}

function makeAMove(id) {
    $.ajax({
        url: url + "/game/sow",
        type: 'POST',
        dataType: "json",
        contentType: "application/json",
        data: JSON.stringify({
            "gameId": gameId,
            "pitIndex": id
        }),
        success: function (data) {
            refreshGameBoard(data);
        },
        error: function (error) {
            console.log(error);
        }
    })
}*/

function copyGameID() {
    var copyText = document.getElementById("game_id_display");
    navigator.clipboard.writeText(copyText.textContent);
}

function setPlayers(data) {
    let parentDiv = document.getElementById("playerlist2");
  
      // create playerList
    data.forEach(player => {
        const random = Math.floor(Math.random() * colors.length);
        const node = document.createElement("div");
        node.style.height = "20px"

        const textNode = document.createElement("p");
        textNode.style.display = "inline-block"
        textNode.style.height = "20px"
        const title = document.createTextNode(player.name + ' [' + player.nationName + ']');
        textNode.appendChild(title);

        const color = document.createElement("div")
        color.classList.add("playerSideNavDiv")
        color.style.backgroundColor =  player.color

        node.appendChild(color);
        node.appendChild(textNode);
        parentDiv.appendChild(node);
    });
}
