// Game MVC initializer

var Game = new Object();

Game.init = function(){

		if (addJsFile != undefined) return;
		
		var addJsFile = function(filename)
			{
				$("<script/>").attr("type","text/javascript").attr("src",filename).appendTo($("head"));
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
    
    var _gName = null;
    var _pName = null;
    var _pId = 0;

    this.setPlayerId = function(pId) { _pId = pId; }
    this.getPlayerId = function() { return _pId; }

    this.setPlayerName = function(pName) { _pName = pName; }
    this.getPlayerName = function() { return _pName; }

    this.setGameName = function(gName) { _gName = gName; }
    this.getGameName = function() { return _gName; }
	
}

		
// Game Controller ----------------------------------------------------------------------------------

var GameController = new Object();
GameController.init = function() {

    Cell.init();
    Board.init();
    Player.init();

    GameView.renderOptions();


    // --------------------------------
    // Pooling

    var poolingActive = false;

    var pooling = function() {
        if (!poolingActive) return;
        try {

            var req = new HttpRequest("RefreshPlayerBoard", GameModel.getGameName(),
                 GameModel.getPlayerName(), GameModel.getPlayerId());
            req.Request();
            var player = req.getJSonObject();
            for (var i=0 ; i<player.length ; i++){
                Player.renderNew(player[i].Id, player[i].Name);
            }
            poolingActive = false;
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


    // --------------------------------
    // Validators

    var validateInputs = function() {

        if (GameView.getPlayerName().length == 0) {
            GameController.sendMessage("Player name must be at least 1 char long!");
            GameView.setFocusPlayerName();
            return false;
        }
        else if (GameView.getGameName().length == 0) {
            GameController.sendMessage("Game name must be at least 1 char long!");
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
        GameView.hideStartButton();
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

        var handler = GameView.isNewGame() ? "CreateGame" : "AddPlayer";
        try {
            var req = new HttpRequest(handler, GameView.getGameName(), GameView.getPlayerName(), 0);
            req.Request();
            var game = req.getJSonObject();
        } catch (e) { alert(e); }
        if (game.gStatus == GAME_INVALID) {
            this.sendMessage("Game named '" + game.GameName + "' already exists!");
            GameView.setFocusGameName();
        }
        else {
            GameModel.setGameName(game.GameName);
            GameModel.setPlayerName(GameView.getPlayerName());
            GameModel.setPlayerId(game.callingPlayer);
            GameController.sendMessage("Game '" + game.GameName + "' created!");
            Board.init(LINES, COLS);

            //Requisitos:
            // JSon devolvido após criar um jogo tem que ter:
            //      Cols, Lines, MinesLeft

            GameView.hideOptions();
            GameView.renderBoard();
            GameView.renderMinesLeft(game.minesLeft);
            this.startPooling();
            if (GameModel.getPlayerId() == 1) {
                //Neste caso mostra o botão de "Start Game"

            }
            else {
                //Neste caso mostra algo que indique "Waiting for game to start..."
            }

            //            GameView.renderMinesLeft(BoardModel.getMinesLeft());
            //            Player.start(GameModel.getRegisteredPlayers());
            //            Player.activatePlayer(GameModel.getCurrPlayer(), GameModel.getRegisteredPlayers());
            //            BoardController.start();
        }
    }


    // --------------------------------
    // Messages

    this.sendMessage = function(msg) {
        GameView.renderMessage(msg);
    }


    // --------------------------------
    // The rest...

    this.evtCellClicked = function(cell) {
        if (!gameOver()) {
            if (Cell.isMine(cell)) {
                GameModel.mineFound();
                BoardController.decMinesLeft();
                Cell.onClick(cell, GameModel.getCurrPlayer() + 1);
                this.sendMessage(Player.getName(GameModel.getCurrPlayer()) + " found a mine!");
                GameView.renderMinesLeft(BoardModel.getMinesLeft());
                if (gameOver())
                    GameView.renderGameOver("Game over! Player " + Player.getName(getFirstPlace()) + " won!");
            }
            else if (Cell.isHidden(cell)) {
                nextPlayer();
                Cell.onClick(cell, GameModel.getCurrPlayer() + 1);
            }
        }
    }

    this.evtRemovePlayer = function(pNum) {
        if (!gameOver()) {
            GameModel.removePlayer(pNum);
            Player.removePlayer(pNum);
            if (gameOver()) {
                GameView.renderGameOver("Game over! Player " + Player.getName(getFirstPlace()) + " won!");
                return;
            }
            reCalcMines();
            if (GameModel.getCurrPlayer() == pNum)
                nextPlayer();
        }
    }

    this.revealBoard = function() {
        GameView.hideOptions();
        BoardController.revealBoard();
    }

}

	
	
// Game View ----------------------------------------------------------------------------------------
	
var GameView = new Object();
GameView.init = function() {

    if (this.renderBoard != undefined) return;

    var dArena = $("." + BOARD_CLASS);
    var pBoard = $("." + PL_CLASS);

    this.renderBoard = function() {
        $("." + BOARD_CLASS).empty();
        BoardView.render(dArena[0]);
    }


    // --------------------------------
    // Options Menu

    this.renderOptions = function() {
        var optionsDiv = $(".divOptions");
        $("<button/>").click(function() { GameController.evtListGames(); }).attr("id", "ListButton").text("List Available Games").appendTo(optionsDiv);
        $("<button/>").click(function() { GameController.evtNewGame(); }).attr("id", "StartButton").text("Start New Game").appendTo(optionsDiv);
        optionsDiv.css("display", "block");
        this.renderGamesList();
        this.renderGameForm();
        this.renderPlayerForm();
    }

    this.hideOptions = function() { $(".divOptions").hide("slow"); setTimeout("$('.divOptions').empty();", 1000); }

    this.showMainOptions = function() {
        GameView.hideOptions();
        setTimeout("GameView.renderOptions();", 1000);
    }

    this.hideStartButton = function() { $("#StartButton").hide("slow"); }
    this.showStartButton = function() { $("#StartButton").show("slow"); }

    this.hideListButton = function() { $("#ListButton").hide("slow"); }
    this.showListButton = function() { $("#ListButton").show("slow"); }


    // --------------------------------
    // Player Form

    this.renderPlayerForm = function() {
        var formDiv = $("<div/>").addClass("divInputName").attr("id", "addPlayerForm").css("display", "none").attr("valign", "middle");
        $("<input/>").attr("id", "playerNameInput").attr("maxLength", "10").appendTo(formDiv);
        $("<button/>").click(function() { GameController.evtProceedToGame(); }).text("Ok").attr("align", "center").appendTo(formDiv);
        $("<button/>").click(function() { GameView.showMainOptions(); }).text("Back").attr("align", "center").appendTo(formDiv);
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
        var listDiv = $("<div/>").addClass("divGamesList").attr("id", "gamesList").attr("valign", "middle");
        listDiv.css({ "display": "none",
            "background-color": "yellow",
            "color": "red",
            "font-family": "Verdana",
            "text-align": "center"
        });
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
    //Messages

    this.renderMessage = function(msg) {
        $("." + MSGBOARD_CLASS + " ." + MSG_CLASS).text(msg);
    }


    // --------------------------------
    //State interrogations

    this.isNewGame = function() { return ($(".divGamesList").css("display") == "none"); }


    // --------------------------------
    //The rest...

    this.renderPlayer = function(pNum) {
        Player.renderNew(pNum, this.getPlayerName(), pBoard[0]);
    }

    this.renderMinesLeft = function(minesLeft) {
        $("." + SCORE_LABEL).text("Mines Left");
        $("." + SCORE_VALUE).text(minesLeft);
    }

    this.renderGameOver = function(msg) {
        var optionsDiv = $(".divOptions");
        $("<button/>").click(function() { GameController.revealBoard(); }).text("Reveal Board").appendTo(optionsDiv);
        $("<button/>").click(function() { location.reload(true) }).text("Start Again!").appendTo(optionsDiv);
        $("p").text("" + msg + "").appendTo(optionsDiv);
        optionsDiv.show("slow");
    }

}