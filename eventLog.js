/**
 * EventLog Class
 *
**/
function EventLog(storage)
{
	this.storage = storage;
	this.log = [];
}

EventLog.prototype.registerEvent(event)
{
	this.log.push(event);
}

EventLog.prototype.undo()
{
	return this.log.unshift();
}
