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

    GameView.renderOptions();

    var poolingActive = false;

    var pooling = function() {
    try {
        
            //<RefreshCell>        Get Cell 2 Refresh
            //<RefreshPlayerBoard> Get Counters
            //<RefreshGameOver> Get GameOver
        }
        finally { if (poolingActive) setTimeout("doWork()", 1000); }
    }

    this.StartPooling = function() {
        poolingActive = true;
        pooling();
    }

    this.StopPooling = function() {
      poolingActive = false;
    }

    var validateInputs = function() {

        if ($("#playerNameInput").val().length == 0) {
            GameController.sendMessage("Player name must be at least 1 char long!");
            $("#playerNameInput").focus();
            return false;
        }
        else if ($("#gameNameInput").val().length == 0) {
            GameController.sendMessage("Game name must be at least 1 char long!");
            $("#gameNameInput").focus();
            return false;
        }        
        return true;
    }

    //NewEvents
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
        $("#gameNameInput").val(($("input[name='gameListItem']:checked").val()));
    }

    this.evtProceedToGame = function() {
        if (!validateInputs()) return;
        
        var handler = ($(".divGamesList").css("display") == "block" ? "JoinPlayer" : "CreateGame");
        try {
            var req = new HttpRequest(handler, $("#gameNameInput").val(), $("#playerNameInput").val(), 0);
            req.Request();
            var result = req.getJSonObject();
        } catch (e) { alert(e); }
        if (result.PlayerId == -1) {
            this.sendMessage("Game named '" + result.GameName + "' already exists!");
            $("#gameNameInput").focus()
        }
        else {
            GameModel.setGameName(result.GameName);
            GameModel.setPlayerName(result.PlayerName);
            GameModel.setPlayerId(result.PlayerId);
            Board.init(LINES, COLS);

            //Requisitos:
            // JSon devolvido após criar um jogo tem que ter:
            //      Cols, Lines, MinesLeft

            GameView.hideOptions();
            GameView.renderBoard();
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

    //End NewEvents

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

    this.sendMessage = function(msg) {
        GameView.renderMessage(msg);
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

    //ReMade

    //Player Form
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

    //Game Form

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

    //Games List

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


    //Options Menu

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


    //The rest...

    this.renderPlayer = function(pNum) {
        Player.renderNew(pNum, this.getPlayerName(), pBoard[0]);
    }

    this.renderMinesLeft = function(minesLeft) {
        $("." + SCORE_LABEL).text("Mines Left");
        $("." + SCORE_VALUE).text(minesLeft);
    }

    this.renderMessage = function(msg) {
        $("." + MSGBOARD_CLASS + " ." + MSG_CLASS).text(msg);
    }


    this.renderGameOver = function(msg) {
        var optionsDiv = $(".divOptions");
        $("<button/>").click(function() { GameController.revealBoard(); }).text("Reveal Board").appendTo(optionsDiv);
        $("<button/>").click(function() { location.reload(true) }).text("Start Again!").appendTo(optionsDiv);
        $("p").text("" + msg + "").appendTo(optionsDiv);
        optionsDiv.show("slow");
    }

    this.getPlayerName = function() { return $("#playerNameInput").val(); }
}