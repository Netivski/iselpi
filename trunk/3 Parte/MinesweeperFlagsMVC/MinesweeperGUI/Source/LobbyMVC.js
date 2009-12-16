// Lobby MVC initializer

var Lobby = new Object();

Lobby.init = function(vd) { // vd == Virtual Directory

    LobbyModel.init();
    LobbyView.init();
    LobbyController.init();
}


// Lobby Model ---------------------------------------------------------------------------------------

var LobbyModel = new Object();
LobbyModel.init = function() {

    var _pName = null;
	
    this.setPlayerName = function(pName) { _pName = pName; }
    this.getPlayerName = function() { return _pName; }
}


// Lobby Controller ----------------------------------------------------------------------------------

var LobbyController = new Object();
LobbyController.init = function() {


	LobbyView.renderProfile("http://www.istockphoto.com/file_thumbview_approve/5200069/2/istockphoto_5200069-wave-icon.jpg", "Name");
    LobbyView.renderOptions();
	LobbyView.renderFriendList();
	LobbyView.renderPlayerList();
	LobbyView.renderGameList();
	LobbyView.renderMsgBoard();
	LobbyView.renderMsgInput();


    // --------------------------------
    // Pooling

    var poolingActive = false;

    var pooling = function() {
        if (!poolingActive) return;
        try {
            poolGamesRefresh();
            poolPlayersRefresh();
            poolFriendsRefresh();
            poolMessageRefresh();
            poolInvitesRefresh();
            poolProfileRefresh();
        }
        finally { if (poolingActive) setTimeout("LobbyController.doWork()", 1000); }
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

	var poolGamesRefresh = function() {
	}
	var poolPlayersRefresh = function(){
        var req = new HttpRequest("RefreshPlayers", undefined, undefined, "pName", LobbyModel.getPlayerName());
        req.Request();
        if (req != "") {
			//Update lobby view with information about online players
        }
	}

	var poolFriendsRefresh = function(){
		var req = new HttpRequest("RefreshFriends",undefined, undefined, "pName", LobbyModel.getPlayerName());
		if (req != "") {
			//Update lobby view with information about online friends
		}
	}
	
	var poolMessageRefresh = function(){
		var req = new HttpRequest("RefreshMessages",undefined, undefined, "pName", LobbyModel.getPlayerName());
		if (req != "") {
			var message = req.getJSonObject();
			for (var i = 0; i < message.length; i++) {
				this.sendMessage(message[i].value);
			}
		}
	}
	
	var poolInvitesRefresh = function(){
		var req = new HttpRequest("RefreshInvites",undefined, undefined, "pName", LobbyModel.getPlayerName());
		if (req != "") {
			var invite = req.getJSonObject();
			for (var i = 0; i < invite.length; i++) {
				this.sendMessage(invite[i].value);
				//Perform other necessary operarions when receiving invites
			}
		}
	}
	
	var poolProfileRefresh = function(){
		var req = new HttpRequest("RefreshProfile",undefined, undefined, "pName", LobbyModel.getPlayerName());
		if (req != "") {
			//Update lobby view with profile updates (name, img,...)
		}
	
	}

    // --------------------------------    
    // Events

		
	this.evtStartPublicGame = function() {
		
		//Creation of new tab with a new Game

        try {
            var req = new HttpRequest("StartPublicGame", undefined, undefined, "pName", LobbyModel.getPlayerName());
            req.Request();
            var game = req.getJSonObject();
        } catch (e) { alert(e); }
		
		//Request response should return new tab html
        
    }

	this.evtStartPrivateGame = function() {
		
		//Creation of new tab with a new Game

        try {
            var req = new HttpRequest("StartPrivateGame", undefined, undefined, "pName", LobbyModel.getPlayerName());
            req.Request();
            var game = req.getJSonObject();
        } catch (e) { alert(e); }
		
		//Request response should return new tab html
        
    }	
	
	
    this.evtAddFriend = function() {
        try {
            var req = new HttpRequest("AddFriend", undefined, undefined, "pName"
				,LobbyModel.getPlayerName(), "fName", LobbyView.getSelPlayer());
            req.Request();
        } catch (e) { alert(e); }
    }

    this.evtRemoveFriend = function() {
		try {
			var req = new HttpRequest("RemoveFriend", undefined, undefined, "pName"
				,LobbyModel.getPlayerName(), "fName", LobbyView.getSelectedFriend());
			req.Request();
		} catch (e) { alert(e); }
	}

	this.evtJoinGame = function() {
		try{
			var req = new HttpRequest("JoinGame", undefined, undefined, "pName"
				,LobbyModel.getPlayerName(), "gName", LobbyView.getSelectedGame());
			req.Request();
		} catch (e) { alert(e); }
	}

	this.evtEditProfile = function() {
		try{
			var req = new HttpRequest("EditProfile", undefined, undefined, "pName"
				,LobbyModel.getPlayerName(), "pName", LobbyView.getSelectedGame());
			req.Request();
		} catch (e) { alert(e); }
	}	
	
	this.evtSendMessage = function() {
        try {
            var req = new HttpRequest("SendMessage", undefined, undefined, "pName"
				,LobbyModel.getPlayerName(), "pMsg", LobbyView.getMsgInput());
            req.Request();
        } catch (e) { alert(e); }
		LobbyView.clearMsgInput();
	}
	
    // --------------------------------
    // Messages

    this.sendMessage = function(msg) {
        LobbyView.renderMessage(msg);
    }
}



// Lobby View ----------------------------------------------------------------------------------------

var LobbyView = new Object();
LobbyView.init = function() {


	// --------------------------------
    // Profile Information
	this.renderProfile = function(photoUrl, pName) {
		var playerPhoto = $(".divPhoto");
		var playerName = $(".divPlayerName");
		$("<img/>").addClass("photo").attr("src",photoUrl).appendTo(playerPhoto);
		playerName.text(pName);
	}
	

    // --------------------------------
    // Options Menu

    this.renderOptions = function() {
        var optionsDiv = $(".divPlayerOptions");
        $("<button/>").click(function() { LobbyController.evtEditProfile(); }).attr("id", "ProfileButton").text("Edit Profile").appendTo(optionsDiv);
        $("<button/>").click(function() { LobbyController.evtStartPublicGame(); }).attr("id", "StartPublicButton").text("Start Public Game").appendTo(optionsDiv);
        $("<button/>").click(function() { LobbyController.evtStartPrivateGame(); }).attr("id", "StartPrivateButton").text("Start Private Game").appendTo(optionsDiv);
		
	}

	
	// --------------------------------
    // Friends List

    this.renderFriendList = function() {
        var listDiv = $(".divPlayerFriendsList").attr("id","friendList");
    }

    this.populateFriendList = function(jSon) {
        var listDiv = $("#friendList");
		listDiv.empty();
        
		if (jSon == "") {
            $("<span/>").text("No friends online!").appendTo(listDiv);
        }
        else {
            for (var i = 0; i < jSon.length; i++) {
                var friendItem = $('<input type="radio" id="friendListItem" name="friendListItem" value="' + jSon[i] + '">' + jSon[i] + '</input><br>');
                friendItem.appendTo($("<span/>")).appendTo(listDiv);
            }
			$("<button/>").click(function() { LobbyController.evtRemoveFriend(); }).attr("id", "RemoveFriend").text("Remove Friend").appendTo(listDiv);
        }
    }

    this.getSelectedFriend = function() { return ($("input[name='friendListItem']:checked").val()); }

	
	// --------------------------------
    // Players List

    this.renderPlayerList = function() {
        var listDiv = $(".divPlayersOnList").attr("id","playerList");
    }

    this.populatePlayerList = function(jSon) {
        var listDiv = $("#playerList");
		listDiv.empty();
        
		if (jSon == "") {
            $("<span/>").text("No players online!").appendTo(listDiv);
        }
        else {
            for (var i = 0; i < jSon.length; i++) {
                var playerItem = $('<input type="radio" id="playerListItem" name="playerListItem" value="' + jSon[i] + '">' + jSon[i] + '</input><br>');
                playerItem.appendTo($("<span/>")).appendTo(listDiv);
            }
			$("<button/>").click(function() { LobbyController.evtAddFriend(); }).attr("id", "AddFriend").text("Add Friend").appendTo(listDiv);
        }
    }

    this.getSelectedPlayer = function() { return ($("input[name='playerListItem']:checked").val()); }

	
	// --------------------------------
    // Games List

    this.renderGameList = function() {
        var listDiv = $(".divGameOnList").attr("id","gameList");
    }

    this.populateGameList = function(jSon) {
        var listDiv = $("#gameList");
		listDiv.empty();
        
		if (jSon == "") {
            $("<span/>").text("No games available!").appendTo(listDiv);
        }
        else {
            for (var i = 0; i < jSon.length; i++) {
                var gameItem = $('<input type="radio" id="gameListItem" name="gameListItem" value="' + jSon[i] + '">' + jSon[i] + '</input><br>');
                gameItem.appendTo($("<span/>")).appendTo(listDiv);
            }
			$("<button/>").click(function() { LobbyController.evtJoinGame(); }).attr("id", "JoinGame").text("Join Game").appendTo(listDiv);
        }
    }

    this.getSelectedGame = function() { return ($("input[name='gameListItem']:checked").val()); }

	
	// --------------------------------
    // Messages Box

    this.renderMsgBoard = function() {
        var listDiv = $(".divMessageBoard").attr("id","msgBoard");
    }

    this.addMessage = function(jSon) {
        var listDiv = $("#msgBoard");
		for (var i = 0; i < jSon.length; i++) {
			listDiv.html(listDiv.html() + "<br>" + "> " + jSon[i]);
		}
    }
	
	this.clearMsgList = function() { $("#msgBoard").html(""); }
	

	// --------------------------------
    // Message Input

    this.renderMsgInput = function() {
        var listDiv = $(".divPlayerMessage").attr("id","playerMsg").empty();
		$("<input/>").attr("id", "msgInput").appendTo(listDiv);
        $("<button/>").click(function() { LobbyController.evtSendMessage(); }).text("Ok").attr({ align: "center", id: "btnSend" }).appendTo(listDiv);
    }
	
	this.clearMsgInput = function() { $("#msgInput").text(""); }
	this.getMsgInput = function() { return $("#msgInput").text(); }

}