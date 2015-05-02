/**
 * Cell Class
**/
function Cell(row, rank, tile)
{
	this.row = row;
	this.rank = rank;
	this.setTile(tile);
}
Cell.prototype.direction = function(){
	return this.rank % 2 == 0 ? 1 : 0;
};

Cell.prototype.setTile = function(tile) {
	this.tile = tile;
};
