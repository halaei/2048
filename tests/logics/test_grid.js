function TestGrid()
{
    this.testDescription = "Testing grid of size 4";
    this.grid = new Grid(4);
}

TestGrid.prototype = new UnitTest;

TestGrid.prototype.testIterateInAllDirections = TestGrid3.prototype.testIterateInAllDirections;

TestGrid.prototype.testNeighbors = function()
{
    var neighbors = [
        [null, null, 2, 2, null, null], //0
        [2, 2, 5, 5, null, null], //1
        [0, 3, 3, 1, 1, 0], //2
        [null, null, 7, 7, 2, 2], //3
        [5, 5, 10, 10, null, null], //4
        [1, 6, 6, 4, 4, 1], //5
        [7, 7, 12, 12, 5, 5], //6
        [3, 8, 8, 6, 6, 3], //7
        [null, null, 14, 14, 7, 7], //8
        [10, 10, null, null, null, null], //9
        [4, 11, 11, 9, 9, 4], //10
        [12, 12, null, null, 10, 10], //11
        [6, 13, 13, 11, 11, 6], //12
        [14, 14, null, null, 12, 12], //13
        [8, 15, 15, 13, 13, 8], //14
        [null, null, null, null, 14, 14] //15
    ];
    var l = 0;
    for(var i = 0; i < 4; i++)
    {
        for(var j = 0; j < 2 * i + 1; j++)
        {
            for(var dir = 0; dir < 6; dir++)
            {
                if(neighbors[l][dir] === null) {
                    this.assertTrue(this.grid.neighbor(this.grid.cells[i][j], dir) === null, 'neighbor is not null', [i, j, dir, this.grid.neighbor(this.grid.cells[i][j], dir)]);
                } else {
                    this.assertTrue(null !== this.grid.neighbor(this.grid.cells[i][j], dir), 'null neighbor', [i, j, dir, this.grid.neighbor(this.grid.cells[i][j], dir)]);
                    this.assertTrue(neighbors[l][dir] == this.grid.neighbor(this.grid.cells[i][j], dir).locationId(), 'wrong neighbor', [i, j, dir, this.grid.neighbor(this.grid.cells[i][j], dir).locationId()]);
                }
            }
            l++;
        }
    }
}

var test_grid = new TestGrid();
test_grid.run();