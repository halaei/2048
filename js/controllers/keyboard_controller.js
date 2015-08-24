function KeyboardController(game_div)
{
    this.game_div = game_div;
    this.current_preview = null;
    var self = this;
    this.setEventHandlers = function () {
        var direction_map = {
            'E': 0,
            'F': 1,
            'D': 2,
            'S': 3,
            'A': 4,
            'W': 5
        };

        self.game_div.onkeydown = function(event)
        {
            var ch = String.fromCharCode(event.keyCode);
            if(direction_map[ch] !== undefined && direction_map[ch] != self.current_preview) {
                self.current_preview = direction_map[ch];
                self.game.onBeginMoveHint(direction_map[ch]);
            }
        };

        self.game_div.onkeyup = function(event)
        {
            var ch = String.fromCharCode(event.keyCode);
            if(direction_map[ch] !== undefined && direction_map[ch] === self.current_preview) {
                self.game.onMove(direction_map[ch]);
                self.current_preview = null;
            }
            else if(ch == 'N')
            {
                self.game.reset();
            } else if(ch == 'U')
            {
                self.game.onUndo();
            }
        };
    };
    this.setEventHandlers();

}

KeyboardController.prototype.register = function(game)
{
    this.game = game;
}

