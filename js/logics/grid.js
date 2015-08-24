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
    var step_event = new StepEvent();
    var previews = this.getMovePreview(direction);
    for(var i = 0; i < previews.length; i++)
    {
        step_event.addChild(previews[i].apply());
    }
    return step_event;
};

function RollPreview(cell, neighbor)
{
    this.cell = cell;
    this.neighbor = neighbor;
    this.move_direction = cell.locateNeighbor(neighbor);
}

RollPreview.prototype.apply = function()
{
    this.cell.tile.roll(this.neighbor);
    return new RollEvent(this.cell, this.neighbor);
};

function MergePreview(cell, neighbor)
{
    this.cell = cell;
    this.neighbor = neighbor;
    this.move_direction = cell.locateNeighbor(neighbor);
}

MergePreview.prototype.apply = function()
{
    this.cell.tile.merge(this.neighbor);
    return new RollAndMergeEvent(this.cell, this.neighbor);
};

Grid.prototype.getMovePreview = function(direction)
{
    var previews = [];
    var locked_neighbors = [];
    var emptied_cells = [];
    var cells = this.iterateInDirection(direction);
    for(var i = 0; i < cells.length; i++)
    {
        if(! cells[i].locked && cells[i].tile != null)
        {
            var neighbor = this.neighbor(cells[i], direction);
            if(neighbor != null)
            {
                if(neighbor.tile == null)
                {
                    emptied_cells.push({cell: cells[i], tile: cells[i].tile});
                    cells[i].tile = null;
                    previews.push(new RollPreview(cells[i], neighbor));
                }
                else if(! neighbor.locked && neighbor.tile.value == cells[i].tile.value)
                {
                    emptied_cells.push({cell: cells[i], tile: cells[i].tile});
                    cells[i].tile = null;
                    locked_neighbors.push(neighbor);
                    neighbor.locked = true;
                    previews.push(new MergePreview(cells[i], neighbor));
                }
            }
        }
    }
    for(i = 0; i < locked_neighbors.length; i++)
    {
        locked_neighbors[i].locked = false;
    }
    for(i = 0; i < emptied_cells.length; i++)
    {
        emptied_cells[i].cell.tile = emptied_cells[i].tile;
    }
    return previews;
};

Grid.prototype.gameIsOver = function()
{
    for(var i = 0; i < this.size; i++)
    {
        for(var j = 0; j < 2 * i + 1; j++)
        {
            if(this.cells[i][j].tile === null)
                return false;
            for(var d = 0; d < 6; d++)
            {
                var neighbor = this.neighbor(this.cells[i][j], d);
                if(neighbor !== null && (neighbor.tile === null || this.cells[i][j].tile.value == neighbor.tile.value))
                    return false;
            }
        }
    }
    return true;
};


