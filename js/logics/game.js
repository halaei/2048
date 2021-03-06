function Game(grid, eventLog, controllers, view, scoreboard, configuration)
{
	this.grid = grid;
	this.controllers = controllers;
	this.registerControllers();

	this.view = view;
	this.eventLog = eventLog;
    this.scoreboard = scoreboard;
    this.configuration = configuration;

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

    var status = eventLog.getCurrentStatus();
    if(status !== null) {
        this.setStatus(status);
    } else {
        this.initTiles();
    }

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
    if(location === null) {
        return null;
    }
    var cell = this.grid.cells[location[0]][location[1]];
    cell.setTile(new Tile(this.configuration.getNewTileValue()));
    return new RandomInsertionEvent(cell);
};

Game.prototype.initTiles = function()
{
    this.score = 0;
	for(var i = 0; i < this.configuration.initNumberOfTiles; i++)
	{
        this.score += this.randomInsertTile().score;
	}

    var update = new StatusUpdateEvent(this.score, this.getCellValues());
    var init = new ResetEvent(update);

    this.dispatchEvents([init]);
};

Game.prototype.setStatus = function(status)
{
    this.score = status[0];
    this.setCellValues(status[1]);
    var event = new StatusUpdateEvent(this.score, this.getCellValues());
    var reset = new ResetEvent(event);
    this.dispatchEvents([reset]);
};



Game.prototype.play = function()
{
	this.onMove = function(direction)
	{
		this.grid.changeLuckOfAllCells(false);
        var ctrl_event = new MoveEvent(direction);
        while(true) {
            var step = this.grid.step(direction);
            if(step.children.length == 0) {
                break;
            }
            this.score += step.score;
            ctrl_event.addStep(step);
        }

        if(! ctrl_event.hasStep())
        {
            //nothing moved!
            return;
        }

        var rand_step = new StepEvent();
        for(var i = 0; i < this.configuration.numberOfRandomTiles(); i++) {
            var e = this.randomInsertTile(this.configuration.getNewTileValue());
            if(e !== null) {
                rand_step.addChild(e);
            }
        }
        this.score += rand_step.score;

        ctrl_event.addStep(rand_step);

        ctrl_event.setStatusUpdateEvent(new StatusUpdateEvent(this.score, this.getCellValues()));

        this.grid.changeLuckOfAllCells(false);

        if(this.grid.gameIsOver())
        {
            ctrl_event.game_over = true;
            this.gameOver();
        }

        this.dispatchEvents([ctrl_event]);
	};

	this.onUndo = function()
	{
        this.dispatchEvents([new UndoRequestEvent()]);
	};

	this.onPlayback = function()
	{

	};
    this.onBeginMoveHint = function(direction)
    {
        this.dispatchEvents([new BeginMoveHintEvent(direction, this.grid.getMovePreview(direction))]);
    };
    this.opEndMoveHint = function()
    {
        this.dispatchEvents([new EndMoveHintEvent()]);
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
        //do nothing
	};
    this.onBeginMoveHint = function()
    {
        //do nothing
    };
    this.opEndMoveHint = function()
    {
        //do nothing
    };
};

Game.prototype.reset = function()
{
    this.grid = new Grid(this.grid.size);
    this.initTiles();
    this.play();
};

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

Game.prototype.getCellValues = function()
{
    var values = [];
    var cells = this.grid.iterateInDirection(5);
    for(var i = 0; i < cells.length; i++)
    {
        if(cells[i].tile === null) {
            values.push(0);
        } else {
            values.push(cells[i].tile.value);
        }
    }
    return values;
};

Game.prototype.setCellValues = function(values)
{
    var cells = this.grid.iterateInDirection(5);
    for(var i = 0; i < cells.length; i++) {
        if(values[i]) {
            cells[i].setTile(new Tile(values[i]));
        } else {
            cells[i].empty();
        }
    }
};
