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

RandomInsertionEvent.prototype.score = RollAndMergeEvent.prototype.score;

function ControlEvent(direction)
{
    this.direction = direction;
    this.child_events = [];
}

ControlEvent.prototype.addChildEvent = function(event)
{
    this.child_events.push(event);
}