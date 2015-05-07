function TestGrid()
{
    this.testDescription = "Testing grid of size 4";
    this.grid = new Grid(4);
}

TestGrid.prototype = new UnitTest;

TestGrid.prototype.testIterate0 = function()
{
    var cells = this.grid.iterateInDirection(0);
    this.assertTrue(16 == cells.length, "iteration size does not equal 9 in testIterate0", cells);
    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    for(var i = 0; i < 16; i ++)
    {
        this.assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate0 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate1 = function()
{
    var cells = this.grid.iterateInDirection(1);
    this.assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate1", cells);
    var expected = [0, 2, 3, 7, 8, 14, 15, 1, 5, 6, 12, 13, 4, 10, 11, 9];
    for(var i = 0; i < 16; i++)
    {
        this.assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate1 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate2 = function()
{
    var cells = this.grid.iterateInDirection(2);
    this.assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate2", cells);
    var expected = [15, 8, 14, 13, 3, 7, 6, 12, 11, 0, 2, 1, 5, 4, 10, 9];
    for(var i = 0; i < 16; i++)
    {
        this.assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate2 is currect", {"index":i, 'expected': expected[i], 'actual': cells[i].locationId()});
    }
}

TestGrid.prototype.testIterate3 = function()
{
    var cells = this.grid.iterateInDirection(3);
    this.assertTrue(16 == cells.length, "iteration size does not equal 9 in testIterate3", cells);
    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].reverse();
    for(var i = 0; i < 16; i ++)
    {
        this.assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate3 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate4 = function()
{
    var cells = this.grid.iterateInDirection(4);

    this.assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate4", cells);
    var expected = [0, 2, 3, 7, 8, 14, 15, 1, 5, 6, 12, 13, 4, 10, 11, 9].reverse();
    for(var i = 0; i < 16; i++)
    {
        this.assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate4 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate5 = function()
{
    var cells = this.grid.iterateInDirection(5);
    this.assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate5", cells);
    var expected = [15, 8, 14, 13, 3, 7, 6, 12, 11, 0, 2, 1, 5, 4, 10, 9].reverse();
    for(var i = 0; i < 16; i++)
    {
        this.assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate5 is currect", {"index":i, 'expected': expected[i], 'actual': cells[i].locationId()});
    }
}

TestGrid.prototype.testNeighbors = function()
{
    var neighbors = [
        [null, null, null, 2, null, null], //0
        [null, 2, null, 5, null, null], //1
        [0, null, 3, null, 1, null], //2
        [null, null, null, 7, null, 2], //3
        [null, 5, null, 10, null, null], //4
        [1, null, 6, null, 4, null], //5
        [null, 7, null, 12, null, 5], //6
        [3, null, 8, null, 6, null], //7
        [null, null, null, 14, null, 7], //8
        [null, 10, null, null, null, null], //9
        [4, null, 11, null, 9, null], //10
        [null, 12, null, null, null, 10], //11
        [6, null, 13, null, 11, null], //12
        [null, 14, null, null, null, 12], //13
        [8, null, 15, null, 13, null], //14
        [null, null, null, null, null, 14] //15
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