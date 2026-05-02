const UnitTest = require('../unit_test.js');

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
    this.assertTrue(obj.name == callback.call(obj), 'callback call is worng');
};

module.exports = TestCallbacks;