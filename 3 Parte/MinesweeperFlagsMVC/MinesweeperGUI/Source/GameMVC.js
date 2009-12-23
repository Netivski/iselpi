function GameMVC(lines, cols, gName) {

    var current = this; 

    // Game Model ---------------------------------------------------------------------------------------
    this.gameModel = function() {
        if (this.gameModel.setGameName != undefined) return;
        
        var _gStatus = -1;
        var _gName = null;
        var _pName = null;
        var _pEMail = null;
        var _pId = 0;
        var _activePlayer = 0;
        var _isOwner = false;

        this.gameModel.setGameName = function(gName) { _gName = gName; }
        this.gameModel.getGameName = function() { return _gName; }

        this.gameModel.setGameStatus = function(gStatus) { _gStatus = gStatus; }
        this.gameModel.getGameStatus = function() { return _gStatus; }

        this.gameModel.setPlayerName = function(pName) { _pName = pName; }
        this.gameModel.getPlayerName = function() { return _pName; }

        this.gameModel.setPlayerEMail = function(pEMail) { _pEMail = pEMail; }
        this.gameModel.getPlayerEMail = function() { return _pEMail; }

        this.gameModel.setPlayerId = function(pId) { _pId = pId; }
        this.gameModel.getPlayerId = function() { return _pId; }

        this.gameModel.setActivePlayer = function(pId) { _activePlayer = pId; }
        this.gameModel.getActivePlayer = function() { return _activePlayer; }

        this.gameModel.setIsOwner = function(isOwner) { _isOwner = isOwner; }
        this.gameModel.getIsOwner = function() { return (_isOwner == true ); }
    }

    // Game Controller ----------------------------------------------------------------------------------

    this.gameController = function() {
        if (this.gameController.doWork != undefined) return;

        var cellObj = new Cell(current.gameController);
        var board = new BoardMVC(lines, cols, cellObj);
        var playerObj = new Player(current.gameController);

        this.gameController.startGame = function(gName, pName, pEMail, pId, isOwner) {
            current.gameModel.setGameName(gName);
            current.gameModel.setPlayerName(pName);
            current.gameModel.setPlayerEMail(pEMail);
            current.gameModel.setPlayerId(pId);
            current.gameModel.setIsOwner(isOwner);

            current.gameView.renderOptions();

            if (current.gameModel.getIsOwner()) {
                current.gameView.showStartButton();
            } else {
                current.gameView.showMsgButton("Waiting to Start");
            }

            current.gameController.startPooling();
        }


        // --------------------------------
        // Pooling

        var poolingActive = false;

        var pooling = function() {
            if (!poolingActive) return;
            try {

                if (current.gameModel.getGameStatus() == -1) {
                    var game = null;
                    var req = new HttpRequest("GameAsynchronous", "RefreshGameInfo", current.gameModel.getGameName(), current.gameModel.getPlayerId());
                    req.Request();
                    if (req != "") game = req.getJSonObject();

                    if (current.gameModel.getIsOwner()) { // Verifica se há mais do que 1 Jogador
                        if (game.PlayersCount > 1) {
                            current.gameView.enableStartGameButton();
                        }
                    } else { // Verifica que o jogo já iniciou
                        current.gameModel.setGameStatus(game.gStatus);
                    }

                    //$("#StartButton").attr("enable", "true").

                } else {
                    poolPlayerRefresh();
                    poolCellRefresh();
                    poolGameRefresh();
                }

                //poolMessageRefresh(); - not implemented
            }
            finally { if (poolingActive) setTimeout(gName + ".gameController.doWork()", 1000); }
        }

        this.gameController.doWork = function() {
            pooling();
        }

        this.gameController.startPooling = function() {
            poolingActive = true;
            pooling();
        }

        this.gameController.stopPooling = function() {
            poolingActive = false;
        }

        var poolPlayerRefresh = function() {
            var req = new HttpRequest("GameAsynchronous", "RefreshPlayerBoard", current.gameModel.getGameName(), current.gameModel.getPlayerId());
            req.Request();
            if (req != "") {
                var p = req.getJSonObject();
                for (var i = 0; i < p.length; i++) {
                    if (p[i].active == 0)
                        playerObj.removePlayer(p[i].id);
                    playerObj.update(p[i].id, p[i].name, p[i].points, current.gameModel.getPlayerId());
                }
            }
        }

        var poolGameRefresh = function() {
            var req = new HttpRequest("GameAsynchronous", "RefreshGameInfo", current.gameModel.getGameName(), current.gameModel.getPlayerId());
            req.Request();
            if (req != "") {
                var game = req.getJSonObject();
                current.gameModel.setActivePlayer(game.activePlayer);
                playerObj.activatePlayer(game.activePlayer);
                current.gameView.renderMinesLeft(game.minesLeft);

                if (current.gameModel.getGameStatus() == WAITING_FOR_PLAYERS && game.gStatus == STARTED) {
                    current.gameView.hideOptions();
                    current.gameModel.setGameStatus(game.gStatus);
                    board.boardController.start();
                }
                else if (game.gStatus == GAME_OVER) {
                    stopPooling();
                    current.gameView.renderGameOver("Game over! Player '" + game.activePlayer + "' won!");
                }
            }
        }

        var poolCellRefresh = function() {
            var req = new HttpRequest("GameAsynchronous", "RefreshCell", current.gameModel.getGameName(), current.gameModel.getPlayerId());
            req.Request();
            if (req != "") {
                var cell = req.getJSonObject();
                for (var i = 0; i < cell.length; i++) {
                    cellObj.update(board.boardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
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
            if (current.gameView.getPlayerName().length == 0) {
                current.gameController.sendMessage("Player name must be at least 1 char long!");
                current.gameView.setFocusPlayerName();
                return false;
            }
            else if (current.gameView.getGameName().length == 0) {
                if (current.gameView.isNewGame())
                    current.gameController.sendMessage("Game name must be at least 1 char long!");
                else
                    current.gameController.sendMessage("No available games to play!");
                current.gameView.setFocusGameName();
                return false;
            }
            return true;
        }


        // --------------------------------    
        // Events

        this.gameController.evtListGames = function() {
            try {
                var req = new HttpRequest("GameAsynchronous", "ListActiveGames");
                req.Request();
                current.gameView.populateGamesList(req.getJSonObject());
            } catch (e) { alert(e); }
            current.gameView.hideCreateButton();
            current.gameView.showPlayerForm();
            current.gameView.showGamesList();
        }

        this.gameController.evtNewGame = function() {
            current.gameView.hideListButton();
            current.gameView.showGameForm();
            current.gameView.showPlayerForm();
        }

        this.gameController.evtGameSelected = function() {
            current.gameView.setGameName(current.gameView.getSelectedGame());
        }

        this.gameController.evtProceedToGame = function() {
            if (!validateInputs()) return;

            var handler = current.gameView.isNewGame() ? "CreateGame" : "JoinGame";

            try {
                var req = new HttpRequest("GameAsynchronous", handler, current.gameView.getGameName(), 0,
                "playerName", current.gameView.getPlayerName());
                req.Request();
                var game = req.getJSonObject();
            } catch (e) { alert(e); }

            if (game.gStatus == INVALID_NAME) {
                this.sendMessage("Game named '" + game.GameName + "' " +
                        (handler == "CreateGame" ? "already exists!" : "doesn't exist!"));
                current.gameView.setFocusGameName();
            }
            else if (game.gStatus == CROWDED) {
                this.sendMessage("Too many players on game '" + game.GameName + "' !");
                current.gameView.setFocusPlayerName();
            }
            else {
                current.gameModel.setGameStatus(game.gStatus);
                current.gameModel.setGameName(game.GameName);
                current.gameModel.setPlayerName(current.gameView.getPlayerName());
                current.gameModel.setPlayerId(game.callingPlayer);
                this.sendMessage("Game '" + game.GameName + "' " +
                        (handler == "CreateGame" ? "created" : "joined") + "!");
                Board.init(LINES, COLS);

                current.gameView.renderBoard();
                current.gameView.renderMinesLeft(game.minesLeft);

                if (current.gameModel.getPlayerId() == 1) {
                    current.gameView.showStartButton();
                }
                else {
                    current.gameView.showMsgButton("Waiting on other players....");
                }
            }
            this.startPooling();
        }

        this.gameController.evtStartGame = function() {
            try {
                var req = new HttpRequest("GameAsynchronous", "StartGame", current.gameModel.getGameName(), 1);
                req.Request();
                var game = req.getJSonObject();

                for (var key in game) alert("game[" + key + "] = " + game[key]);

            } catch (e) { alert(e); }

            if (game.gStatus == STARTED) {
                current.gameModel.setGameStatus(STARTED);

                board.init();
                board.boardController.start();
                playerObj.activatePlayer(game.activePlayer);
                current.gameView.hideOptions();
            }
        }

        this.gameController.evtRemovePlayer = function() {
            try {
                var req = new HttpRequest("GameAsynchronous", "RemovePlayer", current.gameModel.getGameName(), current.gameModel.getPlayerId());
                req.Request();
            } catch (e) { alert(e); }
            location.reload(true);
        }

        this.gameController.evtCellClicked = function(cell) {
            if ((parseInt(current.gameModel.getActivePlayer()) + 1) == parseInt(current.gameModel.getPlayerId())) {
                var pos = cellObj.getPos(jQuery(cell));
                try {
                    var req = new HttpRequest("GameAsynchronous", "Play", current.gameModel.getGameName(), current.gameModel.getPlayerId()
                    , "posX", pos[0], "posY", pos[1]);
                    req.Request();
                } catch (e) { alert(e); }
            }
            else
                this.sendMessage("Wait for your turn to play!");
        }

        this.gameController.evtRevealBoard = function() {
            try {
                var req = new HttpRequest("GameAsynchronous", "RevealBoard", current.gameModel.getGameName(), current.gameModel.getPlayerId());
                req.Request();
                if (req != "") {
                    var cell = req.getJSonObject();
                    for (var i = 0; i < cell.length; i++) {
                        cellObj.update(BoardView.getCellByPos(cell[i].posX, cell[i].posY), cell[i].type, cell[i].owner, cell[i].value);
                    }
                }
            } catch (e) { alert(e); }

            current.gameView.hideOptions();
            board.boardController.revealBoard();
        }

        // --------------------------------
        // Messages

        this.gameController.sendMessage = function(msg) {
            current.gameView.renderMessage(msg);
        }

    }

    this.gameView = function() {

        // --------------------------------
        // Game Board

        if (current.gameView.renderBoard != undefined) return;

        var poolingActive = false;

        this.gameView.renderBoard = function() {
            $("." + BOARD_CLASS).empty();
            BoardView.render();
        }

        this.gameView.enableStartGameButton = function() {
            $("#StartButton").attr("disabled", "");
        }

        this.gameView.hideStartGameButton = function() {
            $("#StartButton").attr("disabled", "");
        }
        


        // --------------------------------
        // Options Menu

        this.gameView.renderOptions = function() {
            var optionsDiv = $(".divOptions");
            $("<button/>").attr("id", "MsgButton").appendTo(optionsDiv).css("display", "none");
            //$("<button/>").click(function() { current.gameController.evtListGames(); }).attr("id", "ListButton").text("List Available Games").appendTo(optionsDiv).css("display", "none");
            //$("<button/>").click(function() { current.gameController.evtNewGame(); }).attr("id", "CreateButton").text("Start New Game").appendTo(optionsDiv).css("display", "none");
            $("<button/>").click(function() { current.gameController.evtStartGame(); }).attr("disabled", "disabled").attr("id", "StartButton").text("Start Game").appendTo(optionsDiv).css("display", "none");
            $("<button/>").click(function() { current.gameController.evtRevealBoard() }).attr("id", "RevealButton").text("Reveal game board").appendTo(optionsDiv).css("display", "none");
            $("<button/>").click(function() { location.reload(true) }).attr("id", "RestartButton").text("Back to Lobby").appendTo(optionsDiv).css("display", "none");
            optionsDiv.css("display", "block");
            //current.gameView.renderGamesList();
            //current.gameView.renderGameForm();
            //current.gameView.renderPlayerForm();
        }

        this.gameView.renderGameOver = function(msg) {
            current.gameView.renderOptions();
            current.gameView.hideCreateButton();
            current.gameView.hideListButton();
            current.gameView.showRestartButton();
            current.gameView.showRevealButton();
            current.gameView.showMsgButton(msg);
        }

        this.gameView.hideOptions = function() { $(".divOptions").hide("slow"); setTimeout("$('.divOptions').empty();", 300); }

        this.gameView.showMainOptions = function() {
            current.gameView.hideOptions();
            current.gameView.startPooling();
        }

        var pooling = function() {
            if (!poolingActive) return;
            try {
                current.gameView.renderOptions();
                current.gameView.showListButton()
                current.gameView.showCreateButton();
            }
            finally { if (poolingActive) setTimeout(gName + ".gameView.doWork()", 1000); }
        }

        this.gameView.doWork = function() {
            pooling();
        }

        this.gameView.startPooling = function() {
            poolingActive = true;
            pooling();
        }

        this.gameView.stopPooling = function() {
            poolingActive = false;
        }

        //        this.gameView.hideCreateButton = function() { $("#CreateButton").hide("slow"); }
        //        this.gameView.showCreateButton = function() { $("#CreateButton").show("slow"); }

        //        this.gameView.hideListButton = function() { $("#ListButton").hide("slow"); }
        //        this.gameView.showListButton = function() { $("#ListButton").show("slow"); }

        this.gameView.hideStartButton = function() { $("#StartButton").hide("slow"); }
        this.gameView.showStartButton = function() {
            //current.gameView.hidePlayerForm();
            //current.gameView.hideGameForm();
            //current.gameView.hideCreateButton();
            //current.gameView.hideListButton();
            $("#StartButton").show("slow");
        }

        this.gameView.hideMsgButton = function() { $("#WaitButton").hide("slow"); }
        this.gameView.showMsgButton = function(msg) {
            //current.gameView.hidePlayerForm();
            //current.gameView.hideGamesList();
            //current.gameView.hideCreateButton();
            //current.gameView.hideListButton();
            $("#MsgButton").text(msg).show("slow");
        }

        this.gameView.hideRestartButton = function() { $("#RestartButton").hide("slow"); }
        this.gameView.showRestartButton = function() { $("#RestartButton").show("slow"); }

        this.gameView.hideRevealButton = function() { $("#RevealButton").hide("slow"); }
        this.gameView.showRevealButton = function() { $("#RevealButton").show("slow"); }


        // --------------------------------
        // Player Form

        //        this.gameView.renderPlayerForm = function() {
        //            var formDiv = $("<div/>").addClass("divInputName").attr("id", "addPlayerForm").css("display", "none").attr("valign", "middle");
        //            $("<input/>").attr("id", "playerNameInput").attr("maxLength", "10").appendTo(formDiv);
        //            $("<button/>").click(function() { current.gameController.evtProceedToGame(); }).text("Ok").attr({ align: "center", id: "btnProceed" }).appendTo(formDiv);
        //            $("<button/>").click(function() { current.gameView.showMainOptions(); }).text("Back").attr({ align: "center", id: "btnBack" }).appendTo(formDiv);
        //            formDiv.appendTo($(".divOptions"));
        //        }

        //        this.gameView.showPlayerForm = function() {
        //            $(".divInputName").show("slow");
        //            setTimeout('$("#playerNameInput").focus();', 500);
        //        }

        //        this.gameView.hidePlayerForm = function() {
        //            $(".divInputName").hide("slow");
        //            setTimeout('$("#playerNameInput").val("");');
        //        }

        //        this.gameView.getPlayerName = function() { return $("#playerNameInput").val(); }
        //        this.gameView.setFocusPlayerName = function() { $("#playerNameInput").focus(); }


        // --------------------------------
        // Game Form

        //        this.gameView.renderGameForm = function() {
        //            var gameForm = $("<div/>").addClass("divGameForm").attr("id", "gameForm").css("display", "none").attr("valign", "middle");
        //            $("<div>").text("Game Name").appendTo(gameForm);
        //            $("<input/>").attr("id", "gameNameInput").attr("maxLength", "20").appendTo(gameForm);
        //            gameForm.appendTo($(".divOptions"));
        //        }

        //        this.gameView.showGameForm = function() {
        //            $(".divGameForm").show("slow");
        //            setTimeout('$("#gameForm").focus();', 1000);
        //        }

        //        this.gameView.hideGameForm = function() {
        //            $(".divGameForm").hide("slow");
        //            setTimeout('$("#gameNameInput").val("");');
        //        }

        //        this.gameView.getGameName = function() { return $("#gameNameInput").val(); }
        //        this.gameView.setGameName = function(name) { $("#gameNameInput").val(name); }
        //        this.gameView.setFocusGameName = function() { $("#gameNameInput").focus(); }


        // --------------------------------
        // Games List

        //        this.gameView.renderGamesList = function() {
        //            var listDiv = $("<div/>").addClass("divGamesList").attr({ id: "gamesList", valign: "middle" }).css("display", "none");
        //            listDiv.appendTo($(".divOptions"));
        //        }

        //        this.gameView.populateGamesList = function(jSon) {
        //            $("#gamesList").empty();
        //            if (jSon == "") {
        //                $("<span/>").text("No games available!").appendTo($("#gamesList"));
        //            }
        //            else {
        //                for (var i = 0; i < jSon.length; i++) {
        //                    var gameItem = $('<input type="radio" id="gameListItem" name="gameListItem" value="' + jSon[i] + '">' + jSon[i] + '</input><br>');
        //                    gameItem.click(function() { current.gameController.evtGameSelected(); });
        //                    gameItem.appendTo($("<span/>")).appendTo($("#gamesList"));
        //                }
        //            }
        //        }

        //        this.gameView.showGamesList = function() { $(".divGamesList").show("slow"); }
        //        this.gameView.hideGamesList = function() { $(".divGamesList").hide("slow"); }
        //        this.gameView.getSelectedGame = function() { return ($("input[name='gameListItem']:checked").val()); }


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

    this.init = function() {
        current.gameModel();
        current.gameView();
        current.gameController();
    }
}