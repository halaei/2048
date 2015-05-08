function Mock()
{
    this.expectations = [];
    UnitTest.prototype.mocks.push(this);
}

Mock.prototype.shouldReceive = function(method)
{
    function arraysEqual(a, b) {
        if (a === b) return true;
        if (a == null || b == null) return false;
        if (a.length != b.length) return false;

        // If you don't care about the order of the elements inside
        // the array, you should sort both arrays here.

        for (var i = 0; i < a.length; ++i) {
            if (a[i] !== b[i]) return false;
        }
        return true;
    };

    this[method] = function()
    {
        var expectation = this.expectations.pop();
        if(expectation.method != method)
        {
            throw new Error("mock object was expected method " + expectation.method + ", but method " + method + " is called");
        }
        if(expectation.arguments !== null)
        {
            if(typeof(expectation.arguments) === "function")
            {
                if(! expectation.arguments.apply(null, arguments))
                {
                    console.log([expectation.method, expectation.arguments, arguments]);
                    throw Error("Wrong arguments");
                }

            }
            else
            {
                if(! arraysEqual(expectation.arguments, arguments))
                {
                    console.log([expectation.method, expectation.arguments, arguments]);
                    throw new Error("Wrong arguments");
                }
            }
        }
        return expectation.return_value;
    };

    var expectation = new Expectation(method);
    this.expectations.push(expectation);
    return expectation;
};

Mock.prototype.close = function()
{
    if(this.expectations.length != 0)
    {
        var e = this.expectations.pop();
        throw new Error(e.method + " is not called yet!");
    }
};