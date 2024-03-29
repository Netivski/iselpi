// Game MVC initializer

var Game = new Object();

Game.init = function() {

    if (addJsFile != undefined) return;

    var addJsFile = function(filename) {
        $("<script/>").attr("type", "text/javascript").attr("src", filename).appendTo($("head"));
    }

    addJsFile("Source/Constants.js");
    addJsFile("Source/HttpRequest.js");
    addJsFile("Source/BoardMVC.js");
    addJsFile("Source/Cell.js");
    addJsFile("Source/Player.js");

    GameModel.init();
    GameView.init();
    GameController.init();
}


// Game Model ---------------------------------------------------------------------------------------

var GameModel = new Object();
GameModel.init = function() {

    // Players will be processed in Player.js

    var _gStatus = -1;
    var _gName = null;
    var _pName = null;
    var _pId = 0;
    var _activePlayer = 0;

    this.setGameName = function(gName) { _gName = gName; }
    this.getGameName = function() { return _gName; }

    this.setGameStatus = function(gStatus) { _gStatus = gStatus; }
    this.getGameStatus = function() { return _gStatus; }

    this.setPlayerName = function(pName) { _pName = pName; }
    this.getPlayerName = function() { return _pName; }

    this.setPlayerId = function(pId) { _pId = pId; }
    this.getPlayerId = function() { return _pId; }

    this.setActivePlayer = function(pId) { _activePlayer = pId; }
    this.getActivePlayer = function() { return _activePlayer; }

}


// Game Controller ----------------------------------------------------------------------------------

var GameController = new Object();
GameController.init = function() {

    Cell.init();
    Board.init();
    Player.init();

    //GameView.renderOptions();
    GameView.showMainOptions();


    // --------------------------------
    // Pooling

    var poolingActive = false;

    var pooling = function() {
        if (!poolingActive) return;
        try {
            poolPlayerRefresh();
            poolCellRefresh();
            poolGameRefresh();
            //poolMessageRefresh(); - not implemented
        }
        finally { if (poolingActive) setTimeout("GameController.doWork()", 1000); }
    }

    this.doWork = function() {
        pooling();
    }

    this.startPooling = function() {
        poolingActive = true;
        pooling();
    }

    this.stopPooling = function() {
        poolingActive = false;
    }

    var poolPlayerRefresh = function() {
        var req = new HttpRequest("RefreshPlayerBoard", GameModel.getGameName(), GameModel.getPlayerId());
        req.Request();
        if (req != "") {
            var player = req.getJSonObject();
            for (var i = 0; i < player.length; i++) {
                if (player[i].active == 0)
                    Player.removePlayer(player[i].id);
                Player.update(player[i].id, player[i].name, player[i].points, GameModel.getPlayerId());
            }
        }
    }

    var poolGameRefresh = function() {
        var req = new HttpRequest("RefreshGameInfo", GameModel.getGameName(), GameModel.getPlayerId());
        req.Request();
        if (req != "") {
            var game = req.getJSonObject();
            GameModel.setActivePlayer(game.activePlayer);
            Player.activatePlayer(game.activePlayer);
            GameView.renderMinesLeft(game.minesLeft);

            if (GameModel.getGameStatus() == WAITING_FOR_PLAYERS && game.gStatus == STARTED) {
                GameView.hideOptions();
                GameModel.setGameStatus(game.gStatus);
                BoardController.start();
            }
            else if (game.gStatus == GAME_OVER) {
                GameController.stopPooling();
                GameView.renderGameOver("Game over! Player '" + game.activePlayer + "' won!");
            }
        }
    }

    var poolCellRefresh = function() {
        var req = new HttpRequest("RefreshCell", GameModel.getGameName(), GameModel.getPlayerId());
        req.Request();
        if (req != "") {
            var cell = req.getJSonObject();
            for (var i = 0; i < cell.length; i++) {
                Cell.update(BoardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
            }
        }
    }

    //To implement...
    // Message handling server-side.
    // Should provide message log functions.
    var poolMessageRefresh = function() { }


    // --------------------------------
    // Validators

    var validateInputs = function() {
        if (GameView.getPlayerName().length == 0) {
            GameController.sendMessage("Player name must be at least 1 char long!");
            GameView.setFocusPlayerName();
            return false;
        }
        else if (GameView.getGameName().length == 0) {
            if (GameView.isNewGame())
                GameController.sendMessage("Game name must be at least 1 char long!");
            else
                GameController.sendMessage("No available games to play!");
            GameView.setFocusGameName();
            return false;
        }
        return true;
    }


    // --------------------------------    
    // Events

    this.evtListGames = function() {
        try {
            var req = new HttpRequest("ListActiveGames");
            req.Request();
            GameView.populateGamesList(req.getJSonObject());
        } catch (e) { alert(e); }
        GameView.hideCreateButton();
        GameView.showPlayerForm();
        GameView.showGamesList();
    }

    this.evtNewGame = function() {
        GameView.hideListButton();
        GameView.showGameForm();
        GameView.showPlayerForm();
    }

    this.evtGameSelected = function() {
        GameView.setGameName(GameView.getSelectedGame());
    }

    this.evtProceedToGame = function() {
        if (!validateInputs()) return;

        var handler = GameView.isNewGame() ? "CreateGame" : "JoinGame";

        try {
            var req = new HttpRequest(handler, GameView.getGameName(), 0,
                "playerName", GameView.getPlayerName());
            req.Request();
            var game = req.getJSonObject();
        } catch (e) { alert(e); }

        if (game.gStatus == INVALID_NAME) {
            this.sendMessage("Game named '" + game.GameName + "' " +
                        (handler == "CreateGame" ? "already exists!" : "doesn't exist!"));
            GameView.setFocusGameName();
        }
        else if (game.gStatus == CROWDED) {
            this.sendMessage("Too many players on game '" + game.GameName + "' !");
            GameView.setFocusPlayerName();
        }
        else {
            GameModel.setGameStatus(game.gStatus);
            GameModel.setGameName(game.GameName);
            GameModel.setPlayerName(GameView.getPlayerName());
            GameModel.setPlayerId(game.callingPlayer);
            this.sendMessage("Game '" + game.GameName + "' " +
                        (handler == "CreateGame" ? "created" : "joined") + "!");
            Board.init(LINES, COLS);

            GameView.renderBoard();
            GameView.renderMinesLeft(game.minesLeft);

            if (GameModel.getPlayerId() == 1) {
                GameView.showStartButton();
            }
            else {
                GameView.showMsgButton("Waiting on other players....");
            }
        }
        this.startPooling();
    }

    this.evtStartGame = function() {
        try {
            var req = new HttpRequest("StartGame", GameModel.getGameName(), 1);
            req.Request();
            var game = req.getJSonObject();
        } catch (e) { alert(e); }

        if (game.gStatus == STARTED) {
            GameModel.setGameStatus(STARTED);
            BoardController.start();
            Player.activatePlayer(game.activePlayer);
            GameView.hideOptions();
        }
    }

    this.evtRemovePlayer = function() {
        try {
            var req = new HttpRequest("RemovePlayer", GameModel.getGameName(), GameModel.getPlayerId());
            req.Request();
        } catch (e) { alert(e); }
        location.reload(true);
    }

    this.evtCellClicked = function(cell) {
        if ((parseInt(GameModel.getActivePlayer()) + 1) == parseInt(GameModel.getPlayerId())) {
            var pos = Cell.getPos(jQuery(cell));
            try {
                var req = new HttpRequest("Play", GameModel.getGameName(), GameModel.getPlayerId()
                    , "posX", pos[0], "posY", pos[1]);
                req.Request();
            } catch (e) { alert(e); }
        }
        else
            this.sendMessage("Wait for your turn to play!");
    }

    this.evtRevealBoard = function() {
        try {
            var req = new HttpRequest("RevealBoard", GameModel.getGameName(), GameModel.getPlayerId());
            req.Request();
            if (req != "") {
                var cell = req.getJSonObject();
                for (var i = 0; i < cell.length; i++) {
                    Cell.update(BoardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
                }
            }
        } catch (e) { alert(e); }

        GameView.hideOptions();
        BoardController.revealBoard();
    }

    // --------------------------------
    // Messages

    this.sendMessage = function(msg) {
        GameView.renderMessage(msg);
    }
}



// Game View ----------------------------------------------------------------------------------------

var GameView = new Object();
GameView.init = function() {


    // --------------------------------
    // Game Board

    if (this.renderBoard != undefined) return;

    this.renderBoard = function() {
        $("." + BOARD_CLASS).empty();
        BoardView.render();
    }


    // --------------------------------
    // Options Menu

    this.renderOptions = function() {
        var optionsDiv = $(".divOptions");
        $("<button/>").attr("id", "MsgButton").appendTo(optionsDiv).css("display", "none");
        $("<button/>").click(function() { GameController.evtListGames(); }).attr("id", "ListButton").text("List Available Games").appendTo(optionsDiv).css("display", "none");
        $("<button/>").click(function() { GameController.evtNewGame(); }).attr("id", "CreateButton").text("Start New Game").appendTo(optionsDiv).css("display", "none");
        $("<button/>").click(function() { GameController.evtStartGame(); }).attr("id", "StartButton").text("Start Game").appendTo(optionsDiv).css("display", "none");
        $("<button/>").click(function() { GameController.evtRevealBoard() }).attr("id", "RevealButton").text("Reveal game board").appendTo(optionsDiv).css("display", "none");
        $("<button/>").click(function() { location.reload(true) }).attr("id", "RestartButton").text("Back to Lobby").appendTo(optionsDiv).css("display", "none");
        optionsDiv.css("display", "block");
        this.renderGamesList();
        this.renderGameForm();
        this.renderPlayerForm();
    }

    this.renderGameOver = function(msg) {
        this.renderOptions();
        this.hideCreateButton();
        this.hideListButton();
        this.showRestartButton();
        this.showRevealButton();
        this.showMsgButton(msg);
    }

    this.hideOptions = function() { $(".divOptions").hide("slow"); setTimeout("$('.divOptions').empty();", 300); }

    this.showMainOptions = function() {
        this.hideOptions();
        setTimeout("GameView.renderOptions();"
            + "GameView.showListButton();GameView.showCreateButton();", 1000);
    }

    this.hideCreateButton = function() { $("#CreateButton").hide("slow"); }
    this.showCreateButton = function() { $("#CreateButton").show("slow"); }

    this.hideListButton = function() { $("#ListButton").hide("slow"); }
    this.showListButton = function() { $("#ListButton").show("slow"); }

    this.hideStartButton = function() { $("#StartButton").hide("slow"); }
    this.showStartButton = function() {
        this.hidePlayerForm();
        this.hideGameForm();
        this.hideCreateButton();
        this.hideListButton();
        $("#StartButton").show("slow");
    }

    this.hideMsgButton = function() { $("#WaitButton").hide("slow"); }
    this.showMsgButton = function(msg) {
        this.hidePlayerForm();
        this.hideGamesList();
        this.hideCreateButton();
        this.hideListButton();
        $("#MsgButton").text(msg).show("slow");
    }

    this.hideRestartButton = function() { $("#RestartButton").hide("slow"); }
    this.showRestartButton = function() { $("#RestartButton").show("slow"); }

    this.hideRevealButton = function() { $("#RevealButton").hide("slow"); }
    this.showRevealButton = function() { $("#RevealButton").show("slow"); }


    // --------------------------------
    // Player Form

    this.renderPlayerForm = function() {
        var formDiv = $("<div/>").addClass("divInputName").attr("id", "addPlayerForm").css("display", "none").attr("valign", "middle");
        $("<input/>").attr("id", "playerNameInput").attr("maxLength", "10").appendTo(formDiv);
        $("<button/>").click(function() { GameController.evtProceedToGame(); }).text("Ok").attr({ align: "center", id: "btnProceed" }).appendTo(formDiv);
        $("<button/>").click(function() { GameView.showMainOptions(); }).text("Back").attr({ align: "center", id: "btnBack" }).appendTo(formDiv);
        formDiv.appendTo($(".divOptions"));
    }

    this.showPlayerForm = function() {
        $(".divInputName").show("slow");
        setTimeout('$("#playerNameInput").focus();', 500);
    }

    this.hidePlayerForm = function() {
        $(".divInputName").hide("slow");
        setTimeout('$("#playerNameInput").val("");');
    }

    this.getPlayerName = function() { return $("#playerNameInput").val(); }
    this.setFocusPlayerName = function() { $("#playerNameInput").focus(); }


    // --------------------------------
    // Game Form

    this.renderGameForm = function() {
        var gameForm = $("<div/>").addClass("divGameForm").attr("id", "gameForm").css("display", "none").attr("valign", "middle");
        $("<div>").text("Game Name").appendTo(gameForm);
        $("<input/>").attr("id", "gameNameInput").attr("maxLength", "20").appendTo(gameForm);
        gameForm.appendTo($(".divOptions"));
    }

    this.showGameForm = function() {
        $(".divGameForm").show("slow");
        setTimeout('$("#gameForm").focus();', 1000);
    }

    this.hideGameForm = function() {
        $(".divGameForm").hide("slow");
        setTimeout('$("#gameNameInput").val("");');
    }

    this.getGameName = function() { return $("#gameNameInput").val(); }
    this.setGameName = function(name) { $("#gameNameInput").val(name); }
    this.setFocusGameName = function() { $("#gameNameInput").focus(); }


    // --------------------------------
    // Games List

    this.renderGamesList = function() {
        var listDiv = $("<div/>").addClass("divGamesList").attr({ id: "gamesList", valign: "middle" }).css("display", "none");
        listDiv.appendTo($(".divOptions"));
    }

    this.populateGamesList = function(jSon) {
        $("#gamesList").empty();
        if (jSon == "") {
            $("<span/>").text("No games available!").appendTo($("#gamesList"));
        }
        else {
            for (var i = 0; i < jSon.length; i++) {
                var gameItem = $('<input type="radio" id="gameListItem" name="gameListItem" value="' + jSon[i] + '">' + jSon[i] + '</input><br>');
                gameItem.click(function() { GameController.evtGameSelected(); });
                gameItem.appendTo($("<span/>")).appendTo($("#gamesList"));
            }
        }
    }

    this.showGamesList = function() { $(".divGamesList").show("slow"); }
    this.hideGamesList = function() { $(".divGamesList").hide("slow"); }
    this.getSelectedGame = function() { return ($("input[name='gameListItem']:checked").val()); }


    // --------------------------------
    // Messages

    this.renderMessage = function(msg) {
        $("." + MSGBOARD_CLASS + " ." + MSG_CLASS).text(msg);
    }


    // --------------------------------
    // Mines Left

    this.renderMinesLeft = function(minesLeft) {
        $("." + SCORE_LABEL).text("Mines Left");
        $("." + SCORE_VALUE).text(minesLeft);
    }


    // --------------------------------
    // State interrogations

    this.isNewGame = function() { return ($(".divGamesList").css("display") == "none"); }

}