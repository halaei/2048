/**
 * Tile Class
**/
function Tile(value)
{
	this.value = value;
	this.cell = null;
}

Tile.prototype.roll= function(dst)
{
    this.cell.empty();
    dst.setTile(this);
};

Tile.prototype.merge = function(dst)
{
	this.value += dst.tile.value;
    this.roll(dst);
};
