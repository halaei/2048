function initEventObject(obj)
{
    obj.children = [];
    obj.score = 0;
}

function RollEvent(src_cell, dst_cell)
{
    initEventObject(this);
    this.src_cell = src_cell;
    this.dst_cell = dst_cell;
    this.value = dst_cell.tile.value;
}

function RollAndMergeEvent(src_cell, dst_cell)
{
    initEventObject(this);
    this.src_cell = src_cell;
    this.dst_cell = dst_cell;
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

/**
 *
 * @constructor
 * StepEvent is a collection of RollEvents, RollAndMergeEvents, and RandomInsertionEvent
 */
function StepEvent()
{
    initEventObject(this);
}

/**
 *
 * @param directions
 * @constructor
 * ControlEvent is a collection of StepEvents, GameOverEvents, and UpdateScoreEvents
 */
function ControlEvent(directions)
{
    initEventObject(this);
    this.directions = directions;
}

function addChild(event)
{
    this.children.push(event);
    if(event.score) {
        this.score += event.score;
    }
}

StepEvent.prototype.addChild = addChild;
ControlEvent.prototype.addChild = addChild;

function GameOverEvent()
{
    initEventObject(this);
}

function ResetEvent()
{
    initEventObject(this);
}

function UndoEvent()
{
    initEventObject(this);
}

function UpdateScoreEvent(old_score, new_score)
{
    initEventObject(this);
    this.old_score = old_score;
    this.new_score = new_score;
}

function initEventPrototypes()
{
    var events = [
        'RollEvent',
        'RollAndMergeEvent',
        'RandomInsertionEvent',
        'StepEvent',
        'ControlEvent',
        'GameOverEvent',
        'ResetEvent',
        'UndoEvent',
        'UpdateScoreEvent'
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
