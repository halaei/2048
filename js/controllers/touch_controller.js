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
            event.preventDefault();
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

        self.view_div.onmousemove = function(event)
        {
            //TODO: 
        }
        function touchHandler(event)
        {
            var touches = event.changedTouches,
                first = touches[0],
                type = "";
            switch(event.type)
            {
                case "touchstart": type = "mousedown"; break;
                case "touchmove":  type = "mousemove"; break;
                case "touchend":   type = "mouseup";   break;
                default:           return;
            }

            // initMouseEvent(type, canBubble, cancelable, view, clickCount,
            //                screenX, screenY, clientX, clientY, ctrlKey,
            //                altKey, shiftKey, metaKey, button, relatedTarget);

            var simulatedEvent = document.createEvent("MouseEvent");
            simulatedEvent.initMouseEvent(type, true, true, window, 1,
                first.screenX, first.screenY,
                first.clientX, first.clientY, false,
                false, false, false, 0/*left*/, null);

            first.target.dispatchEvent(simulatedEvent);
            event.preventDefault();
        }

        self.view_div.addEventListener("touchstart", touchHandler, true);
        self.view_div.addEventListener("touchmove", touchHandler, true);
        self.view_div.addEventListener("touchend", touchHandler, true);
        self.view_div.addEventListener("touchcancel", touchHandler, true);
    };
    this.setEventHandlers();

}

TouchController.prototype.register = function(game)
{
    this.game = game;
}

