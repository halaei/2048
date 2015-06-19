function GridLocation(row, rank)
{
    this.row = row;
    this.rank = rank;
}

function CTile(value, angle, move_direction, text_size_factor)
{
    this.value = value;
    this.angle = angle;
    this.move_direction = move_direction;
    this.text_size_factor = text_size_factor;
}

function InsertAnimationComponent(dst, value)
{
    this.dst = dst;
    this.value = value;
}

InsertAnimationComponent.prototype.getInitTile = function()
{
    return new CTile(this.value, 0, null, 0);
};

InsertAnimationComponent.prototype.getFinalTile = function()
{
    return new CTile(this.value, 0, null, 1);
};

function RollAnimationComponenet(src, dst, move_direction, old_value, new_value)
{
    this.src = src;
    this.dst = dst;
    this.move_direction = move_direction;
    this.old_value = old_value;
    this.new_value = new_value;
}

RollAnimationComponenet.prototype.getFinalTile = function()
{
    return new CTile(this.new_value, 0, null, 1);
}

function HintAnimationComponent(src, dst, move_direction, old_value)
{
    this.src = src;
    this.dst = dst;
    this.move_direction = move_direction;
    this.old_value = old_value;
}

function Animation(duration, start_time, clear)
{
    this.duration = duration;
    this.start_time = start_time;
    this.inserts = [];
    this.rolls = [];
    this.hints = [];
    this.clear = clear;
    this.fresh = true;

    this.merge_hint = false;

    this.clear_hints = false;
}

function newClearHintAnimation(start_time)
{
    var a = new Animation(0, start_time, false);
    a.clear_hints = true;
    return a;
}

Animation.prototype.begin = function(grid)
{
    if(! this.fresh) {
        return;
    }
    this.fresh = false;
    if(this.clear) {
        for(var i = 0; i < grid.length; i++) {
            for(var j = 0; j < grid[i].length; j++) {
                grid[i][j] = new CTile(0, 0, null, 1);
            }
        }
    }
    for(var i = 0; i < this.inserts.length; i++) {
        var e = this.inserts[i];
        grid[e.dst.row][e.dst.rank] = e.getInitTile();
    }
};

Animation.prototype.commit = function(grid)
{
    for(var i = 0; i < this.rolls.length; i++) {
        var e = this.rolls[i];
        grid[e.src.row][e.src.rank] = new CTile(0, 0, null, 1);
        grid[e.dst.row][e.dst.rank] = e.getFinalTile();
    }

    for(i = 0; i < this.inserts.length; i++) {
        var e = this.inserts[i];
        grid[e.dst.row][e.dst.rank] = e.getFinalTile();
    }

    if(this.clear_hints) {
        for(i = 0; i < grid.length; i++) {
            for(var j = 0; j < grid[i].length; j++) {
                grid[i][j].angle = 0;
                grid[i][j].direction = null;
                grid[i][j].text_size_factor = 1;
            }
        }
    }
};

Animation.prototype.finished = function(time)
{
    return this.duration + this.start_time < time;
};

Animation.prototype.getFrame = function(grid, time)
{
    var t = Math.min(this.duration, time - this.start_time);

    //update new grid applying animation components
    var angle = Math.PI * t / this.duration;
    if(this.merge_hint) {
        angle = angle * 3 / 4 + Math.PI / 4;
    }
    var roll_factor = Math.cos(angle) * Math.cos(angle);
    var insert_factor = Math.sin(angle / 2);

    var hint_angle  = Math.PI * t / this.duration / 4;
    var hint_factor = Math.cos(hint_angle) * Math.cos(hint_angle);

    for(var i = 0; i < this.inserts.length; i++) {
        var r = this.inserts[i];
        grid[r.dst.row][r.dst.rank].text_size_factor = insert_factor;
    }

    for(var i = 0; i < this.rolls.length; i++) {
        var r = this.rolls[i];
        grid[r.src.row][r.src.rank] = new CTile(angle > Math.PI / 2 ? r.new_value : r.old_value, angle, r.move_direction, roll_factor);
    }

    for(var i = 0; i < this.hints.length; i++) {
        var r = this.hints[i];
        grid[r.src.row][r.src.rank] = new CTile(r.old_value, hint_angle, r.move_direction, hint_factor);
    }

};