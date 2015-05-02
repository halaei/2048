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
