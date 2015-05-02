/**
 * EventLog Class
 *
**/
function EventLog(storage)
{
	this.storage = storage;
	this.log = [];
}

EventLog.prototype.registerEvent =function(event)
{
	this.log.push(event);
}

EventLog.prototype.undo = function()
{
	return this.log.unshift();
}
