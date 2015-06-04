function TestHelpers()
{
    this.testDescription = "Testing helpers";
}
TestHelpers.prototype = new UnitTest;

TestHelpers.prototype.testLineIsNormalized = function()
{
    var line = new TD_Line(new TD_Point(1, 2, 3), new TD_Point(1, 2, 3));
    var l = line.direction.x * line.direction.x
        + line.direction.y * line.direction.y
        + line.direction.z * line.direction.z;

    this.assertTrue(l < 1.0001);
    this.assertTrue((l > 0.999));
}

TestHelpers.prototype.testRotate = function()
{
    var p1 = new TD_Point(1, 1, -1);
    var line = new TD_Line(new TD_Point(1, 1, 1), new TD_Point(10, 0, 0));
    var p2 = TD_RotatePointAboutAxis(p1, line, Math.PI / 2);
    this.assertAlmostEqual(1, p2.x, 'x is computed wrong', [p1, p2]);
    this.assertAlmostEqual(3, p2.y, 'y is computed wrong', [p1, p2]);
    this.assertAlmostEqual(1, p2.z, 'z is computed wrong', [p1, p2]);
}

TestHelpers.prototype.testRotate2PI = function()
{
    var p1 = new TD_Point(10, 9, -3);
    var line = new TD_Line(new TD_Point(3, -1, 50), new TD_Point(10, 2, -20));
    var p2 = TD_RotatePointAboutAxis(p1, line, 2 * Math.PI);
    this.assertAlmostEqual(10, p2.x, 'x is computed wrong', [p1, p2]);
    this.assertAlmostEqual(9, p2.y, 'y is computed wrong', [p1, p2]);
    this.assertAlmostEqual(-3, p2.z, 'z is computed wrong', [p1, p2]);
}

TestHelpers.prototype.testRotateRandomly = function()
{
    var p1 = new TD_Point(10, 9, -3);
    var line = new TD_Line(new TD_Point(3, -1, 50), new TD_Point(10, 2, -20));
    var p2 = TD_RotatePointAboutAxis(p1, line, Math.PI / 20);
    this.assertAlmostEqual(10.8497, p2.x, 'x is computed wrong', [p1, p2]);
    this.assertAlmostEqual(11.6506, p2.y, 'y is computed wrong', [p1, p2]);
    this.assertAlmostEqual(-2.3101, p2.z, 'z is computed wrong', [p1, p2]);
}

var test_helpers = new TestHelpers();
test_helpers.run();