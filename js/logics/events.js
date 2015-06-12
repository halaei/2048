///////////////////////////////////////////////////////
//                     Helpers                       //
///////////////////////////////////////////////////////

function initEventObject(obj)
{
    obj.children = [];
    obj.score = 0;
}

function addChild(event)
{
    this.children.push(event);
    if(event.score) {
        this.score += event.score;
    }
}

function getFirstChild()
{
    return this.children[0];
}

function setFirstChild(event)
{
    this.children[0] = event;
}

function initControlEventPrototype(constructor)
{
    constructor.prototype.setStatusUpdateEvent = setFirstChild;
    constructor.prototype.getStatusUpdateEvent = getFirstChild;
}

///////////////////////////////////////////////////////
//                  Basic Events                     //
///////////////////////////////////////////////////////

function RollEvent(src_cell, dst_cell)
{
    initEventObject(this);
    this.src_cell = src_cell;
    this.dst_cell = dst_cell;
    this.move_direction = this.src_cell.locateNeighbor(dst_cell);
    this.value = dst_cell.tile.value;
}

function RollAndMergeEvent(src_cell, dst_cell)
{
    initEventObject(this);
    this.src_cell = src_cell;
    this.dst_cell = dst_cell;
    this.move_direction = this.src_cell.locateNeighbor(dst_cell);
    this.value = dst_cell.tile.value;
    this.score = this.value;
}

function RandomInsertionEvent(dst_cell)
{
    initEventObject(this);
    this.dst_cell = dst_cell;
    this.value = dst_cell.tile.value;
    this.score = this.value;
}

///////////////////////////////////////////////////////
//                   View Events                     //
///////////////////////////////////////////////////////

function StepEvent()
{
    initEventObject(this);
}

StepEvent.prototype.addChild = addChild;

function StatusUpdateEvent(score, values)
{
    initEventObject(this);
    this.score = score;
    this.values = values;
}

///////////////////////////////////////////////////////
//                 Control Events                    //
///////////////////////////////////////////////////////

function MoveEvent(directions)
{
    initEventObject(this);
    this.directions = directions;
    this.game_over = false;
    this.children[0] = null;
}

initControlEventPrototype(MoveEvent);

MoveEvent.prototype.hasStep = function()
{
    return this.children.length > 1;
};

MoveEvent.prototype.addStep = addChild;

MoveEvent.prototype.getSteps = function()
{
    return this.children.slice(1);
};

function ResetEvent(status_update_event)
{
    initEventObject(this);
    this.children[0] = status_update_event;
}

initControlEventPrototype(ResetEvent);

function UndoRequestEvent()
{
    initEventObject(this);
}

initControlEventPrototype(UndoRequestEvent);

function UndoEvent()
{
    initEventObject(this);
}

initControlEventPrototype(UndoEvent);

///////////////////////////////////////////////////////
//                Preview Events                     //
//Events that does not affect the state of the game, //
//but handlers of which can give the user visual     //
// hints of the result of the move he/she is about to//
// do.                                               //
///////////////////////////////////////////////////////

function BeginMoveHintEvent(direction)
{
    initEventObject(this);
    this.direction = direction;
}

function EndMoveHintEvent()
{
    initEventObject(this);
}

///////////////////////////////////////////////////////
//                Initialization                     //
///////////////////////////////////////////////////////

function initEventPrototypes()
{
    var events = [
        //Basic Events
        'RollEvent',
        'RollAndMergeEvent',
        'RandomInsertionEvent',
        //View Events
        'StepEvent',
        'StatusUpdateEvent',
        //Control Events
        'MoveEvent',
        'ResetEvent',
        'UndoRequestEvent',
        'UndoEvent',
        //Preview Events
        'BeginMoveHintEvent',
        'EndMoveHintEvent'
    ];

    function initEventPrototype(event_name)
    {
        window[event_name].prototype.name = event_name;
    }

    for(var i = 0; i < events.length; i++)
    {
        initEventPrototype(events[i]);
    }
}

initEventPrototypes();
