
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
    var location = this.grid.getRandomAvailableCell();
    var cell = this.grid.cells[location[0]][location[1]];
    cell.setTile(new Tile(2));
    return new RandomInsertionEvent(cell);
};

Game.prototype.initTiles = function()
{
	this.tiles = [];
    var events = [];
	for(var i = 0; i < this.initNumberOfTiles; i++)
	{
		events.push(this.randomInsertTile());
	}
    this.view.dispatchEvents(events);
};

Game.prototype.play = function()
{
	this.onMove = function(directions)
	{
        console.log(directions);
		this.grid.changeLuckOfAllCells(false);
        var ctrl_event = new ControlEvent(directions);
        var events = [ctrl_event];
        var child_events = [];
        var cnt = 0;
        do {
            cnt = child_events.length;
            child_events = child_events.concat(this.grid.step(directions[0]), this.grid.step(directions[1]));
        } while(child_events.length > cnt);

        if(child_events.length == 0)
        {
            //nothing moved!
            return;
        }

        ctrl_event.setChildEvents(child_events);

        events.push(this.randomInsertTile());

        if(this.grid.gameIsOver())
        {
            events.push(new GameOverEvent());
            this.gameOver();
        }

        this.eventLog.registerEvents(events);
        this.view.dispatchEvents(events);
	};

	this.onUndo = function()
	{
		var events = this.eventLog.undo();
        return events;
	};
	
	this.onPlayback = function()
	{

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
