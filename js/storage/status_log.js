function StatusLog(storage)
{
	this.storage = storage;
	this.log = [];
    this.undoing = false;
}

StatusLog.prototype.registerStatus = function(score, values)
{
	this.log.push([score, values]);
    this.storage.setGameState([score, values]);
};

StatusLog.prototype.handleUndoRequestEvent = function()
{
    if(this.log.length > 1)
    {
        this.undoing = true;
        this.log.pop();
        var cur = this.log[this.log.length - 1];
        this.storage.setGameState(cur);
        this.game.undo(cur);
    }
};

StatusLog.prototype.handleStatusUpdateEvent = function(event)
{
    if(this.undoing) {
        this.undoing = false;
    } else {
        this.registerStatus(event.score, event.values);
    }
};

StatusLog.prototype.register = function(game)
{
    this.game = game;
    game.on('StatusUpdateEvent', this, this.handleStatusUpdateEvent);
    game.on('UndoRequestEvent', this, this.handleUndoRequestEvent);
};