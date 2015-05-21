/**
 * Grid Class
**/
function Grid(size)
{
	this.size = size;
	this.cells = [];
	for(var i = 0; i < size; i++)
	{
		this.cells[i] = [];
		for(var j = 0; j < 2 * i + 1; j++)
		{
			this.cells[i][j] = new Cell(i, j);
		}
	}
}

Grid.prototype.numverOfCells = function()
{
    return this.size * this.size;
};

Grid.prototype.getEmptyCells = function()
{
    var emptyCells = [];
    for (var row = 0; row < this.size; row++)
    {
        for (var rank = 0; rank < 2 * row + 1; rank++)
        {
            if (this.cells[row][rank].tile === null)
            {
                emptyCells.push([row, rank]);
            }
        }
    }
    return emptyCells;
};

Grid.prototype.getRandomAvailableCell = function()
{
    var emptyCells = this.getEmptyCells();
    if(emptyCells.length == 0)
	{
		return null;
	}
	return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

Grid.prototype.iterateInDirection = function(direction)
{
    var cells = [];
    var top_first = [1, 0, 0, 0, 1, 1][direction];
    var left_first = [0, 0, 0, 1, 1, 1][direction];
    for(var i = top_first ? 0 : this.size - 1; i >= 0 && i < this.size; top_first ? i++ : i--)
    {
        for(var j = left_first ? 0 : 2 * i; j>= 0 && j <= 2 * i; left_first ? j++ : j--)
        {
            cells.push(this.cells[i][j]);
        }
    }
    return cells;
};

Grid.prototype.changeLuckOfAllCells = function(locked)
{
	locked = locked ? true : false;
	for(var i = 0; i < this.size; i++)
	{
		for(var j = 0; j < 2 * i + 1; j++)
		{
			this.cells[i][j].locked = locked;
		}
	}
};

Grid.prototype.neighbor = function(cell, direction)
{
    if(cell.isPointingDown()) {
        switch(direction)
        {
            case 0: return this.cells[cell.row - 1][cell.rank - 1];
            case 1: return this.cells[cell.row][cell.rank + 1];

            case 2: return this.cells[cell.row][cell.rank + 1];
            case 3: return this.cells[cell.row][cell.rank - 1];

            case 4: return this.cells[cell.row][cell.rank - 1];
            case 5: return this.cells[cell.row - 1][cell.rank - 1];
        }
    } else {
        switch(direction)
        {
            case 0: return (cell.rank < 2 * cell.row) ? this.cells[cell.row][cell.rank + 1] : null;
            case 1: return (cell.rank < 2 * cell.row) ? this.cells[cell.row][cell.rank + 1] : null;

            case 2: return (cell.row < this.size - 1) ? this.cells[cell.row + 1][cell.rank + 1] : null;
            case 3: return (cell.row < this.size - 1) ? this.cells[cell.row + 1][cell.rank + 1] : null;

            case 4: return (cell.rank > 0) ? this.cells[cell.row][cell.rank - 1] : null;
            case 5: return (cell.rank > 0) ? this.cells[cell.row][cell.rank - 1] : null;
        }

    }
};

Grid.prototype.step = function(direction)
{
    var cells = this.iterateInDirection(direction);
    var events = [];
    for(var i = 0; i < cells.length; i++)
    {
        if(! cells[i].locked && cells[i].tile != null)
        {
            var neighbor = this.neighbor(cells[i], direction);
            if(neighbor != null)
            {
                if(neighbor.tile == null)
                {
                    //move tile to empty neighbor
                    cells[i].tile.roll(neighbor);
                    events.push(new RollEvent(cells[i], neighbor));
                }
                else if(! neighbor.locked && neighbor.tile.value == cells[i].tile.value)
                {
                    //merge tile with neighbor
                    cells[i].tile.merge(neighbor);
                    events.push(new RollAndMergeEvent(cells[i], neighbor));
                }
            }
        }
    }
    return events;
}

Grid.prototype.gameIsOver = function()
{
    var non_empties = this.getEmptyCells();
    if(non_empties.length < this.numverOfCells())
    {
        return false;
    }
    for(var i = 0; i < non_empties.length; i++)
    {
        for(var j = 0 ; j < 6; j++)
        {
            var neighbor = this.neighbor(non_empties[i], [j]);
            if(neighbor !== null && non_empties[i].value == neighbor.value)
            {
                return false;
            }
        }
    }
    return true;
}


