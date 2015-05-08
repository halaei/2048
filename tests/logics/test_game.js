function TestGame()
{
    this.testDescription = "Testing Game";
}

TestGame.prototype = new UnitTest();

TestGame.prototype.setUp = function()
{
    UnitTest.prototype.setUp.call(this);

    this.grid = new Grid(4);
    this.log = new Mock();
    this.controllers = [];
    for(var i = 0; i < 2; i++)
    {
        var ctrl = new Mock();
        ctrl.shouldReceive('register');
        this.controllers.push(ctrl);
    }
    this.view = new Mock();
    this.game = new Game(this.grid, this.log, this.controllers, this.view);
    this.testDescription = "Testing Game";
};

var test_game = new TestGame();
test_game.run();