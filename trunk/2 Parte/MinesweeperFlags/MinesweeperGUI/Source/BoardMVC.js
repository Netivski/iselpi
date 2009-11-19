// Board MVC initializer

var Board = new Object();
Board.init = function(lines, cols, mines){
		BoardModel.init(lines, cols, mines);
		BoardController.init();
		BoardView.init();
	}

	
// Board Model --------------------------------------------------------------------------------------

var BoardModel = new Object();
BoardModel.init = function(lines, cols, mines){

		var _minesLeft = mines;
		
		this.getTotalMines = function() { return mines; }
		this.getMinesLeft = function() { return _minesLeft; }
		this.getLines = function() { return lines; }
		this.getCols = function() { return cols; }
		this.decMinesLeft = function() { _minesLeft--; }
}


// Board Controller ---------------------------------------------------------------------------------

var BoardController = new Object();
BoardController.init = function(){

		var setCellValues = function()
			{
				for (var i=0 ; i < BoardModel.getLines() ; i++)
				{
					for (var j=0 ; j < BoardModel.getCols() ; j++)
					{
						var currCell = BoardView.getCellByPos(j,i);
						if (Cell.isMine(currCell))
						{
							var adjCells = BoardController.getAdjacentCells(currCell);
							for (var k=0; k < adjCells.length ; k++)
							{
								if (adjCells[k]!=null && !Cell.isMine(adjCells[k]))
									Cell.incValue(adjCells[k]);
							}
						}
					}
				}
			}
		
		this.decMinesLeft = function() { BoardModel.decMinesLeft(); }
		
		this.genMinesPos = function ()
			{
				var _minesPos = [];
				var cont=0;
				
				while(cont<BoardModel.getTotalMines()){
					var randNum=Math.floor(Math.random()*(BoardController.getLines()*BoardController.getCols()));
					if (_minesPos[randNum]!=true)
					{
						_minesPos[randNum] = true;
						cont++;
					}
				}
				return _minesPos;
			}
			
		this.getCols = function() { return BoardModel.getCols(); }
		
		this.getLines = function() { return BoardModel.getLines(); }
		
		this.revealBoard = function()
			{
				for (var i=0 ; i<this.getLines() ; i++)
				{
					for (var j=0 ; j<this.getCols() ; j++)
					{	
						if(Cell.isMine(BoardView.getCellByPos(j,i)))
							Cell.onClick(BoardView.getCellByPos(j,i),"BOMB");
					}
				}
			}
		
		this.getAdjacentCells = function(cell)
			{
				var pos = Cell.getPos(cell);
				var adjCells = [];
				var cont=0;
				
				for (var i=-1; i<2; i++)
				{
					var colLeft = BoardView.getCellByPos((pos[0]*1-1),(pos[1]*1+i));
					if (colLeft!=null)
						adjCells[cont++] = colLeft;
					var colRight = BoardView.getCellByPos((pos[0]*1+1),(pos[1]*1+i));
					if (colRight!=null)
						adjCells[cont++] = colRight;
					if (i!=0)
					{
						var sameCol = BoardView.getCellByPos((pos[0]*1),(pos[1]*1+i));
						if (sameCol!=null)
							adjCells[cont++] = sameCol;
					}
				}
				return adjCells;
			}
		
		this.start = function()
			{
				var minePos = this.genMinesPos();
				for (var i = 0; i < this.getLines(); i++)
				{
					for (var j = 0; j < this.getCols(); j++)
					{
						var idx = (this.getCols()*i) + j;
						var currCell = BoardView.getCellByPos(j,i);
						Cell.addEventListener(currCell);
						if (minePos[idx])
								Cell.setType(currCell,TYPE_MINE);
					}
				}
				setCellValues();
			}
}


// Board View ---------------------------------------------------------------------------------------

var BoardView = new Object();
BoardView.init = function(){

	if (this.render == undefined){

		this.getCellByPos = function (posX, posY)
			{
				if (posX >= BoardController.getCols() || posY >= BoardController.getLines() || posX < 0 || posY < 0)
					return null;
				return document.getElementById("" + posX + "," + posY + "");
			}
		
		this.render = function(parentElem)
			{
				var cellWidth = $("." + HIDDEN_CELL).css("width");
				//var width = (CELL_SIZE*BoardController.getCols()) + (BoardController.getCols()*(BORDER_SIZE*2)); //Last expression due to border size
				var width = (cellWidth*BoardController.getCols());// + (BoardController.getCols()*(BORDER_SIZE*2)); //Last expression due to border size

				//parentElem.setAttribute("style","width:" + width + "px");
				
				for (var i = 0; i < BoardController.getLines(); i++)
				{
					for (var j = 0; j < BoardController.getCols(); j++)
					{
						var idx = (BoardController.getCols() * i) + j;
						var newCell = Cell.create(undefined,j,i);
						parentElem.appendChild(newCell);					
					}
				}
			}
	}
}