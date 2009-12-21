// Lobby MVC initializer


var Lobby = new Object();

Lobby.init = function(pName) {

    LobbyModel.init(pName);
    LobbyView.init();
    LobbyController.init();
    LobbyController.startPooling();
}


// Lobby Model ---------------------------------------------------------------------------------------

var LobbyModel = new Object();
LobbyModel.init = function(pName) {

    var _pName = pName;

    this.setPlayerName = function(pName) { _pName = pName; }
    this.getPlayerName = function() { return _pName; }
}


// Lobby Controller ----------------------------------------------------------------------------------

var LobbyController = new Object();
LobbyController.init = function() {

    var handlerClass = "Lobby";

    LobbyView.renderProfile("http://www.istockphoto.com/file_thumbview_approve/5200069/2/istockphoto_5200069-wave-icon.jpg", "Snack");
    LobbyView.renderOptions();
    LobbyView.renderFriendList();
    LobbyView.renderPlayerList();
    LobbyView.renderGameList();
    LobbyView.renderMsgInput();


    // --------------------------------
    // Pooling

    var poolingActive = false;

    var pooling = function() {
        if (!poolingActive) return;
        try {
            poolPlayersRefresh();
            //            poolGamesRefresh();
            poolFriendsRefresh();
            poolMessagesRefresh();
            //            poolProfileRefresh();
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
        var req = new HttpRequest(handlerClass, "RefreshGames", undefined, 0, "eMail", LobbyModel.getPlayerName());
        req.Request();
        if (req != "") {
            jSon = req.getJSonObject();
            for (var i = 0; i < jSon.length; i++) {
                if (jSon[i].status == GAME_OVER || jSon[i].status == STARTED) {
                    LobbyView.removeGame(jSon[i]);
                } else {
                    LobbyView.addGame(jSon[i]);
                }
            }
        }
    }

    var poolPlayersRefresh = function() {
        var req = new HttpRequest(handlerClass, "RefreshPlayers", undefined, 0, "eMail", LobbyModel.getPlayerName());
        req.Request();
        if (req != "") {
            jSon = req.getJSonObject();
            for (var i = 0; i < jSon.length; i++) {
                if (jSon[i].status == PLAYER_STATUS_OFF) {
                    LobbyView.removePlayer(jSon[i]);
                } else {
                    LobbyView.addPlayer(jSon[i]);
                }
            }
        }
    }

    var poolFriendsRefresh = function() {
        var req = new HttpRequest(handlerClass, "RefreshFriends", undefined, 0, "eMail", LobbyModel.getPlayerName());
        req.Request();
        if (req != "") {
            jSon = req.getJSonObject();
            if (jSon.length > 0) {
                for (var i = 0; i < jSon.length; i++) {
                    LobbyView.addFriend(jSon[i]);
                }
            }
        }
    }

    var poolMessagesRefresh = function() {
        var req = new HttpRequest(handlerClass, "RefreshMessages", undefined, 0, "eMail", LobbyModel.getPlayerName());
        req.Request();
        if (req != "") {
            messages = req.getJSonObject();
            for (var i = 0; i < messages.length; i++)
                LobbyView.addMessage(messages[i]);
        }
    }

    var poolInvitesRefresh = function() {
        var req = new HttpRequest(handlerClass, "RefreshInvites", undefined, 0, "eMail", LobbyModel.getPlayerName());
        req.Request();
        if (req != "") {
            invites = req.getJSonObject();
            LobbyController.addInvite(invites);
        }
    }

    var poolProfileRefresh = function() {
        var req = new HttpRequest(handlerClass, "RefreshProfile", undefined, 0, "eMail", LobbyModel.getPlayerName());
        req.Request();
        if (req != "") {
            //Update lobby view with profile updates (name, img,...)
        }

    }

    // --------------------------------    
    // Events


    this.evtProceedToGame = function() {
        var handler;

        if (LobbyView.getGameName() == "") return;

        if (LobbyView.isPublicGame())
            handler = "StartPublicGame";
        else {
            handler = "StartPrivateGame";
            selFriendCount = LobbyView.getSelFriendCount();
            if (selFriendCount < 1 || selFriendCount > 4) {
                this.sendMessage("Minimum number of invites for private game is 1, maximum is 3!");
                return;
            }
        }

        try {
            var req = new HttpRequest(handlerClass, handler, LobbyView.getGameName(), 0,
                "eMail", LobbyModel.getPlayerName());
            req.Request();
            var game = req.getJSonObject();
        } catch (e) { alert(e); }

        if (handler = "StartPrivateGame") {
            selFriends = LobbyView.getSelFriends();
            for (var i = 0; i < selFriends.length; i++) {
                try {
                    invite = new HttpRequest(handlerClass, "Invite", LobbyView.getGameName(), 0,
                "eMailFrom", LobbyModel.getPlayerName(), "eMailTo", selFriends[i]);
                    invite.Request();
                } catch (e) { alert(e); }
            }
        }

        if (game.gStatus == INVALID_NAME) {
            this.sendMessage("Game named '" + game.GameName + "' already exists!");
            LobbyView.setFocusGameName();
        }
        else {
            this.startGame(LobbyView.getGameName());
        }
    }

    this.evtStartPublicGame = function() {

        if (!LobbyView.isGameFormVisible()) {
            LobbyView.showGameForm();
            LobbyView.hidePrivateButton();
            return;
        }
    }

    this.evtStartPrivateGame = function() {

        if (!LobbyView.isGameFormVisible()) {
            LobbyView.showGameForm();
            LobbyView.hidePublicButton();
            return;
        }
    }

    this.evtSendInvite = function(gName, pName) {
        try {
            var req = new HttpRequest(handlerClass, "SendInvite", gName, 0, "eMail"
                , LobbyModel.getPlayerName(), "friend", pName);
            req.request();
        }
        catch (e) { alert(e); }
    }

    this.evtAddFriend = function() {
        try {
            var req = new HttpRequest(handlerClass, "AddFriend", undefined, 0, "eMail"
				, LobbyModel.getPlayerName(), "friend", LobbyView.getSelectedPlayer());
            req.Request();
        } catch (e) { alert(e); }
    }

    this.evtRemoveFriend = function() {
        if (LobbyView.getSelFriendCount() != 1) {
            this.sendMessage("Only one friend should be selected in order to proceed with removal!");
            return false;
        }
        selFriend = LobbyView.getSelectedFriends();
        try {
            var req = new HttpRequest(handlerClass, "RemoveFriend", undefined, 0, "eMail"
				, LobbyModel.getPlayerName(), "friend", selFriend);
            req.Request();
        } catch (e) { alert(e); }
        LobbyView.removeFriend(selFriend);
    }

    this.evtJoinGame = function() {
        try {
            var req = new HttpRequest(handlerClass, "JoinGame", undefined, 0, "playerName"
				, LobbyModel.getPlayerName(), "gName", LobbyView.getSelectedGame());
            req.Request();
        } catch (e) { alert(e); }
    }

    this.evtEditProfile = function() {
        try {
            var req = new HttpRequest(handlerClass, "EditProfile", undefined, 0, "playerName"
				, LobbyModel.getPlayerName(), "pName", LobbyView.getSelectedGame());
            req.Request();
        } catch (e) { alert(e); }
    }

    this.evtSendMessage = function() {
        if (LobbyView.getMsgInput() == "")
            return;
        try {
            var req = new HttpRequest(handlerClass, "SendMessage", undefined, 0, "eMail"
				, LobbyModel.getPlayerName(), "msg", LobbyView.getMsgInput());
            req.Request();
        } catch (e) { alert(e); }
        LobbyView.clearMsgInput();
    }

    this.evtSendPrivateMessage = function() {
        if (LobbyView.getMsgInput() == "")
            return;
        try {
            var req = new HttpRequest(handlerClass, "SendPrivateMessage", undefined, 0, "eMail"
				, LobbyModel.getPlayerName(), "eMailTo", LobbyView.getSelectedPlayerTo()
				, "msg", "*" + LobbyView.getMsgInput());
            req.Request();
        } catch (e) { alert(e); }
        LobbyView.clearMsgInput();
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
        $("<img/>").addClass("photo").attr("src", photoUrl).appendTo(playerPhoto);
        playerName.text(pName);
    }


    // --------------------------------
    // Options Menu

    this.renderOptions = function() {
        var optionsDiv = $(".divPlayerOptions");
        $("<button/>").click(function() { LobbyController.evtEditProfile(); }).attr("id", "ProfileButton").text("Edit Profile").appendTo(optionsDiv);

        var formDiv = $("<div/>").addClass("divGameForm").attr("id", "gameForm").css("display", "none").attr("valign", "middle");
        $("<input/>").attr("id", "gameNameInput").attr("maxLength", "20").appendTo(formDiv);
        $("<button/>").click(function() { LobbyController.evtProceedToGame(); }).text("Ok").attr({ align: "center", id: "btnProceed" }).appendTo(formDiv);
        $("<button/>").click(function() { LobbyView.hideGameForm(); }).text("Back").attr({ align: "center", id: "btnBack" }).appendTo(formDiv);
        formDiv.appendTo(optionsDiv);

        $("<button/>").click(function() { LobbyController.evtStartPublicGame(); }).attr("id", "StartPublicButton").text("Start Public Game").appendTo(optionsDiv);
        $("<button/>").click(function() { LobbyController.evtStartPrivateGame(); }).attr("id", "StartPrivateButton").text("Start Private Game").appendTo(optionsDiv);
    }

    this.showGameForm = function() {
        $(".divGameForm").show("slow");
        setTimeout('$("#gameForm").focus();', 1000);
    }

    this.hideGameForm = function() {
        $(".divGameForm").hide("slow");
        this.showPublicButton();
        this.showPrivateButton();
        setTimeout('$("#gameNameInput").val("");');
    }

    this.isGameFormVisible = function() { return $(".divGameForm").is(":visible"); }
    this.isPublicGame = function() { return $("#StartPublicButton").is(":visible"); }

    this.showPublicButton = function() { $("#StartPublicButton").show("slow"); }
    this.hidePublicButton = function() { $("#StartPublicButton").hide("slow"); }

    this.showPrivateButton = function() { $("#StartPrivateButton").show("slow"); }
    this.hidePrivateButton = function() { $("#StartPrivateButton").hide("slow"); }

    this.getGameName = function() { return $("#gameNameInput").val(); }
    this.setGameName = function(name) { $("#gameNameInput").val(name); }


    // --------------------------------
    // Friends List

    this.renderFriendList = function() {
        var listDiv = $(".divPlayerFriendsList");
        $("<button/>").click(function() { LobbyController.evtRemoveFriend(); }).attr("id", "RemoveFriendButton").text("Remove Friend").css("display", "none").appendTo(listDiv);
    }

    this.addFriend = function(player) {
        var listDiv = $("#frList");
        if ($("#fr_" + player.email + "").length == 0) {
            var friendItem = $('<input type="checkbox" id="' + player.email + '" name="friendListItem"</input>&nbsp;');
            $("<dt/>").attr("id", "fr_" + player.email).toggleClass(player.status).append(friendItem).append($("<span/>").text(player.email)).appendTo(listDiv);
        }
        $("#fr_" + player.email + "").removeClass().toggleClass(player.status);
        if (getFriendCount() > 0) showRemoveFriendButton();
    }

    this.removeFriend = function(eMail) {
        $("#fr_" + eMail + "").remove();
        if (getFriendCount() == 0) hideRemoveFriendButton();
    }

    var getFriendCount = function() { return ($("input[name='friendListItem']").length); }
    this.getSelFriendCount = function() {
        return $("input[name='friendListItem']:checked").length;
    }

    this.getSelectedFriends = function() {

        var selectedFriends;
        var outValues = new Array();
        selectedFriends = $("input[name='friendListItem']:checked");
        for (var i = 0; i < selectedFriends.length; i++) {
            outValues[i] = $(selectedFriends[i]).attr("id");
        }
        return outValues;
    }

    var showRemoveFriendButton = function() { $("#RemoveFriendButton").show("slow"); }
    var hideRemoveFriendButton = function() { $("#RemoveFriendButton").hide("slow"); }


    // --------------------------------
    // Players List

    this.renderPlayerList = function() {
        var listDiv = $(".divPlayersOnList");
        $("<button/>").click(function() { LobbyController.evtAddFriend(); }).attr("id", "AddPlayerButton").text("Add To Friends").css("display", "none").appendTo(listDiv);
    }

    this.addPlayer = function(player) {
        var listDiv = $("#plList");
        if ($("#pl_" + player.email + "").length == 0) {
            var playerItem = $('<input type="radio" id="playerListItem" name="playerListItem" value="' + player.email + '">' + player.email + '</input><br>');
            $("<dt/>").attr("id", "pl_" + player.email).append(playerItem).appendTo(listDiv);
            this.addPlayerTo(player);
        }
        if (getPlayerCount() > 0) showAddPlayerButton();
    }

    this.removePlayer = function(player) {
        $("#pl_" + player.email + "").remove();
        this.removePlayerTo(player);
        if (getPlayerCount() == 0) hideAddPlayerButton();
    }

    this.getSelectedPlayer = function() { return ($("input[name='playerListItem']:checked").val()); }
    var getPlayerCount = function() { return ($("#plList <dt/>").length); }
    var showAddPlayerButton = function() { $("#AddPlayerButton").show("slow"); }
    var hideAddPlayerButton = function() { $("#AddPlayerButton").hide("slow"); }


    // --------------------------------
    // Games List

    this.renderGameList = function() {
        var listDiv = $(".divGameOnList");
        $("<button/>").click(function() { LobbyController.evtJoinGame(); }).attr("id", "JoinGameButton").text("Join Game").css("display", "none").appendTo(listDiv);
        showJoinGameButton();
    }

    this.addGame = function(game) {
        var listDiv = $("#gList");
        if ($("#g_" + game.name + "").length == 0) {
            var gameItem = $('<input type="radio" id="gameListItem" name="gameListItem" value="' + game.name + '">' + game.name + '</input><br>');
            $("<dt/>").attr("id", "g_" + game.name).append(gameItem).appendTo(listDiv);
        }
        if (getGameCount() > 0) showJoinGameButton();
    }

    this.removeGame = function(game) {
        $("#g_" + game.name + "").remove();
        if (getGameCount() == 0) hideJoinGameButton();
    }

    this.getSelectedGame = function() { return ($("input[name='gameListItem']:checked").val()); }
    var getGameCount = function() { return ($("#gList <dt/>").length); }
    var showJoinGameButton = function() { $("#JoinGameButton").show("slow"); }
    var hideJoinGameButton = function() { $("#JoinGameButton").hide("slow"); }


    // --------------------------------
    // Messages Box

    this.addMessage = function(message) {
        var listDiv = $("#msgBoard");
        listDiv.val(listDiv.val() + "<" + message.owner + ">" + (message.msg) + "\n");
    }

    this.clearMsgList = function() { $("#msgBoard").val(""); }


    // --------------------------------
    // Message Input

    this.renderMsgInput = function() {
        var listDiv = $(".divPlayerMessage").attr("id", "playerMsg");
        $("#SendAll").click(function() { LobbyController.evtSendMessage(); });
        $("#SendPrivate").click(function() { LobbyController.evtSendPrivateMessage(); });
    }

    this.clearMsgInput = function() { $("#msgInput").val(""); }
    this.getMsgInput = function() { return $("#msgInput").val(); }


    // --------------------------------
    // Message To Select Box

    this.addPlayerTo = function(player) {
        var selBox = $("#msgDestList");
        if ($("#plTo_" + player.email + "").length == 0) {
            $('<option id="plTo_' + player.email + '">').val(player.email).text(player.email).appendTo(selBox)
        }
    }

    this.removePlayerTo = function(player) {
        $("#plTo_" + player.email + "").remove();
    }

    this.getSelectedPlayerTo = function() { return ($("#msgDestList").val()); }

}