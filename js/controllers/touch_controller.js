function TouchController(view_div)
{
    this.view_div = view_div;
    this.start_position = null;
    this.min_radius = view_div.width / 5;
    var self = this;
    this.setEventHandlers = function () {


        self.view_div.onmousedown = function(event)
        {
            self.start_position = getMousePosition(event);
        };

        self.view_div.onmouseout = function()
        {
            self.start_position = null;
        }

        self.view_div.onmouseup = function(event)
        {
            if(self.start_position === null) {
                return;
            }

            var end_position = getMousePosition(event);

            var dx = end_position.x - self.start_position.x;

            var dy = end_position.y - self.start_position.y;

            if(dx * dx + dy * dy < self.min_radius * self.min_radius) {
                return;
            }
            var angle = Math.atan2(dx, dy);
            var direction = 2 - Math.floor(angle / Math.PI * 3);
            self.start_position = null;
            self.game.onMove(direction);
        };
    };
    this.setEventHandlers();

}

TouchController.prototype.register = function(game)
{
    this.game = game;
}

