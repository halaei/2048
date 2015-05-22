function KeyboardController(game_div)
{
    this.game_div = game_div;
    var self = this;
    this.setEventHandlers = function () {
        var map = {
            'E': 0,
            'F': 1,
            'D': 2,
            'S': 3,
            'A': 4,
            'W': 5
        };

        self.game_div.onkeydown = function(event)
        {
        };

        self.game_div.onkeyup = function(event)
        {
            var ch = String.fromCharCode(event.keyCode);
            if(map[ch] !== undefined)
                self.game.onMove(map[ch]);
            else if(ch == 'R')
            {
                self.game.reset();
            }
        };
    };
    this.setEventHandlers();

}

KeyboardController.prototype.register = function(game)
{
    this.game = game;
}

