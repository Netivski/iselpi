// Game MVC initializer

var Game = new Object();
Game.init = function(){

		if (addJsFile != undefined) return;
		
		var addJsFile = function(filename)
			{
				$("<script/>").attr("type","text/javascript").attr("src",filename).appendTo($("head"));
			}

		addJsFile("Constants.js");
		addJsFile("BoardMVC.js");
		addJsFile("Cell.js");
		addJsFile("Player.js");
		
		GameModel.init();
		GameView.init();
		GameController.init();
	}

	
// Game Model ---------------------------------------------------------------------------------------
	
var GameModel = new Object();
GameModel.init = function(){
			var _activePlayers=0;
			var _currPlayer=0;
			var _players = [];
			
			this.nextPlayer = function()
				{
					do{
						_currPlayer = (_currPlayer+1)%_players.length;
					} while (_players[_currPlayer]!=true);
				}
			
			this.mineFound = function()
				{
					Player.incScore(_currPlayer);
				}
			
			this.incPlayerCount = function() 
				{
					_players.push(true);
					_activePlayers+=1; 
				}
			this.removePlayer = function(pNum) { _players.pop(); _activePlayers-=1;}
			
			this.getActivePlayers = function() { return _activePlayers;}
			this.getRegisteredPlayers = function() { return _players.length;}
			this.getCurrPlayer = function() { return _currPlayer; }		
		}

		
// Game Controller ----------------------------------------------------------------------------------

var GameController = new Object();
GameController.init = function(){
		Cell.init();
		Player.init();
		GameView.renderOptions();

		var calcMines = function()
			{
				if (TOTAL_MINES%GameModel.getRegisteredPlayers()==0)
					return TOTAL_MINES+1;
				return TOTAL_MINES;
			}
		
		var reCalcMines = function()
			{
				if (BoardModel.getMinesLeft()%GameModel.getActivePlayers()==0)
				{
					BoardController.decMinesLeft();
					GameView.renderMinesLeft(BoardModel.getMinesLeft());
					GameController.sendMessage("A mine was removed in order to avoid ties!");
				}
					
			}
		
		var nextPlayer = function()
			{
				GameModel.nextPlayer();
				Player.activatePlayer(GameModel.getCurrPlayer(),GameModel.getRegisteredPlayers());
			}
		
		var getScores = function()
			{
				var scores = [];
				
				for (var i=0 ; i<GameModel.getActivePlayers() ; i++)
				{
					scores[i] = Player.getScore(i);
				}
				return scores.sort(function (v1, v2) { return v1-v2; } );
			}
		
		var getFirstPlace = function()
			{
				var maxPlayer, maxScore=0;
				
				for (var i=0 ; i<GameModel.getActivePlayers() ; i++)
				{
					if (parseInt(Player.getScore(i))>maxScore)
					{
						maxScore=Player.getScore(i);
						maxPlayer=i;
					}
				}
				return maxPlayer;
			}
		
		var gameOver = function()
			{
				if (GameModel.getActivePlayers()<MIN_PLAYERS)
					return true;
				
				var scores = getScores();
				
				var firstPlace = parseInt(scores[scores.length-1]);
				var secondPlace = parseInt(scores[scores.length-2]);
				var minesLeft = parseInt(BoardModel.getMinesLeft());
				
				if((firstPlace) > (secondPlace + minesLeft))
				{
					return true;
				}
				return false;
			}		

		this.evtStartClicked = function()
			{
				if (GameModel.getRegisteredPlayers()>=MIN_PLAYERS)
				{
					GameView.hideOptions();
					Board.init(LINES,COLS,calcMines());
					GameView.renderBoard();
					GameView.renderMinesLeft(BoardModel.getMinesLeft());
					Player.start(GameModel.getRegisteredPlayers());
					Player.activatePlayer(GameModel.getCurrPlayer(),GameModel.getRegisteredPlayers());
					BoardController.start();
					this.sendMessage("Game has just started! Good luck!");
				}
				else
					this.sendMessage("At least 2 players are needed to start a game!")
			}
		
		this.evtCellClicked = function(cell)
			{
				if (!gameOver())
				{
					if (Cell.isMine(cell))
					{
						GameModel.mineFound();
						BoardController.decMinesLeft();
						Cell.onClick(cell,GameModel.getCurrPlayer()+1);
						this.sendMessage(Player.getName(GameModel.getCurrPlayer()) + " found a mine!");
						GameView.renderMinesLeft(BoardModel.getMinesLeft());
						if (gameOver())
							GameView.renderGameOver("Game over! Player " + Player.getName(getFirstPlace()) + " won!");
					}
					else if (Cell.isHidden(cell))
					{
						nextPlayer();
						Cell.onClick(cell,GameModel.getCurrPlayer()+1);
					}
				}
			}
		
		this.evtAddPlayer = function()
			{
				if ($("#playerNameInput").val().length==0)
				{
					this.sendMessage("Player name must be at least 1 char long!");
					return;
				}
				if(GameModel.getRegisteredPlayers()<MAX_PLAYERS)
				{
					GameModel.incPlayerCount();
					GameView.renderPlayer(GameModel.getRegisteredPlayers());
				}
				GameView.hidePlayerForm();
			}
			
		this.evtRemovePlayer = function(pNum)
			{
				if (!gameOver())
				{
					GameModel.removePlayer(pNum);
					Player.removePlayer(pNum);
					if (gameOver())
					{
						GameView.renderGameOver("Game over! Player " + Player.getName(getFirstPlace()) + " won!");
						return;
					}
					reCalcMines();
					if (GameModel.getCurrPlayer()==pNum)
						nextPlayer();
				}
			}
		
		this.revealBoard = function()
			{
				GameView.hideOptions();
				BoardController.revealBoard();
			}
		
		this.sendMessage = function(msg)
			{
				GameView.renderMessage(msg);
			}
		
	}

	
// Game View ----------------------------------------------------------------------------------------
	
var GameView = new Object();
GameView.init = function(){
		if (this.renderBoard != undefined) return;
		
		var dArena = $("." + BOARD_CLASS);
		var pBoard = $("." + PL_CLASS);
		
		this.renderBoard = function() 
			{
				$("."+BOARD_CLASS).empty();
				BoardView.render(dArena[0]); 
			}
			
		this.renderPlayer = function(pNum) 
			{
				Player.renderNew(pNum, this.getPlayerName(), pBoard[0]);
			}
			
		this.renderMinesLeft = function(minesLeft)
			{
				$("." + SCORE_LABEL).text("Mines Left");
				$("." + SCORE_VALUE).text(minesLeft);
			}
		
		this.renderMessage = function(msg)
			{
				$("." + MSGBOARD_CLASS + " ." + MSG_CLASS).text(msg);
			}
		
		this.renderOptions = function()
			{
				var optionsDiv = $(".divOptions");
				$("<button/>").click(showPlayerForm).text("Add Player").appendTo(optionsDiv);
				var formDiv = $("<div/>").addClass("divInputName").attr("id","addPlayerForm").css("display","none").attr("valign","middle");
				$("<input/>").attr("id","playerNameInput").attr("maxLength","10").appendTo(formDiv);
				$("<button/>").click(function() { GameController.evtAddPlayer(); }).text("Ok").attr("align","center").appendTo(formDiv);
				$("<button/>").click(function() { GameView.hidePlayerForm(); } ).text("Back").attr("align","center").appendTo(formDiv);
				formDiv.appendTo(optionsDiv);
				$("<button/>").click(function() { GameController.evtStartClicked(); } ).text("Start Game").appendTo(optionsDiv);
				optionsDiv.show("slow");
			}
		
		this.renderGameOver = function(msg)
			{
				var optionsDiv = $(".divOptions");
				$("<button/>").click(function() { GameController.revealBoard(); }).text("Reveal Board").appendTo(optionsDiv);
				$("<button/>").click(function() { location.reload(true) }).text("Start Again!").appendTo(optionsDiv);
				$("p").text("" + msg + "").appendTo(optionsDiv);
				optionsDiv.show("slow");
			}
		
		this.hideOptions = function () { $(".divOptions").empty().hide("slow"); }
		
		var showPlayerForm = function()
			{
				$("#addPlayerForm").show("slow");
                setTimeout('$("#playerNameInput").focus();', 1000);
			}
		
		this.hidePlayerForm = function()
			{
				$("#addPlayerForm").hide("slow");
                setTimeout('$("#playerNameInput").val("");');
			}
		
		this.getPlayerName = function()	{ return $("#playerNameInput").val(); }
	}