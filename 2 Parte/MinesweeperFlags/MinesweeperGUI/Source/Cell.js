var Cell = new Object();

Cell.init = function() {

    // Internal members ---------------------------------------------------

    var setValue = function(cell, val) { $(cell).attr("value", "" + val + ""); }
    var setClass = function(cell, cellClass) { $(cell).attr("class", cellClass); }
    var setId = function(cell, id) { $(cell).attr("id", id); }

    var showLabel = function(cell) {
        $(cell).append(Cell.getValue(cell));
    }

    // Public members ---------------------------------------------------

    this.setType = function(cell, type) {
        $(cell).attr("type", type);
        if (type == TYPE_MINE) $(cell).removeAttr("value");
    }

    this.update = function(cell, type, owner, value) {
        this.setType(cell, type);
        if (type == TYPE_MINE) {
            setClass(cell, MINE_CELL + ("" + owner + ""));
        }
        else {
            if (value > 0) {
                setValue(cell, value);
                setClass(cell, NUMBER_CELL);
                showLabel(cell);
            }
            else {
                setClass(cell, EMPTY_CELL);
            }
        }
    }

    this.addEventListener = function(cell) {
        jQuery(cell).click(function() { GameController.evtCellClicked(cell); });
    }

    this.create = function(isMine, x, y) {
        var cell = $("<div></div>");
        setClass(cell, HIDDEN_CELL);
        setId(cell, ("" + x + "," + y + ""));
        return cell;
    }

    this.getPos = function(cell) { return $(cell).attr("id").split(","); }
    this.getValue = function(cell) { return $(cell).attr("value"); }

    this.isMine = function(cell) { return $(cell).attr("type") == TYPE_MINE; }
    this.isHidden = function(cell) { return $(cell).attr("class") == HIDDEN_CELL; }
    this.isEmpty = function(cell) { return (!this.isMine(cell) && this.getValue(cell) == "0"); }
}
