function TestEvents()
{
    this.testDescription = "Testing Events";
}

TestEvents.prototype = new UnitTest;

TestEvents.prototype.testRollAndMergeScore = function()
{
    var src = new Cell(0, 0);
    var dst = new Cell(1, 1);
    dst.setTile(new Tile(4));
    var event = new RollAndMergeEvent(src, dst);

    this.assertTrue(event.score() == 4, 'scoring is wrong', [src, dst]);
};


TestEvents.prototype.testRandomInsertionScore = function()
{
    var cell = new Cell(0, 0);
    cell.setTile(new Tile(2));
    var event = new RandomInsertionEvent(cell);

    this.assertTrue(event.score() == 2, 'scoring is wrong', [cell]);
};


var test_events = new TestEvents();
test_events.run();