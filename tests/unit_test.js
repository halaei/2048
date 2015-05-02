
function UnitTest()
{
}

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
}

UnitTest.prototype.run = function()
{
    document.write("<h1>" + this.testDescription + "</h1>")
    document.write("<ol>");
    for(var test in this)
    {
        if(typeof(this[test]) === "function" && test.search("test") == 0)
        {
            try
            {
                this[test]();
                this.pass(test);
            }
            catch(exeption)
            {
                this.fail(test, exeption.message);
            }
        }
    }
    document.write("</ol>")
}

UnitTest.prototype.pass = function(test)
{
    document.write('<li style="color: green">' + test +"() passed </li>");
}

UnitTest.prototype.fail = function(test, message)
{
    document.write('<li style="color: red">' + test + "() failed: " + message + "</li>");
}
