
/**
 * Game Class
**/
function Game(grid, eventLog, controllers, view)
{
	this.grid = grid;
	this.eventLog = eventLog;
	this.controllers = controllers;
	this.registerControllers();
	this.view = view;
	this.initNumberOfTiles = 2;
	this.initTiles();
	this.play();
}

Game.prototype.registerControllers = function()
{
	for(var i = 0; i < this.controllers.size; i++)
	{
		this.controllers[i].register(this);
	}
}

Game.prototype.randomInsertTile()
{
		var location = this.getRandomAvailableCell();
		var cell = this.cells[location[0]][location[1]];
		cell.setTile(new Tile(2, cell.direction()));
}
Game.prototype.initTiles = function()
{
	this.tiles = new Array();
	for(var i = 0; i < this.initNumberOfTiles; i++)
	{
		this.randomInsertTile();
	}
}

Game.prototype.play = function()
{
	this.onMove = function(directions)
	{
		function step(game, directions)
		{
			return false;
		}
		while(step(this, directions));
	}
	this.opUndo = function()
	{
		
	}
	
	this.onPlayback = function()
	{
		//do nothing
	}

}

Game.prototype.gameOver = function()
{
	this.onMove = function(directions)
	{
		//do nothing
	}
	this.opUndo = function()
	{
		//do nothing
	}
	this.onPlayback = function()
	{

	}
}
