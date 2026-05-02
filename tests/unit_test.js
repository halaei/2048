
function UnitTest()
{
}

UnitTest.prototype.mocks = [];

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnitTest;
}

UnitTest.prototype.close = function()
{
    while(this.mocks.length > 0)
    {
        var m = this.mocks.pop();
        m.close();
    }
};

UnitTest.prototype.setUp = function()
{

};

UnitTest.prototype.tearDown = function()
{
    this.close();
};

UnitTest.prototype.assertTrue = function(value, message, data)
{
    if(! value)
    {
        if(data !== undefined)
        {
            console.log(data);
        }
        throw new Error(message);
    }
};

UnitTest.prototype.assertAlmostEqual = function(expected, actual, message, data)
{
    var abs = Math.abs(expected - actual);
    var r = Math.abs(expected) / 1000;
    if(abs > r && (Math.abs(expected) < 0.000001 && Math.abs(actual) > 0.000001))
    {
        if(data !== undefined)
        {
            console.log(data);
        }
        throw new Error(message);
    }
};



UnitTest.prototype.run = function()
{
    console.log("\n🧪 " + this.testDescription);
    var empty = true;
    var passedCount = 0;
    var failedCount = 0;
    
    for(var test in this)
    {
        if(typeof(this[test]) === "function" && test.search("test") == 0)
        {
            empty = false;
            try
            {
                this.setUp();
                this[test]();
                this.tearDown();
                this.pass(test);
                passedCount++;
            }
            catch(exception)
            {
                this.fail(test, exception);
                failedCount++;
            }
        }
    }
    
    if(empty)
    {
        console.log("  ⚠️  no test function found");
    }
    else
    {
        console.log(`  📊 Results: ${passedCount} passed, ${failedCount} failed`);
    }
};

UnitTest.prototype.pass = function(test)
{
    console.log("  ✅ " + test + "() passed");
};

UnitTest.prototype.fail = function(test, exception)
{
    console.log("  ❌ " + test + "() failed: " + exception.message);
    console.log("     📋 Error details:", exception.stack || exception);
};
