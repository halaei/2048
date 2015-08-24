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

    this.assertTrue(event.value == 4, 'scoring is wrong', [src, dst]);
    this.assertTrue(event.score == 4, 'scoring is wrong', [src, dst]);
};


TestEvents.prototype.testRandomInsertionScore = function()
{
    var cell = new Cell(0, 0);
    cell.setTile(new Tile(2));
    var event = new RandomInsertionEvent(cell);

    this.assertTrue(event.value == 2, 'scoring is wrong', [cell]);
    this.assertTrue(event.score == 2, 'scoring is wrong', [cell]);
};

TestEvents.prototype.testRollScore = function()
{
    var src = new Cell(0, 0);
    var dst = new Cell(1, 1);
    dst.setTile(new Tile(4));

    var event = new RollEvent(src, dst);
    this.assertTrue(event.score == 0, 'soring is wrong', [src, dst]);
}

TestEvents.prototype.testStepScore = function()
{
    var event = new StepEvent();
    for(var i = 0; i < 5; i++)
    {
        var src = new Cell(0, 0);
        var dst = new Cell(1, 1);
        dst.setTile(new Tile(4));
        event.addChild(new RollAndMergeEvent(src, dst));
    }
    this.assertTrue(event.score == 20, 'soring is wrong', [event, event.score]);
}

var test_events = new TestEvents();
test_events.run();