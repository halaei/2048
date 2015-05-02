function assertTrue(value, message, log)
{
    if(! value)
    {
        if(log !== undefined)
        {
            console.log(log);
        }
        throw new Error(message);
    }
}


function TestGrid()
{
    this.grid = new Grid(4);
}

TestGrid.prototype.testIterate0 = function()
{
    var cells = this.grid.iterateInDirection(0);
    assertTrue(16 == cells.length, "iteration size does not equal 9 in testIterate0", cells);
    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
    for(var i = 0; i < 16; i ++)
    {
        assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate0 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate1 = function()
{
    var cells = this.grid.iterateInDirection(1);
    assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate1", cells);
    var expected = [0, 2, 3, 7, 8, 14, 15, 1, 5, 6, 12, 13, 4, 10, 11, 9];
    for(var i = 0; i < 16; i++)
    {
        assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate1 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate2 = function()
{
    var cells = this.grid.iterateInDirection(2);
    assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate2", cells);
    var expected = [15, 8, 14, 13, 3, 7, 6, 12, 11, 0, 2, 1, 5, 4, 10, 9];
    for(var i = 0; i < 16; i++)
    {
        assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate2 is currect", {"index":i, 'expected': expected[i], 'actual': cells[i].locationId()});
    }
}

TestGrid.prototype.testIterate3 = function()
{
    var cells = this.grid.iterateInDirection(3);
    assertTrue(16 == cells.length, "iteration size does not equal 9 in testIterate3", cells);
    var expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].reverse();
    for(var i = 0; i < 16; i ++)
    {
        assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate3 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate4 = function()
{
    var cells = this.grid.iterateInDirection(4);

    assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate4", cells);
    var expected = [0, 2, 3, 7, 8, 14, 15, 1, 5, 6, 12, 13, 4, 10, 11, 9].reverse();
    for(var i = 0; i < 16; i++)
    {
        assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate4 is currect", [i, expected[i],cells[i].locationId()]);
    }
}

TestGrid.prototype.testIterate5 = function()
{
    var cells = this.grid.iterateInDirection(5);
    assertTrue(16 == cells.length, "iteration size does not equal 16 in testIterate5", cells);
    var expected = [15, 8, 14, 13, 3, 7, 6, 12, 11, 0, 2, 1, 5, 4, 10, 9].reverse();
    for(var i = 0; i < 16; i++)
    {
        assertTrue(cells[i].locationId() == expected[i], "Fail asserting iterate5 is currect", {"index":i, 'expected': expected[i], 'actual': cells[i].locationId()});
    }
}


TestGrid.prototype.run = function()
{
    document.write("<ol>");
    for(var test in this)
    {
        if(typeof(this[test]) === "function" && test.search("test") == 0)
        {
            this[test]();
            document.write("<li>" + test + "() passed</li>");
        }
    }
    document.write("</ol>")
}

var test_grid = new TestGrid();
test_grid.run();