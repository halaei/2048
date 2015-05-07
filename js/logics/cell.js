/**
 * Cell Class
**/
function Cell(row, rank)
{
	this.row = row;
	this.rank = rank;
	this.empty();
	this.locked = false;
}

Cell.prototype.locationId = function()
{
	return this.row * this.row + this.rank;
};

Cell.prototype.direction = function()
{
	return this.rank % 2;
};

Cell.prototype.setTile = function(tile)
{
	this.tile = tile;
    tile.cell = this;
};

Cell.prototype.empty = function()
{
    this.tile = null;
};