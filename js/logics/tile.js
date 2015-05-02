/**
 * Tile Class
**/
function Tile(value, direction)
{
	this.value = value;
	this.direction = direction;
}

Tile.prototype.roll = function()
{
	this.direction = 1 - this.direction;
}

Tile.prototype.merge = function()
{
	this.value *= 2;
}
