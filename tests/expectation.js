function Expectation(method)
{
    this.method = method;
    this.arguments = null;
    this.return_value = null;
}

// Export for CommonJS (Node.js)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Expectation;
}

Expectation.prototype.with = function()
{
    this.arguments = arguments;
    return this;
};

Expectation.prototype.withArgumentsSatisfying = function(check)
{
    this.arguments = check;
    return this;
};

Expectation.prototype.andReturn = function(value)
{
    this.return_value = value;
    return this;
};