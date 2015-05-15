/**
 * EventLog Class
 *
**/
function EventLog(storage)
{
	this.storage = storage;
	this.log = [];
}

EventLog.prototype.registerEvent = function(event)
{
	this.log.push(event);
};

EventLog.prototype.registerEvents = function(events)
{
    for(var i = 0; i < events.length; i++)
    {
        this.registerEvent(events[i]);
    }
};

EventLog.prototype.undo = function()
{
    var events = [];
    while(this.log.length > 0)
    {
        var event = this.log.unshift();
        events.push(event);
        if(ControlEvent.isPrototypeOf(event))
        {
            break;
        }
    }
	return events;
};
