var IMAGES_PATH = "../images/"

var PL_CLASS = "divPlayerBoard"

var PL_INACTIVE = "divPlayerInactive"
var PL_ACTIVE = "divPlayerActive"

var PL_BOARD_CLASS = "divPlayer"
var PL_PIC_CLASS = "divPlayerPicture"
var PL_FLAG_CLASS = "divPlayerFlag"
var PL_SCORE_CLASS = "divPlayerScore"
var PL_NAME_CLASS = "divPlayerName"
var PL_QUIT_CLASS = "divPlayerQuit"
var BTN_QUIT_CLASS = "btnPlayerQuit"

var PL_PIC_SRC = IMAGES_PATH + "DefaultPicture_P" //File must be a png and must end it's name with "_Px"
var PL_FLAG_SRC = IMAGES_PATH + "Flag_P" //File must be a png and must end it's name with "_Px"

var Player = new Object();

Player.init = function()
	{

		this.renderNew = function(pNum, pName, parentElem)
			{
				var playerDiv = $("<div></div>").addClass(PL_BOARD_CLASS).attr("id","Player"+pNum);
				var playerImage = $("<img/>").attr("src",PL_PIC_SRC + pNum + ".png").attr("alt","Player " + pNum);
				var picDiv = $("<div/>").addClass(PL_PIC_CLASS);
				playerImage.appendTo(picDiv);
				
				var playerFlag = $("<img/>").attr("src",PL_FLAG_SRC + pNum + ".png").attr("alt","Player " + pNum);
				var flagDiv = $("<div></div>").addClass(PL_FLAG_CLASS);
				playerFlag.appendTo(flagDiv);
				
				var scoreDiv = $("<div/>").addClass(PL_SCORE_CLASS).text("0");
				var nameDiv = $("<div/>").addClass(PL_NAME_CLASS).text(pName);
				
				var quitButton = $("<button/>").addClass(BTN_QUIT_CLASS).text("Quit");
				var quitDiv = $("<div/>").addClass(PL_QUIT_CLASS);
				quitButton.appendTo(quitDiv);
				
				((playerDiv.append(picDiv)).append(flagDiv).append(scoreDiv));
				(playerDiv.append(nameDiv)).append(quitDiv);
				
				jQuery(parentElem).append(playerDiv);
			}
		
		this.incScore = function(pNum) { setScore(pNum,this.getScore(pNum)*1+1); }
		
		this.getScore = function(pNum) { return $("."+ PL_SCORE_CLASS + ":eq("+pNum+")").text(); }
		
		var setScore = function(pNum, val) { $("." + PL_SCORE_CLASS+":eq("+pNum+")").text(val); }

		this.getName = function(pNum) { return $("." + PL_NAME_CLASS + ":eq("+pNum+")").text(); }
		
		this.activatePlayer = function( idPlayer, nPlayers )
			{
				idPlayer = parseInt(idPlayer);
				for (var i = 0; i < nPlayers; i++) {
					$("." + PL_PIC_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE,i!=idPlayer).toggleClass(PL_ACTIVE,i==idPlayer);
					$("." + PL_FLAG_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE,i!=idPlayer).toggleClass(PL_ACTIVE,i==idPlayer);
					$("." + PL_NAME_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE,i!=idPlayer).toggleClass(PL_ACTIVE,i==idPlayer);
					$("." + PL_SCORE_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE,i!=idPlayer).toggleClass(PL_ACTIVE,i==idPlayer);
				}
			}
		
		this.removePlayer = function (pNum)
			{
				// $("." + PL_BOARD_CLASS + ":eq("+pNum+") ." + PL_FLAG_CLASS).remove();
				// $("." + PL_BOARD_CLASS + ":eq("+pNum+") ." + PL_SCORE_CLASS).remove();
				// $("." + PL_BOARD_CLASS + ":eq("+pNum+") ." + PL_NAME_CLASS).text("Quited!");
				// $("." + PL_BOARD_CLASS + ":eq("+pNum+") ." + PL_QUIT_CLASS).remove();
				$("." + PL_BOARD_CLASS + ":eq("+pNum+")").css("display","none");
			}
		
		this.addEventListener = function (pNum)
			{
				$("." + BTN_QUIT_CLASS + ":eq("+pNum+")").click(function() { GameController.evtRemovePlayer(pNum); });
			}
		
		this.start = function(numPlayers) { for (var i=0 ; i<numPlayers ; i++) this.addEventListener(i); }
		
	}
