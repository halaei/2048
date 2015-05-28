function TestCallbacks()
{
    this.testDescription = "Testing Callbacks";
}

TestCallbacks.prototype = new UnitTest;



TestCallbacks.prototype.testCall = function()
{
    var obj = {
        'name': 'j',
        'f': function(){
            return this.name;
        }
    };
    var callback = obj.f;
    console.log(obj.f);
    this.assertTrue(obj.name == callback.call(obj), 'callback call is worng');
};

var test_callback = new TestCallbacks();
test_callback.run();