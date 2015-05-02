/**
 * Grid Class
**/
function Grid(size)
{
	this.size = size;
	this.cells = new Array();
	for(var i = 0; i < size; i++)
	{
		this.cells[i] = new Array()
		for(var j = 0; j < 2 * i + 1; j++)
		{
			this.cells[i][j] = new Cell(i, j, null);
		}
	}
}

Grid.prototype.getRandomAvailableCell = function()
{
	var emptyCells = [];
	for(var row = 0; row < this.size; row++)
	{
		for(var rank = 0; rank < 2 * row + 1; rank++)
		{
			if(this.cells[row][rank] === null)
			{
				emptyCells.push([row, rank]);
			}
		}
	}
	if(emptyCells.size == 0)
	{
		return null;
	}
	return emptyCells[random(0, emptyCells.size - 1)];
}

Grid.prototype.iterateInDirection = function(direction)
{
	function iterate0(grid)
	{
		var cells = [];
		for(var i = 0; i < grid.size; i++)
		{
			for(var j = 0; j < 2 * i + 1; j++)
			{
				cells.push(grid.cells[i][j]);
			}
		}
		return cells;
	}
	function iterate1(grid)
	{
		var cells = [];
		for(var i = 0; i < grid.size; i++)
		{
			for(var j = 0; j < 2 * (grid.size - i) - 1; j++)
			{
				var row = Math.floor((j + 1) / 2) + i;
				var rowSize = row * 2 + 1;
				var rank = rowSize - (2 * i) - (j % 2) - 1;
				cells.push(grid.cells[row][rank]);
			}
		}
		return cells;
	}

	function iterate2(grid)
	{
		var cells = [];
		for(var i = grid.size - 1; i >= 0; i--)
		{
			for(var j = (grid.size - i - 1) * 2; j >= 0; j--)
			{
				var jp = (grid.size - i - 1) * 2 - j + 1;
				var row = i + Math.floor(jp / 2);
				var rank = 2 * i + (j % 2);
				cells.push(grid.cells[row][rank]);
			}
		}
		return cells;
	}

	function iterate3(grid)
	{
		return iterate0(grid).reverse();
	}

	function iterate4(grid)
	{
		return iterate1(grid).reverse();
	}

	function iterate5(grid)
	{
		return iterate2(grid).reverse();
	}

	var iterators = [iterate0, iterate1, iterate2, iterate3, iterate4, iterate5];
	return iterators[direction](this);
}
