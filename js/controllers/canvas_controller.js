function CanvasController(canvas)
{
    //set canvase and context
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    //set state
    this.pressed_button = null;

    //set circle
    this.center = {x:this.canvas.width / 2, y:this.canvas.height / 2};
    this.radius = this.center.x - 2;

    this.drawController();
    var self = this;
    this.setEventHandlers = function () {
        this.canvas.onmousedown = function(e)
        {
            var position = getMousePosition(e);
            self.pressed_button = self.locatePoint(position);
            self.drawController();
        };
        this.canvas.onmouseout = function(e)
        {
            if(self.pressed_button !== null)
            {
                self.pressed_button = null;
                self.drawController();
            }
        }
        this.canvas.onmouseup = function(e)
        {
            var position = getMousePosition(e);
            var unpressed_button = self.locatePoint(position);
            if(unpressed_button !== null && unpressed_button === self.pressed_button)
            {
                //fire a game move event
                var direction = self.pressed_button;
                self.game.onMove([direction, (direction + 1) % 6]);
            }
            if(self.pressed_button !== null)
            {
                self.pressed_button = null;
                self.drawController();
            }
        }
    };
    this.setEventHandlers();

}

CanvasController.prototype.locatePoint = function(point)
{
    var delta = {dx: point.x - this.center.x, dy: point.y - this.center.y};
    var distance = delta.dx * delta.dx + delta.dy * delta. dy;
    if(distance >= this.radius * this.radius)
    {
        return null;
    }
    var angle = Math.atan2(delta.dx, delta.dy);
    return 2 - Math.floor(angle / Math.PI * 3);
}

CanvasController.prototype.drawController = function()
{
    for(var i = 0; i < 6; i++)
    {
        var j = i < 3 ? i + 3 : i - 3;
        this.context.beginPath();
        this.context.moveTo(this.center.x, this.center.y);
        this.context.arc(this.center.x, this.center.y, this.radius,
            (i / 3 + 1 / 2) * Math.PI , ((i + 1) / 3 + 1 / 2) * Math.PI);
        this.context.moveTo(this.center.x, this.center.y);
        this.context.closePath();
        this.context.fillStyle = rgb(j === this.pressed_button ? 0xff : 0, i % 2 ? 0xff : 0x33, j === this.pressed_button ? 0xff : 0);
        this.context.fill();
        this.context.stroke();
    }
}

CanvasController.prototype.register = function(game)
{
    this.game = game;
}

