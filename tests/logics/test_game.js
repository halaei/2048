function TestGame()
{
    this.grid = new Grid(4);
    this.log = new EventLog(new LocalStorageManager());
    this.controllers = [];
    this.view = CanvasView();
    this.game = new Game(this.grid, this.log, this.controllers, thid.view);
    this.testDescription = "Testing Game";
}

TestGame.prototype.

var test_game = new TestGame();
test_game.run();