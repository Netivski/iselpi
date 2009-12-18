function player() {
    this.update = function(pNum, pName, pScore, myId) {
        if ($("#Player" + pNum).length == 0)
            renderNew(pNum, pName, myId);
        setScore(pNum, pScore);
    }

    var renderNew = function(pNum, pName, myId) {
        var playerDiv = $("<div/>").addClass(PL_BOARD_CLASS).attr("id", "Player" + pNum);
        var playerImage = $("<img/>").attr("src", PL_PIC_SRC + pNum + ".png").attr("alt", "Player " + pNum);
        var picDiv = $("<div/>").addClass(PL_PIC_CLASS);
        playerImage.appendTo(picDiv);

        var playerFlag = $("<img/>").attr("src", PL_FLAG_SRC + pNum + ".png").attr("alt", "Player " + pNum);
        var flagDiv = $("<div/>").addClass(PL_FLAG_CLASS);
        playerFlag.appendTo(flagDiv);

        var scoreDiv = $("<div/>").addClass(PL_SCORE_CLASS).text("0");
        var nameDiv = $("<div/>").addClass(PL_NAME_CLASS).text(pName);

        var quitButton = $("<button/>").addClass(BTN_QUIT_CLASS).text("Quit");
        var quitDiv = $("<div/>").addClass(PL_QUIT_CLASS);
        if (pNum == myId) {
            quitButton.appendTo(quitDiv);
            quitButton.click(function() { GameController.evtRemovePlayer(); });
        }

        ((playerDiv.append(picDiv)).append(flagDiv).append(scoreDiv));
        (playerDiv.append(nameDiv)).append(quitDiv);

        playerDiv.appendTo($("." + PL_CLASS));
    }

    this.incScore = function(pNum) { setScore(pNum, this.getScore(pNum) * 1 + 1); }

    this.getScore = function(pNum) { return $("." + PL_SCORE_CLASS + ":eq(" + (pNum * 1 - 1) + ")").text(); }

    var setScore = function(pNum, val) { $("." + PL_SCORE_CLASS + ":eq(" + (pNum * 1 - 1) + ")").text(val); }

    this.getName = function(pNum) { return $("." + PL_NAME_CLASS + ":eq(" + (pNum * 1 - 1) + ")").text(); }

    this.activatePlayer = function(idPlayer) {
        idPlayer = parseInt(idPlayer);
        for (var i = 0; i < $("." + PL_BOARD_CLASS).length; i++) {
            $("." + PL_PIC_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
            $("." + PL_FLAG_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
            $("." + PL_NAME_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
            $("." + PL_SCORE_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
        }
    }

    this.removePlayer = function(pNum) {
        $("#Player" + pNum).css("display", "none");
    }
}

//var Player = new Object();

//Player.init = function() {

//    this.update = function(pNum, pName, pScore, myId) {
//        if ($("#Player" + pNum).length == 0)
//            renderNew(pNum, pName, myId);
//        setScore(pNum, pScore);
//    }

//    var renderNew = function(pNum, pName, myId) {
//        var playerDiv = $("<div/>").addClass(PL_BOARD_CLASS).attr("id", "Player" + pNum);
//        var playerImage = $("<img/>").attr("src", PL_PIC_SRC + pNum + ".png").attr("alt", "Player " + pNum);
//        var picDiv = $("<div/>").addClass(PL_PIC_CLASS);
//        playerImage.appendTo(picDiv);

//        var playerFlag = $("<img/>").attr("src", PL_FLAG_SRC + pNum + ".png").attr("alt", "Player " + pNum);
//        var flagDiv = $("<div/>").addClass(PL_FLAG_CLASS);
//        playerFlag.appendTo(flagDiv);

//        var scoreDiv = $("<div/>").addClass(PL_SCORE_CLASS).text("0");
//        var nameDiv = $("<div/>").addClass(PL_NAME_CLASS).text(pName);

//        var quitButton = $("<button/>").addClass(BTN_QUIT_CLASS).text("Quit");
//        var quitDiv = $("<div/>").addClass(PL_QUIT_CLASS);
//        if (pNum == myId) {
//            quitButton.appendTo(quitDiv);
//            quitButton.click(function() { GameController.evtRemovePlayer(); });
//        }

//        ((playerDiv.append(picDiv)).append(flagDiv).append(scoreDiv));
//        (playerDiv.append(nameDiv)).append(quitDiv);

//        playerDiv.appendTo($("." + PL_CLASS));
//    }

//    this.incScore = function(pNum) { setScore(pNum, this.getScore(pNum) * 1 + 1); }

//    this.getScore = function(pNum) { return $("." + PL_SCORE_CLASS + ":eq(" + (pNum * 1 - 1) + ")").text(); }

//    var setScore = function(pNum, val) { $("." + PL_SCORE_CLASS + ":eq(" + (pNum * 1 - 1) + ")").text(val); }

//    this.getName = function(pNum) { return $("." + PL_NAME_CLASS + ":eq(" + (pNum * 1 - 1) + ")").text(); }

//    this.activatePlayer = function(idPlayer) {
//        idPlayer = parseInt(idPlayer);
//        for (var i = 0; i < $("." + PL_BOARD_CLASS).length; i++) {
//            $("." + PL_PIC_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
//            $("." + PL_FLAG_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
//            $("." + PL_NAME_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
//            $("." + PL_SCORE_CLASS + ":eq(" + i + ")").toggleClass(PL_INACTIVE, i != idPlayer).toggleClass(PL_ACTIVE, i == idPlayer);
//        }
//    }

//    this.removePlayer = function(pNum) {
//        $("#Player" + pNum).css("display", "none");
//    }
//}