function RollEvent(src_cell, dst_cell)
{
    this.src_cell = src_cell;
    this.dst_cell = dst_cell;
}

function RollAndMergeEvent(src_cell, dst_cell)
{
    RollEvent.call(this, src_cell, dst_cell);
}

RollAndMergeEvent.prototype = RollEvent.prototype;

RollAndMergeEvent.prototype.score = function()
{
    return this.dst_cell.tile.value;
};

function RandomInsertionEvent(dst_cell)
{
    this.dst_cell = dst_cell;
}

function GameOverEvent()
{

}

RandomInsertionEvent.prototype.score = RollAndMergeEvent.prototype.score;

function ControlEvent(directions)
{
    this.directions = directions;
    this.child_events = [];
}

ControlEvent.prototype.setChildEvents = function(events)
{
    this.child_events = events;
}