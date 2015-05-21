
function UnitTest()
{
}

UnitTest.prototype.mocks = [];

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

UnitTest.prototype.run = function()
{
    document.write("<h1>" + this.testDescription + "</h1>")
    document.write("<ul>");
    var empty = true;
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
            }
            catch(exception)
            {
                this.fail(test, exception);
            }
        }
    }
    if(empty)
    {
        document.write('<li style="color: orangered">' + "no test function found" + "</li>");
    }
    document.write("</ul>")
};

UnitTest.prototype.pass = function(test)
{
    document.write('<li style="color: green">' + test +"() passed </li>");
};

UnitTest.prototype.fail = function(test, exception)
{
    document.write('<li style="color: red">' + test + "() failed: " + exception.message + "</li>");
    console.log(exception);
};
