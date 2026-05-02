const UnitTest = require('../unit_test.js');
const Mock = require('../mock.js');

function TestGame()
{
    this.testDescription = "Testing Game";
}

TestGame.prototype = new UnitTest();

TestGame.prototype.testGameInitialization = function()
{
    UnitTest.prototype.setUp.call(this);

    this.grid = new Grid(4);
    this.log = new Mock();
    this.log.shouldReceive('getCurrentStatus').andReturn(null);
    this.log.shouldReceive('register');
    
    this.controllers = [];
    for(var i = 0; i < 2; i++)
    {
        var ctrl = new Mock();
        ctrl.shouldReceive('register');
        this.controllers.push(ctrl);
    }
    
    this.view = new Mock();
    this.view.shouldReceive('register');
    
    this.scoreboard = new Mock();
    this.scoreboard.shouldReceive('register');
    
    this.configuration = new Mock();
    this.configuration.initNumberOfTiles = 2;
    // The configuration will be called twice for initNumberOfTiles = 2
    this.configuration.shouldReceive('getNewTileValue').andReturn(2);
    this.configuration.shouldReceive('getNewTileValue').andReturn(2);
    
    this.game = new Game(this.grid, this.log, this.controllers, this.view, this.scoreboard, this.configuration);
};

module.exports = TestGame;