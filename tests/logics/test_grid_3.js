function TestGrid3()
{
    this.testDescription = "Testing grid of size 3";
    this.grid = new Grid(3);
}
TestGrid3.prototype = new UnitTest;
TestGrid3.prototype.testIterateInAllDirections = function()
{
    for(var direction = 0; direction < 6; direction++)
    {
        this.grid.changeLuckOfAllCells(false);
        var cells = this.grid.iterateInDirection(direction);
        for(var i = 0; i < this.grid.size * this.grid.size; i++)
        {
            this.assertTrue(cells[i].locked === false, 'wrong order of iteration', [direction, cells, i]);
            cells[i].locked = true;
        }
    }
}

var test_grid = new TestGrid3();
test_grid.run();