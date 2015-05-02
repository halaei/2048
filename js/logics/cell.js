/**
 * Cell Class
**/
function Cell(row, rank, tile)
{
	this.row = row;
	this.rank = rank;
	this.setTile(tile);
	this.locked = false;
}
Cell.prototype.locationId = function()
{
	return this.row * this.row + this.rank;
}

Cell.prototype.direction = function(){
	return this.rank % 2 == 0 ? 1 : 0;
};

Cell.prototype.setTile = function(tile) {
	this.tile = tile;
};
