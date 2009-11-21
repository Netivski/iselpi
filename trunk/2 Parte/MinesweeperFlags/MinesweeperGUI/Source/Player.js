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
				
				playerDiv.appendTo($("."+PL_CLASS));
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
				$("." + PL_BOARD_CLASS + ":eq("+pNum+")").css("display","none");
			}
		
		this.addEventListener = function (pNum)
			{
				$("." + BTN_QUIT_CLASS + ":eq("+pNum+")").click(function() { GameController.evtRemovePlayer(pNum); });
			}
		
		this.start = function(numPlayers) { for (var i=0 ; i<numPlayers ; i++) this.addEventListener(i); }
		
	}