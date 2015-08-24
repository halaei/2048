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

Cell.prototype.locateNeighbor = function(neighbor)
{
    if(this.row == neighbor.row) {
        if(this.rank < neighbor.rank) {
            if(this.rank % 2) {
                return 2;
            }
            return 1;
        }
        if(this.rank % 2) {
            return 4;
        }
        return 5;
    }
    if(this.row < neighbor.row) {
        return 3;
    }
    return 0;
};

Cell.prototype.locationId = function()
{
	return this.row * this.row + this.rank;
};

Cell.prototype.isPointingDown = function()
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