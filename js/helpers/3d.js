function TD_Point(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
}

TD_Point.prototype.normalize = function()
{
    var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return new TD_Point(this.x / l, this.y / l, this.z / l);
};

function TD_Line(point, direction)
{
    this.point = point;
    this.direction = direction.normalize();
}

function TD_RotatePointAboutAxis(point, line, angle)
{
    //some messy renames:
    var x = point.x;
    var y = point.y;
    var z = point.z;

    var a = line.point.x;
    var b = line.point.y;
    var c = line.point.z;

    var u = line.direction.x;
    var v = line.direction.y;
    var w = line.direction.z;

    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    return new TD_Point(
        (a * (v*v + w*w) - u * (b*v + c*w - u*x - v*y - w*z)) * (1 - cos) + x*cos + (-c*v + b*w - w*y + v*z) * sin,
        (b * (u*u + w*w) - v * (a*u + c*w - u*x - v*y - w*z)) * (1 - cos) + y*cos + (c*u - a*w + w*x - u*z) * sin,
        (c * (u*u + v*v) - w * (a*u + b*v - u*x - v*y - w*z)) * (1 - cos) + z*cos + (-b*u + a*v - v*x + u*y) * sin
    );
}