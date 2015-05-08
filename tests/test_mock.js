function TestMock()
{
    this.testDescription = "Testing Mock Itself";
}

TestMock.prototype = new UnitTest();

TestMock.prototype.setUp = function()
{
    this.log = new Mock();
};

TestMock.prototype.testWith = function()
{
    this.log.shouldReceive('foo').with('bar', 'baz').andReturn('qux');
    this.log.foo('bar', 'baz');
};

TestMock.prototype.testArgumentsSatisfying = function()
{
    this.log.shouldReceive('foo').withArgumentsSatisfying(function(x, y)
    {
        return x == 1 && y.length == 2;
    }).andReturn('bar');
    this.assertTrue('bar' == this.log.foo(1, [2, [3]]));
};

var test_mock = new TestMock();
test_mock.run();