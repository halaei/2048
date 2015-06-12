function TouchController(view_div)
{
    this.view_div = view_div;
    this.start_position = null;
    this.hinting_direction = null;
    this.min_radius = view_div.width / 5;
    var self = this;
    this.setEventHandlers = function () {

        function endHint()
        {
            if(self.hinting_direction !== null) {
                self.hinting_direction = null;
                self.game.opEndMoveHint();
            }
        }
        self.view_div.onmousedown = function(event)
        {
            endHint();
            self.start_position = getMousePosition(event);
            event.preventDefault();
        };

        self.view_div.onmouseout = function()
        {
            endHint();
            self.start_position = null;
        };

        function getDirection(event)
        {
            if(self.start_position === null) {
                return null;
            }

            var end_position = getMousePosition(event);

            var dx = end_position.x - self.start_position.x;

            var dy = end_position.y - self.start_position.y;

            if(dx * dx + dy * dy < self.min_radius * self.min_radius) {
                return null;
            }
            var angle = Math.atan2(dx, dy);
            return 2 - Math.floor(angle / Math.PI * 3);
        }
        self.view_div.onmouseup = function(event)
        {
            self.hinting_direction = null;
            var direction = getDirection(event);
            if(direction === null) return;
            self.start_position = null;
            self.game.onMove(direction);
        };

        self.view_div.onmousemove = function(event)
        {
            var direction = getDirection(event);
            if(direction === null) {
                endHint();
                return;
            }
            if(direction === self.hinting_direction) return;
            self.hinting_direction = direction;
            self.game.onBeginMoveHint(direction);
        };
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
};

