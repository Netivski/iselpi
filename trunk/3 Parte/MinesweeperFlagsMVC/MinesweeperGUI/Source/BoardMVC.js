// Board MVC initializer

var Board = new Object();
Board.init = function(lines, cols) {
    BoardModel.init(lines, cols);
    BoardController.init();
    BoardView.init();
}


// Board Model --------------------------------------------------------------------------------------

var BoardModel = new Object();
BoardModel.init = function(lines, cols) {

    this.getLines = function() { return lines; }
    this.getCols = function() { return cols; }
}


// Board Controller ---------------------------------------------------------------------------------

var BoardController = new Object();
BoardController.init = function() {


    this.getLines = function() { return BoardModel.getLines(); }
    this.getCols = function() { return BoardModel.getCols(); }

    this.start = function() {
        for (var i = 0; i < this.getLines(); i++) {
            for (var j = 0; j < this.getCols(); j++) {
                var currCell = BoardView.getCellByPos(j, i);
                Cell.addEventListener(currCell);
            }
        }
    }
}


// Board View ---------------------------------------------------------------------------------------

var BoardView = new Object();
BoardView.init = function() {

    if (this.render == undefined) {

        this.render = function() {
            var cellWidth = $("." + HIDDEN_CELL).css("width");
            var width = (cellWidth * BoardController.getCols());

            for (var i = 0; i < BoardController.getLines(); i++) {
                for (var j = 0; j < BoardController.getCols(); j++) {
                    var newCell = Cell.create(undefined, j, i);
                    newCell.appendTo($("." + BOARD_CLASS));
                }
            }
        }

        this.getCellByPos = function(posX, posY) {
            if (posX >= BoardController.getCols() || posY >= BoardController.getLines() || posX < 0 || posY < 0)
                return null;
            return document.getElementById("" + posX + "," + posY + "");
        }
    }
}