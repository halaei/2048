function GridLocation(row, rank)
{
    this.row = row;
    this.rank = rank;
}

function InsertAnimationComponent(dst, value)
{
    this.dst = dst;
    this.value = value;
}

function RollAnimationComponenet(src, dst, old_value, new_value)
{
    this.src = src;
    this.dst = dst;
    this.old_value = old_value;
    this.new_value = new_value;
}

function Animation(duration, start_time)
{
    this.duration = duration;
    this.start_time = start_time;
    this.components = [];
    this.post_animation_game_status = null;
}

Animation.prototype.finished = function()
{
    return this.duration + this.start_time > new Date().getTime();
};
