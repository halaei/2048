function StatusLog(storage)
{
	this.storage = storage;
    var persisted = this.storage.getGameState();
	this.log = persisted !== null ? [persisted] : [];
    this.setting_status = false;
}

StatusLog.prototype.registerStatus = function(score, values)
{
	this.log.push([score, values]);
    this.storage.setGameState([score, values]);
};

StatusLog.prototype.getCurrentStatus = function()
{
    return this.log.length > 0 ? this.log.pop() : null;
};

StatusLog.prototype.handleUndoRequestEvent = function()
{
    if(this.log.length > 1)
    {
        this.setting_status = true;
        this.log.pop();
        var cur = this.log[this.log.length - 1];
        this.storage.setGameState(cur);
        this.game.setStatus(cur);
    }
};

StatusLog.prototype.handleStatusUpdateEvent = function(event)
{
    if(this.setting_status) {
        this.setting_status = false;
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