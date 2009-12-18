// Board MVC Object

function boardMVC(lines, cols, cell) {

    var current = this; 


    // Board Model --------------------------------------------------------------------------------------

    this.boardModel = function() {

        if (this.boardModel.getLines == undefined) {
            this.boardModel.getLines = function() { return lines; }
            this.boardModel.getCols = function() { return cols; }
            this.boardModel.alert = function(str) { alert( str ); }
        }
    }


    // Board Controller ---------------------------------------------------------------------------------
    this.boardController = function() {

        if (this.boardController.getLines == undefined) {
            this.boardController.getLines = function() { return current.boardModel.getLines(); }
            this.boardController.getCols  = function() { return current.boardModel.getCols(); }

            this.boardController.start = function() {
                for (var i = 0; i < this.getLines(); i++) {
                    for (var j = 0; j < this.getCols(); j++) {
                        var currCell = current.boardView.getCellByPos(j, i);
                        cell.addEventListener(currCell);
                    }
                }
            }
        }
    }
    
    // Board View ---------------------------------------------------------------------------------------
    this.boardView = function() {
        if (this.boardView.render == undefined) {
            this.boardView.render = function() {
                var cellWidth = $("." + HIDDEN_CELL).css("width");
                var width     = (cellWidth * current.boardController.getCols());

                for (var i = 0; i < current.boardController.getLines(); i++) {
                    for (var j = 0; j < current.boardController.getCols(); j++) {
                        cell.create(undefined, j, i).appendTo($("." + BOARD_CLASS));
                    }
                }
            }

            this.boardView.getCellByPos = function(posX, posY) {
            if (posX >= current.boardController.getCols() || posY >= current.boardController.getLines() || posX < 0 || posY < 0)
                    return null;
                return document.getElementById("" + posX + "," + posY + "");
            }
        }
    }
    
    //init fields
    this.boardModel();
    this.boardController();
    this.boardView();                    
}

//var Board = new Object();
//Board.init = function(lines, cols) {
//    BoardModel.init(lines, cols);
//    BoardController.init();
//    BoardView.init();
//}


//var BoardModel = new Object();
//BoardModel.init = function(lines, cols) {

//    this.getLines = function() { return lines; }
//    this.getCols = function() { return cols; }
//}


// Board Controller ---------------------------------------------------------------------------------

//var BoardController = new Object();
//BoardController.init = function() {


//    this.getLines = function() { return BoardModel.getLines(); }
//    this.getCols = function() { return BoardModel.getCols(); }

//    this.start = function() {
//        for (var i = 0; i < this.getLines(); i++) {
//            for (var j = 0; j < this.getCols(); j++) {
//                var currCell = BoardView.getCellByPos(j, i);
//                Cell.addEventListener(currCell);
//            }
//        }
//    }
//}


//var BoardView = new Object();
//BoardView.init = function() {

//    if (this.render == undefined) {

//        this.render = function() {
//            var cellWidth = $("." + HIDDEN_CELL).css("width");
//            var width = (cellWidth * BoardController.getCols());

//            for (var i = 0; i < BoardController.getLines(); i++) {
//                for (var j = 0; j < BoardController.getCols(); j++) {
//                    var newCell = Cell.create(undefined, j, i);
//                    newCell.appendTo($("." + BOARD_CLASS));
//                }
//            }
//        }

//        this.getCellByPos = function(posX, posY) {
//            if (posX >= BoardController.getCols() || posY >= BoardController.getLines() || posX < 0 || posY < 0)
//                return null;
//            return document.getElementById("" + posX + "," + posY + "");
//        }
//    }
//}