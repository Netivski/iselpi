var Cell = new Object();

Cell.init = function()
	{
		// Internal members ---------------------------------------------------

		var setValue = function(cell, val) { cell.setAttribute("value",val); }
		var setClass = function(cell, cellClass) { cell.setAttribute("class",cellClass); }
		var setId = function(cell, id) { cell.setAttribute("id",id); }

		var showLabel = function(cell) {
				var label = document.createElement("cellLabel");
				label.appendChild(document.createTextNode(Cell.getValue(cell)));
				cell.appendChild(label);
			}
		
		// Public members ---------------------------------------------------
		
		this.setType = function(cell, type) 
			{
				cell.setAttribute("type",type);
				if (type==TYPE_MINE) cell.removeAttribute("value");
			}
			
		this.addEventListener = function (cell)
			{
				jQuery(cell).one("click",function() { GameController.evtCellClicked(cell); });
			}
		
		this.create = function(isMine, x, y)
			{
				var cellDiv = document.createElement("div");
				if (isMine)
					this.setType(cellDiv,TYPE_MINE);
				else
				{
					this.setType(cellDiv,TYPE_NUMBER);
					setValue(cellDiv,"0");
				}
				setClass(cellDiv, HIDDEN_CELL);
				setId(cellDiv, "" + x + "," + y + "");
				return cellDiv;
			}
		
		this.incValue = function(cell) { setValue(cell,(this.getValue(cell)*1)+1); }
		this.decValue = function(cell) { setValue(cell,(this.getValue(cell)*1)-1);	}

		this.getPos = function(cell) { return cell.getAttribute("id").split(","); }
		this.getValue = function(cell) { if (!this.isMine(cell)) return cell.getAttribute("value"); }
		
		this.isMine = function(cell) { return cell.getAttribute("type")==TYPE_MINE; }
		this.isHidden = function(cell) { return cell.getAttribute("class")==HIDDEN_CELL; }
		this.isEmpty = function(cell) { return (!this.isMine(cell) && this.getValue(cell)=="0"); }
		
		this.chainReaction = function(cell)
			{
				var adjCells = BoardController.getAdjacentCells(cell);
				
				if (!this.isMine(cell))		//Guarantees that each recursevely iterated cell sets it's own class correctly.
					this.onClick(cell); 	//In the root cell a dummy onClick call occurs since it's definitely not a mine!
					
				for (var i=0; i<adjCells.length ; i++){
						if (this.isHidden(adjCells[i])) 		//If the adjacent cell hasn't been clicked yet...
						{
							if (this.isEmpty(adjCells[i])) 		//...and if it's empty then can be root of a chain reaction
								this.chainReaction(adjCells[i]);
							else if (!this.isMine(adjCells[i])) //...and if it's a number then it must set it's own class and label
								this.onClick(adjCells[i]);
						}
				}
			}
		
		this.onClick = function(cell, pNum)
			{
				if (this.isHidden(cell))
				{
					if (this.isMine(cell))
					{
						setClass(cell,MINE_CELL + pNum);

						/*
						   Use this to decrement the adjacent cells of a mine when it get's clicked. Fun to watch!
						   Brings the situation that an adjacent cell of a mine is considered to be empty.
						   
						var adjCells = GameBoard.getAdjacentCells(ownRef);
						for (var i=0; i<adjCells.length ; i++)
							adjCells[i].decValue();
						
						*/
					}
					else
					{
						if (this.getValue(cell)!="0")
						{
							setClass(cell,NUMBER_CELL);
							showLabel(cell);
						}
						else
						{
							setClass(cell, EMPTY_CELL);
							this.chainReaction(cell);
						}
					}
				}
			}
	}
