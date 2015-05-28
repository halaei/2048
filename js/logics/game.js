function Game(grid, eventLog, controllers, view, scoreboard)
{
    this.score = 0;
	this.grid = grid;
	this.controllers = controllers;
	this.registerControllers();

	this.view = view;
	this.eventLog = eventLog;
    this.scoreboard = scoreboard;

    this.handlers = [];

    //TODO: constructor should get observers in array without knowing the role of each
    //TODO: don't event store observers in game object
    this.observers = [
        this.view,
        this.eventLog,
        this.scoreboard,
    ];

    for(var i = 0; i < this.observers.length; i++) {
        this.observers[i].register(this);
    }

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
    var step = new StepEvent();
	for(var i = 0; i < this.initNumberOfTiles; i++)
	{
        step.addChild(this.randomInsertTile());
	}
    var score = new UpdateScoreEvent(this.score, this.score + step.score);
    this.score += step.score;
    this.dispatchEvents([step, score]);
};

Game.prototype.addScore = function(score)
{
    this.score += score;

}

Game.prototype.play = function()
{
	this.onMove = function(direction)
	{
		this.grid.changeLuckOfAllCells(false);
        var ctrl_event = new ControlEvent(direction);
        while(true) {
            var step = this.grid.step(direction);
            if(step.children.length == 0) {
                break;
            }
            ctrl_event.addChild(step);
        }

        if(ctrl_event.children.length == 0)
        {
            //nothing moved!
            return;
        }

        ctrl_event.addChild(this.randomInsertTile());

        if(ctrl_event.score) {
            ctrl_event.addChild(new UpdateScoreEvent(this.score, this.score + ctrl_event.score));
            this.score += ctrl_event.score;
        }
        if(this.grid.gameIsOver())
        {
            ctrl_event.addChild(new GameOverEvent());
            this.gameOver();
        }

        this.dispatchEvents([ctrl_event]);
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

Game.prototype.reset = function()
{
    this.grid = new Grid(this.grid.size);
    this.dispatchEvents([new ResetEvent()]);
    this.initTiles();
    this.play();
}

Game.prototype.dispatchEvents = function(events)
{
    for(var i = 0; i < events.length; i++)
    {
        this.dispatchEvents(events[i].children);
        if(this.handlers[events[i].name]) {
            for(var j = 0; j < this.handlers[events[i].name].length; j++)
            {
                this.handlers[events[i].name][j][1].call(this.handlers[events[i].name][j][0], events[i]);
            }
        }
    }
};

Game.prototype.on = function(event, handler, callback)
{
    if(! this.handlers[event]) {
        this.handlers[event] = [];
    }
    this.handlers[event].push([handler, callback]);
};
