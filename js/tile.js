/**
 * Tile Class
**/
function Tile(value, direction)
{
	this.value = value;
	this.direction = direction;
}

Tile.prototype.roll()
{
	this.direction = 1 - direction;
}

Tile.prototype.merge()
{
	this.value *= 2;
}
