
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
	for(var i = 0; i < this.controllers.length; i++)
	{
		this.controllers[i].register(this);
	}
};

Game.prototype.randomInsertTile = function()
{
		var location = this.getRandomAvailableCell();
		var cell = this.cells[location[0]][location[1]];
		cell.setTile(new Tile(2));
};

Game.prototype.initTiles = function()
{
	this.tiles = [];
	for(var i = 0; i < this.initNumberOfTiles; i++)
	{
		this.randomInsertTile();
	}
};

Game.prototype.play = function()
{
	this.onMove = function(directions)
	{
		this.grid.changeLuckOfAllCells(false);
		function step(game, direction)
		{
			var cells = game.grid.iterateInDirection(direction);
			var events = [];
			for(var i = 0; i < cells.length; i++)
			{
				if(! cells[i].locked && ! cells[i].tile != null)
				{
					var neighbor = cells[i].neighbor(direction);
					if(neighbor != null)
					{
						if(neighbor.tile == null)
						{
							//move tile to empty neighbor
							cells[i].tile.roll(neighbor);
                            events.push(new RollEvent(cells[i], neighbor));
						}
						else if(neighbor.tile.value == cells[i].tile.value)
						{
							//merge tile with neighbor
							cells[i].tile.merge(neighbor);
                            events.push(new RollAndMergeEvent(cells[i], neighbor));
						}
					}
				}
			}
			return events;
		}
		while(step(this, directions[0]) + step(this, directions[1]));
	};
	this.opUndo = function()
	{
		
	};
	
	this.onPlayback = function()
	{
		//do nothing
	};

};

Game.prototype.gameOver = function()
{
	this.onMove = function(directions)
	{
		//do nothing
	};
	this.opUndo = function()
	{
		//do nothing
	};
	this.onPlayback = function()
	{

	};
};
