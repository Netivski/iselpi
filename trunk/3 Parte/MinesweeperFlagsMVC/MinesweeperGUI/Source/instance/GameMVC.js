// Game MVC initializer

function GameMVC(lines, cols) {

    var current = this; 

    // Game Model ---------------------------------------------------------------------------------------
    this.gameModel = function() {
        if (this.gameModel.setGameName == undefined) {
            var _gStatus = -1;
            var _gName = null;
            var _pName = null;
            var _pId = 0;
            var _activePlayer = 0;

            this.gameModel.setGameName = function(gName) { _gName = gName; }
            this.gameModel.getGameName = function() { return _gName; }

            this.gameModel.setGameStatus = function(gStatus) { _gStatus = gStatus; }
            this.gameModel.getGameStatus = function() { return _gStatus; }

            this.gameModel.setPlayerName = function(pName) { _pName = pName; }
            this.gameModel.getPlayerName = function() { return _pName; }

            this.gameModel.setPlayerId = function(pId) { _pId = pId; }
            this.gameModel.getPlayerId = function() { return _pId; }

            this.gameModel.setActivePlayer = function(pId) { _activePlayer = pId; }
            this.gameModel.getActivePlayer = function() { return _activePlayer; }
        }
    }

    // Game Controller ----------------------------------------------------------------------------------

    this.gameController = function() {

        if (this.gameController.doWork == undefined) {

            var cell = new cell();
            var board = new boardMVC(lines, cols, cell);
            var player = new player();

            board.boardView.showMainOptions();


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

            this.gameControllerboard.doWork = function() {
                pooling();
            }

            this.gameControllerboard.startPooling = function() {
                poolingActive = true;
                pooling();
            }

            this.gameControllerboard.stopPooling = function() {
                poolingActive = false;
            }

            var poolPlayerRefresh = function() {
                var req = new HttpRequest("RefreshPlayerBoard", gModel.getGameName(), gModel.getPlayerId());
                req.Request();
                if (req != "") {
                    var p = req.getJSonObject();
                    for (var i = 0; i < p.length; i++) {
                        if (p[i].active == 0)
                            player.removePlayer(p[i].id);
                        player.update(p[i].id, p[i].name, p[i].points, gModel.getPlayerId());
                    }
                }
            }

            var poolGameRefresh = function() {
                var req = new HttpRequest("RefreshGameInfo", gModel.getGameName(), gModel.getPlayerId());
                req.Request();
                if (req != "") {
                    var game = req.getJSonObject();
                    gModel.setActivePlayer(game.activePlayer);
                    player.activatePlayer(game.activePlayer);
                    gView.renderMinesLeft(game.minesLeft);

                    if (gModel.getGameStatus() == WAITING_FOR_PLAYERS && game.gStatus == STARTED) {
                        gView.hideOptions();
                        gModel.setGameStatus(game.gStatus);
                        b.start();
                    }
                    else if (game.gStatus == GAME_OVER) {
                        stopPooling();
                        gView.renderGameOver("Game over! Player '" + game.activePlayer + "' won!");
                    }
                }
            }

            var poolCellRefresh = function() {
                var req = new HttpRequest("RefreshCell", gModel.getGameName(), gModel.getPlayerId());
                req.Request();
                if (req != "") {
                    var cell = req.getJSonObject();
                    for (var i = 0; i < cell.length; i++) {
                        cell.update(BoardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
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
                if (gView.getPlayerName().length == 0) {
                    this.gameControllerboard.sendMessage("Player name must be at least 1 char long!");
                    gView.setFocusPlayerName();
                    return false;
                }
                else if (gView.getGameName().length == 0) {
                    if (gView.isNewGame())
                        GameController.sendMessage("Game name must be at least 1 char long!");
                    else
                        GameController.sendMessage("No available games to play!");
                    gView.setFocusGameName();
                    return false;
                }
                return true;
            }


            // --------------------------------    
            // Events

            this.gameController.evtListGames = function() {
                try {
                    var req = new HttpRequest("ListActiveGames");
                    req.Request();
                    gView.populateGamesList(req.getJSonObject());
                } catch (e) { alert(e); }
                gView.hideCreateButton();
                gView.showPlayerForm();
                gView.showGamesList();
            }

            this.gameController.evtNewGame = function() {
                gView.hideListButton();
                gView.showGameForm();
                gView.showPlayerForm();
            }

            this.gameController.evtGameSelected = function() {
                gView.setGameName(gView.getSelectedGame());
            }

            this.gameController.evtProceedToGame = function() {
                if (!validateInputs()) return;

                var handler = gView.isNewGame() ? "CreateGame" : "JoinGame";

                try {
                    var req = new HttpRequest(handler, gView.getGameName(), 0,
                "playerName", gView.getPlayerName());
                    req.Request();
                    var game = req.getJSonObject();
                } catch (e) { alert(e); }

                if (game.gStatus == INVALID_NAME) {
                    this.sendMessage("Game named '" + game.GameName + "' " +
                        (handler == "CreateGame" ? "already exists!" : "doesn't exist!"));
                    gView.setFocusGameName();
                }
                else if (game.gStatus == CROWDED) {
                    this.sendMessage("Too many players on game '" + game.GameName + "' !");
                    gView.setFocusPlayerName();
                }
                else {
                    gModel.setGameStatus(game.gStatus);
                    gModel.setGameName(game.GameName);
                    gModel.setPlayerName(gView.getPlayerName());
                    gModel.setPlayerId(game.callingPlayer);
                    this.sendMessage("Game '" + game.GameName + "' " +
                        (handler == "CreateGame" ? "created" : "joined") + "!");
                    Board.init(LINES, COLS);

                    gView.renderBoard();
                    gView.renderMinesLeft(game.minesLeft);

                    if (gModel.getPlayerId() == 1) {
                        gView.showStartButton();
                    }
                    else {
                        gView.showMsgButton("Waiting on other players....");
                    }
                }
                this.startPooling();
            }

            this.gameController.evtStartGame = function() {
                try {
                    var req = new HttpRequest("StartGame", gModel.getGameName(), 1);
                    req.Request();
                    var game = req.getJSonObject();
                } catch (e) { alert(e); }

                if (game.gStatus == STARTED) {
                    gModel.setGameStatus(STARTED);
                    board.controller.start();
                    player.activatePlayer(game.activePlayer);
                    gView.hideOptions();
                }
            }

            this.gameController.evtRemovePlayer = function() {
                try {
                    var req = new HttpRequest("RemovePlayer", gModel.getGameName(), gModel.getPlayerId());
                    req.Request();
                } catch (e) { alert(e); }
                location.reload(true);
            }

            this.gameController.evtCellClicked = function(cell) {
                if ((parseInt(gModel.getActivePlayer()) + 1) == parseInt(gModel.getPlayerId())) {
                    var pos = cell.getPos(jQuery(cell));
                    try {
                        var req = new HttpRequest("Play", gModel.getGameName(), gModel.getPlayerId()
                    , "posX", pos[0], "posY", pos[1]);
                        req.Request();
                    } catch (e) { alert(e); }
                }
                else
                    this.sendMessage("Wait for your turn to play!");
            }

            this.gameController.evtRevealBoard = function() {
                try {
                    var req = new HttpRequest("RevealBoard", gModel.getGameName(), gModel.getPlayerId());
                    req.Request();
                    if (req != "") {
                        var cell = req.getJSonObject();
                        for (var i = 0; i < cell.length; i++) {
                            cell.update(BoardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
                        }
                    }
                } catch (e) { alert(e); }

                gView.hideOptions();
                board.controller.revealBoard();
            }

            // --------------------------------
            // Messages

            this.gameController.sendMessage = function(msg) {
                gView.renderMessage(msg);
            }
        }
    }

    this.gameView = function() {

        // --------------------------------
        // Game Board

    if (this.gameView.renderBoard != undefined) return;

    this.gameView.renderBoard = function() {
            $("." + BOARD_CLASS).empty();
            BoardView.render();
        }


        // --------------------------------
        // Options Menu

        this.gameView.renderOptions = function() {
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

        this.gameView.renderGameOver = function(msg) {
            this.renderOptions();
            this.hideCreateButton();
            this.hideListButton();
            this.showRestartButton();
            this.showRevealButton();
            this.showMsgButton(msg);
        }

        this.gameView.hideOptions = function() { $(".divOptions").hide("slow"); setTimeout("$('.divOptions').empty();", 300); }

        this.gameView.showMainOptions = function() {
            this.hideOptions();
            setTimeout("GameView.renderOptions();"
            + "GameView.showListButton();GameView.showCreateButton();", 1000);
        }

        this.gameView.hideCreateButton = function() { $("#CreateButton").hide("slow"); }
        this.gameView.showCreateButton = function() { $("#CreateButton").show("slow"); }

        this.gameView.hideListButton = function() { $("#ListButton").hide("slow"); }
        this.gameView.showListButton = function() { $("#ListButton").show("slow"); }

        this.gameView.hideStartButton = function() { $("#StartButton").hide("slow"); }
        this.gameView.showStartButton = function() {
        this.gameView.hidePlayerForm();
        this.gameView.hideGameForm();
        this.gameView.hideCreateButton();
        this.gameView.hideListButton();
            $("#StartButton").show("slow");
        }

        this.gameView.hideMsgButton = function() { $("#WaitButton").hide("slow"); }
        this.gameView.showMsgButton = function(msg) {
        this.gameView.hidePlayerForm();
        this.gameView.hideGamesList();
        this.gameView.hideCreateButton();
        this.gameView.hideListButton();
            $("#MsgButton").text(msg).show("slow");
        }

        this.gameView.hideRestartButton = function() { $("#RestartButton").hide("slow"); }
        this.gameView.showRestartButton = function() { $("#RestartButton").show("slow"); }

        this.gameView.hideRevealButton = function() { $("#RevealButton").hide("slow"); }
        this.gameView.showRevealButton = function() { $("#RevealButton").show("slow"); }


        // --------------------------------
        // Player Form

        this.gameView.renderPlayerForm = function() {
            var formDiv = $("<div/>").addClass("divInputName").attr("id", "addPlayerForm").css("display", "none").attr("valign", "middle");
            $("<input/>").attr("id", "playerNameInput").attr("maxLength", "10").appendTo(formDiv);
            $("<button/>").click(function() { GameController.evtProceedToGame(); }).text("Ok").attr({ align: "center", id: "btnProceed" }).appendTo(formDiv);
            $("<button/>").click(function() { GameView.showMainOptions(); }).text("Back").attr({ align: "center", id: "btnBack" }).appendTo(formDiv);
            formDiv.appendTo($(".divOptions"));
        }

        this.gameView.showPlayerForm = function() {
            $(".divInputName").show("slow");
            setTimeout('$("#playerNameInput").focus();', 500);
        }

        this.gameView.hidePlayerForm = function() {
            $(".divInputName").hide("slow");
            setTimeout('$("#playerNameInput").val("");');
        }

        this.gameView.getPlayerName = function() { return $("#playerNameInput").val(); }
        this.gameView.setFocusPlayerName = function() { $("#playerNameInput").focus(); }


        // --------------------------------
        // Game Form

        this.gameView.renderGameForm = function() {
            var gameForm = $("<div/>").addClass("divGameForm").attr("id", "gameForm").css("display", "none").attr("valign", "middle");
            $("<div>").text("Game Name").appendTo(gameForm);
            $("<input/>").attr("id", "gameNameInput").attr("maxLength", "20").appendTo(gameForm);
            gameForm.appendTo($(".divOptions"));
        }

        this.gameView.showGameForm = function() {
            $(".divGameForm").show("slow");
            setTimeout('$("#gameForm").focus();', 1000);
        }

        this.gameView.hideGameForm = function() {
            $(".divGameForm").hide("slow");
            setTimeout('$("#gameNameInput").val("");');
        }

        this.gameView.getGameName = function() { return $("#gameNameInput").val(); }
        this.gameView.setGameName = function(name) { $("#gameNameInput").val(name); }
        this.gameView.setFocusGameName = function() { $("#gameNameInput").focus(); }


        // --------------------------------
        // Games List

        this.gameView.renderGamesList = function() {
            var listDiv = $("<div/>").addClass("divGamesList").attr({ id: "gamesList", valign: "middle" }).css("display", "none");
            listDiv.appendTo($(".divOptions"));
        }

        this.gameView.populateGamesList = function(jSon) {
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

        this.gameView.showGamesList = function() { $(".divGamesList").show("slow"); }
        this.gameView.hideGamesList = function() { $(".divGamesList").hide("slow"); }
        this.gameView.getSelectedGame = function() { return ($("input[name='gameListItem']:checked").val()); }


        // --------------------------------
        // Messages

        this.gameView.renderMessage = function(msg) {
            $("." + MSGBOARD_CLASS + " ." + MSG_CLASS).text(msg);
        }


        // --------------------------------
        // Mines Left

        this.gameView.renderMinesLeft = function(minesLeft) {
            $("." + SCORE_LABEL).text("Mines Left");
            $("." + SCORE_VALUE).text(minesLeft);
        }


        // --------------------------------
        // State interrogations

        this.gameView.isNewGame = function() { return ($(".divGamesList").css("display") == "none"); }
    }
}




var Game = new Object();

Game.init = function(vd) { // vd == Virtual Directory

    if (addJsFile != undefined) return;

    var addJsFile = function(filename) {
        $("<script/>").attr("type", "text/javascript").attr("src", filename).appendTo($("head"));
    }

    addJsFile("/Source/Constants.js");
    addJsFile("/Source/HttpRequest.js");
    addJsFile("/Source/BoardMVC.js");
    addJsFile("/Source/Cell.js");
    addJsFile("/Source/Player.js");

    GameModel.init();
    GameView.init();
    GameController.init();
}

//var GameModel = new Object();
//GameModel.init = function() {

//    // Players will be processed in Player.js

//    var _gStatus = -1;
//    var _gName = null;
//    var _pName = null;
//    var _pId = 0;
//    var _activePlayer = 0;

//    this.setGameName = function(gName) { _gName = gName; }
//    this.getGameName = function() { return _gName; }

//    this.setGameStatus = function(gStatus) { _gStatus = gStatus; }
//    this.getGameStatus = function() { return _gStatus; }

//    this.setPlayerName = function(pName) { _pName = pName; }
//    this.getPlayerName = function() { return _pName; }

//    this.setPlayerId = function(pId) { _pId = pId; }
//    this.getPlayerId = function() { return _pId; }

//    this.setActivePlayer = function(pId) { _activePlayer = pId; }
//    this.getActivePlayer = function() { return _activePlayer; }

//}


// Game Controller ----------------------------------------------------------------------------------




//var GameController = new Object();
//GameController.init = function() {

//    Cell.init();
//    Board.init();
//    Player.init();

//    //GameView.renderOptions();
//    GameView.showMainOptions();


//    // --------------------------------
//    // Pooling

//    var poolingActive = false;

//    var pooling = function() {
//        if (!poolingActive) return;
//        try {
//            poolPlayerRefresh();
//            poolCellRefresh();
//            poolGameRefresh();
//            //poolMessageRefresh(); - not implemented
//        }
//        finally { if (poolingActive) setTimeout("GameController.doWork()", 1000); }
//    }

//    this.doWork = function() {
//        pooling();
//    }

//    this.startPooling = function() {
//        poolingActive = true;
//        pooling();
//    }

//    this.stopPooling = function() {
//        poolingActive = false;
//    }

//    var poolPlayerRefresh = function() {
//        var req = new HttpRequest("RefreshPlayerBoard", GameModel.getGameName(), GameModel.getPlayerId());
//        req.Request();
//        if (req != "") {
//            var player = req.getJSonObject();
//            for (var i = 0; i < player.length; i++) {
//                if (player[i].active == 0)
//                    Player.removePlayer(player[i].id);
//                Player.update(player[i].id, player[i].name, player[i].points, GameModel.getPlayerId());
//            }
//        }
//    }

//    var poolGameRefresh = function() {
//        var req = new HttpRequest("RefreshGameInfo", GameModel.getGameName(), GameModel.getPlayerId());
//        req.Request();
//        if (req != "") {
//            var game = req.getJSonObject();
//            GameModel.setActivePlayer(game.activePlayer);
//            Player.activatePlayer(game.activePlayer);
//            GameView.renderMinesLeft(game.minesLeft);

//            if (GameModel.getGameStatus() == WAITING_FOR_PLAYERS && game.gStatus == STARTED) {
//                GameView.hideOptions();
//                GameModel.setGameStatus(game.gStatus);
//                BoardController.start();
//            }
//            else if (game.gStatus == GAME_OVER) {
//                GameController.stopPooling();
//                GameView.renderGameOver("Game over! Player '" + game.activePlayer + "' won!");
//            }
//        }
//    }

//    var poolCellRefresh = function() {
//        var req = new HttpRequest("RefreshCell", GameModel.getGameName(), GameModel.getPlayerId());
//        req.Request();
//        if (req != "") {
//            var cell = req.getJSonObject();
//            for (var i = 0; i < cell.length; i++) {
//                Cell.update(BoardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
//            }
//        }
//    }

//    //To implement...
//    // Message handling server-side.
//    // Should provide message log functions.
//    var poolMessageRefresh = function() { }


//    // --------------------------------
//    // Validators

//    var validateInputs = function() {
//        if (GameView.getPlayerName().length == 0) {
//            GameController.sendMessage("Player name must be at least 1 char long!");
//            GameView.setFocusPlayerName();
//            return false;
//        }
//        else if (GameView.getGameName().length == 0) {
//            if (GameView.isNewGame())
//                GameController.sendMessage("Game name must be at least 1 char long!");
//            else
//                GameController.sendMessage("No available games to play!");
//            GameView.setFocusGameName();
//            return false;
//        }
//        return true;
//    }


//    // --------------------------------    
//    // Events

//    this.evtListGames = function() {
//        try {
//            var req = new HttpRequest("ListActiveGames");
//            req.Request();
//            GameView.populateGamesList(req.getJSonObject());
//        } catch (e) { alert(e); }
//        GameView.hideCreateButton();
//        GameView.showPlayerForm();
//        GameView.showGamesList();
//    }

//    this.evtNewGame = function() {
//        GameView.hideListButton();
//        GameView.showGameForm();
//        GameView.showPlayerForm();
//    }

//    this.evtGameSelected = function() {
//        GameView.setGameName(GameView.getSelectedGame());
//    }

//    this.evtProceedToGame = function() {
//        if (!validateInputs()) return;

//        var handler = GameView.isNewGame() ? "CreateGame" : "JoinGame";

//        try {
//            var req = new HttpRequest(handler, GameView.getGameName(), 0,
//                "playerName", GameView.getPlayerName());
//            req.Request();
//            var game = req.getJSonObject();
//        } catch (e) { alert(e); }

//        if (game.gStatus == INVALID_NAME) {
//            this.sendMessage("Game named '" + game.GameName + "' " +
//                        (handler == "CreateGame" ? "already exists!" : "doesn't exist!"));
//            GameView.setFocusGameName();
//        }
//        else if (game.gStatus == CROWDED) {
//            this.sendMessage("Too many players on game '" + game.GameName + "' !");
//            GameView.setFocusPlayerName();
//        }
//        else {
//            GameModel.setGameStatus(game.gStatus);
//            GameModel.setGameName(game.GameName);
//            GameModel.setPlayerName(GameView.getPlayerName());
//            GameModel.setPlayerId(game.callingPlayer);
//            this.sendMessage("Game '" + game.GameName + "' " +
//                        (handler == "CreateGame" ? "created" : "joined") + "!");
//            Board.init(LINES, COLS);

//            GameView.renderBoard();
//            GameView.renderMinesLeft(game.minesLeft);

//            if (GameModel.getPlayerId() == 1) {
//                GameView.showStartButton();
//            }
//            else {
//                GameView.showMsgButton("Waiting on other players....");
//            }
//        }
//        this.startPooling();
//    }

//    this.evtStartGame = function() {
//        try {
//            var req = new HttpRequest("StartGame", GameModel.getGameName(), 1);
//            req.Request();
//            var game = req.getJSonObject();
//        } catch (e) { alert(e); }

//        if (game.gStatus == STARTED) {
//            GameModel.setGameStatus(STARTED);
//            BoardController.start();
//            Player.activatePlayer(game.activePlayer);
//            GameView.hideOptions();
//        }
//    }

//    this.evtRemovePlayer = function() {
//        try {
//            var req = new HttpRequest("RemovePlayer", GameModel.getGameName(), GameModel.getPlayerId());
//            req.Request();
//        } catch (e) { alert(e); }
//        location.reload(true);
//    }

//    this.evtCellClicked = function(cell) {
//        if ((parseInt(GameModel.getActivePlayer()) + 1) == parseInt(GameModel.getPlayerId())) {
//            var pos = Cell.getPos(jQuery(cell));
//            try {
//                var req = new HttpRequest("Play", GameModel.getGameName(), GameModel.getPlayerId()
//                    , "posX", pos[0], "posY", pos[1]);
//                req.Request();
//            } catch (e) { alert(e); }
//        }
//        else
//            this.sendMessage("Wait for your turn to play!");
//    }

//    this.evtRevealBoard = function() {
//        try {
//            var req = new HttpRequest("RevealBoard", GameModel.getGameName(), GameModel.getPlayerId());
//            req.Request();
//            if (req != "") {
//                var cell = req.getJSonObject();
//                for (var i = 0; i < cell.length; i++) {
//                    Cell.update(BoardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
//                }
//            }
//        } catch (e) { alert(e); }

//        GameView.hideOptions();
//        BoardController.revealBoard();
//    }

//    // --------------------------------
//    // Messages

//    this.sendMessage = function(msg) {
//        GameView.renderMessage(msg);
//    }
//}



//// Game View ----------------------------------------------------------------------------------------

//var GameView = new Object();
//GameView.init = function() {


//    // --------------------------------
//    // Game Board

//    if (this.renderBoard != undefined) return;

//    this.renderBoard = function() {
//        $("." + BOARD_CLASS).empty();
//        BoardView.render();
//    }


//    // --------------------------------
//    // Options Menu

//    this.renderOptions = function() {
//        var optionsDiv = $(".divOptions");
//        $("<button/>").attr("id", "MsgButton").appendTo(optionsDiv).css("display", "none");
//        $("<button/>").click(function() { GameController.evtListGames(); }).attr("id", "ListButton").text("List Available Games").appendTo(optionsDiv).css("display", "none");
//        $("<button/>").click(function() { GameController.evtNewGame(); }).attr("id", "CreateButton").text("Start New Game").appendTo(optionsDiv).css("display", "none");
//        $("<button/>").click(function() { GameController.evtStartGame(); }).attr("id", "StartButton").text("Start Game").appendTo(optionsDiv).css("display", "none");
//        $("<button/>").click(function() { GameController.evtRevealBoard() }).attr("id", "RevealButton").text("Reveal game board").appendTo(optionsDiv).css("display", "none");
//        $("<button/>").click(function() { location.reload(true) }).attr("id", "RestartButton").text("Back to Lobby").appendTo(optionsDiv).css("display", "none");
//        optionsDiv.css("display", "block");
//        this.renderGamesList();
//        this.renderGameForm();
//        this.renderPlayerForm();
//    }

//    this.renderGameOver = function(msg) {
//        this.renderOptions();
//        this.hideCreateButton();
//        this.hideListButton();
//        this.showRestartButton();
//        this.showRevealButton();
//        this.showMsgButton(msg);
//    }

//    this.hideOptions = function() { $(".divOptions").hide("slow"); setTimeout("$('.divOptions').empty();", 300); }

//    this.showMainOptions = function() {
//        this.hideOptions();
//        setTimeout("GameView.renderOptions();"
//            + "GameView.showListButton();GameView.showCreateButton();", 1000);
//    }

//    this.hideCreateButton = function() { $("#CreateButton").hide("slow"); }
//    this.showCreateButton = function() { $("#CreateButton").show("slow"); }

//    this.hideListButton = function() { $("#ListButton").hide("slow"); }
//    this.showListButton = function() { $("#ListButton").show("slow"); }

//    this.hideStartButton = function() { $("#StartButton").hide("slow"); }
//    this.showStartButton = function() {
//        this.hidePlayerForm();
//        this.hideGameForm();
//        this.hideCreateButton();
//        this.hideListButton();
//        $("#StartButton").show("slow");
//    }

//    this.hideMsgButton = function() { $("#WaitButton").hide("slow"); }
//    this.showMsgButton = function(msg) {
//        this.hidePlayerForm();
//        this.hideGamesList();
//        this.hideCreateButton();
//        this.hideListButton();
//        $("#MsgButton").text(msg).show("slow");
//    }

//    this.hideRestartButton = function() { $("#RestartButton").hide("slow"); }
//    this.showRestartButton = function() { $("#RestartButton").show("slow"); }

//    this.hideRevealButton = function() { $("#RevealButton").hide("slow"); }
//    this.showRevealButton = function() { $("#RevealButton").show("slow"); }


//    // --------------------------------
//    // Player Form

//    this.renderPlayerForm = function() {
//        var formDiv = $("<div/>").addClass("divInputName").attr("id", "addPlayerForm").css("display", "none").attr("valign", "middle");
//        $("<input/>").attr("id", "playerNameInput").attr("maxLength", "10").appendTo(formDiv);
//        $("<button/>").click(function() { GameController.evtProceedToGame(); }).text("Ok").attr({ align: "center", id: "btnProceed" }).appendTo(formDiv);
//        $("<button/>").click(function() { GameView.showMainOptions(); }).text("Back").attr({ align: "center", id: "btnBack" }).appendTo(formDiv);
//        formDiv.appendTo($(".divOptions"));
//    }

//    this.showPlayerForm = function() {
//        $(".divInputName").show("slow");
//        setTimeout('$("#playerNameInput").focus();', 500);
//    }

//    this.hidePlayerForm = function() {
//        $(".divInputName").hide("slow");
//        setTimeout('$("#playerNameInput").val("");');
//    }

//    this.getPlayerName = function() { return $("#playerNameInput").val(); }
//    this.setFocusPlayerName = function() { $("#playerNameInput").focus(); }


//    // --------------------------------
//    // Game Form

//    this.renderGameForm = function() {
//        var gameForm = $("<div/>").addClass("divGameForm").attr("id", "gameForm").css("display", "none").attr("valign", "middle");
//        $("<div>").text("Game Name").appendTo(gameForm);
//        $("<input/>").attr("id", "gameNameInput").attr("maxLength", "20").appendTo(gameForm);
//        gameForm.appendTo($(".divOptions"));
//    }

//    this.showGameForm = function() {
//        $(".divGameForm").show("slow");
//        setTimeout('$("#gameForm").focus();', 1000);
//    }

//    this.hideGameForm = function() {
//        $(".divGameForm").hide("slow");
//        setTimeout('$("#gameNameInput").val("");');
//    }

//    this.getGameName = function() { return $("#gameNameInput").val(); }
//    this.setGameName = function(name) { $("#gameNameInput").val(name); }
//    this.setFocusGameName = function() { $("#gameNameInput").focus(); }


//    // --------------------------------
//    // Games List

//    this.renderGamesList = function() {
//        var listDiv = $("<div/>").addClass("divGamesList").attr({ id: "gamesList", valign: "middle" }).css("display", "none");
//        listDiv.appendTo($(".divOptions"));
//    }

//    this.populateGamesList = function(jSon) {
//        $("#gamesList").empty();
//        if (jSon == "") {
//            $("<span/>").text("No games available!").appendTo($("#gamesList"));
//        }
//        else {
//            for (var i = 0; i < jSon.length; i++) {
//                var gameItem = $('<input type="radio" id="gameListItem" name="gameListItem" value="' + jSon[i] + '">' + jSon[i] + '</input><br>');
//                gameItem.click(function() { GameController.evtGameSelected(); });
//                gameItem.appendTo($("<span/>")).appendTo($("#gamesList"));
//            }
//        }
//    }

//    this.showGamesList = function() { $(".divGamesList").show("slow"); }
//    this.hideGamesList = function() { $(".divGamesList").hide("slow"); }
//    this.getSelectedGame = function() { return ($("input[name='gameListItem']:checked").val()); }


//    // --------------------------------
//    // Messages

//    this.renderMessage = function(msg) {
//        $("." + MSGBOARD_CLASS + " ." + MSG_CLASS).text(msg);
//    }


//    // --------------------------------
//    // Mines Left

//    this.renderMinesLeft = function(minesLeft) {
//        $("." + SCORE_LABEL).text("Mines Left");
//        $("." + SCORE_VALUE).text(minesLeft);
//    }


//    // --------------------------------
//    // State interrogations

//    this.isNewGame = function() { return ($(".divGamesList").css("display") == "none"); }

//}