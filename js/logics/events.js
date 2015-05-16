function RollEvent(src_cell, dst_cell)
{
    this.src_cell = src_cell;
    this.dst_cell = dst_cell;
    this.value = dst_cell.tile.value;
}

function RollAndMergeEvent(src_cell, dst_cell)
{
    this.src_cell = src_cell;
    this.dst_cell = dst_cell;
    this.value = dst_cell.tile.value;
}

function RandomInsertionEvent(dst_cell)
{
    this.dst_cell = dst_cell;
    this.value = dst_cell.tile.value;
}

function GameOverEvent()
{

}

function ControlEvent(directions)
{
    this.directions = directions;
    this.child_events = [];
}

function registerEvents()
{
    var events = [
        'RollEvent',
        'RollAndMergeEvent',
        'RandomInsertionEvent',
        'ControlEvent',
        'GameOverEvent'
    ];

    for(var i = 0; i < events.length; i++)
    {
        function registerEvent(event_name)
        {
            window[event_name].prototype.handle = function(receiver)
            {
                if(typeof receiver["handle" + event_name] === "function")
                {
                    receiver["handle" + event_name](this);
                }
            };
        }
        registerEvent(events[i]);
    }
}

registerEvents();
