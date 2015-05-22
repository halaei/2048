function Reset(reset_btn)
{
    this.btn = reset_btn;
    var self = this;
    this.btn.onclick = function()
    {
        self.game.reset();
    }
}

Reset.prototype.register =function(game)
{
    this.game = game;
};