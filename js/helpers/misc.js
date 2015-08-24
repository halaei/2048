
function getMousePosition(event) {
    var target = event.target;
    var rect = target.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
}

function makeRegularPolygon(numberOfSides, radius, Xcenter, Ycenter, startAngle)
{
    var points = [
        {
            x: Xcenter +  radius * Math.cos(startAngle),
            y: Ycenter +  radius *  Math.sin(startAngle)
        }
    ];

    for (var i = 1; i <= numberOfSides; i += 1) {
        points.push(
            {
                x: Xcenter + radius * Math.cos(startAngle + i * 2 * Math.PI / numberOfSides),
                y: Ycenter + radius * Math.sin(startAngle + i * 2 * Math.PI / numberOfSides)
            }
        );
    }
    return points;
}

function drawPolygon(context, points, lineStyle, fillStyle)
{
    if(fillStyle === undefined) {
        fillStyle = 'white';
    }
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);

    for (var i = 1; i < points.length; i += 1) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.fillStyle = fillStyle;
    context.fill();
    context.strokeStyle = lineStyle;
    context.lineWidth = 1;
    context.stroke();
}

function getBoundedBox(points)
{
    var min = {
        x: points[0].x,
        y: points[0].y
    };
    var max = {
        x: points[0].x,
        y: points[0].y
    }

    for(var i = 1; i < points.length; i++)
    {
        if(points[i].x < min.x)
        {
            min.x = points[i].x;
        }
        else if(points[i].x > max.x)
        {
            max.x = points[i].x;
        }

        if(points[i].y < min.y)
        {
            min.y = points[i].y;
        }
        else if(points[i].y > max.y)
        {
            max.y = points[i].y;
        }
    }

    return [min, max];
}

function partitionToStripes(triangle, n)
{
    var lefts = [];
    var rights = [];
    for(var i = 0; i <= n; i ++)
    {
        lefts[i] = {
            x: triangle[0].x + (triangle[2].x - triangle[0].x) * i / n,
            y: triangle[0].y + (triangle[2].y - triangle[0].y) * i / n
        };
        rights[i] = {
            x: triangle[0].x + (triangle[1].x - triangle[0].x) * i / n,
            y: triangle[0].y + (triangle[1].y - triangle[0].y) * i / n
        };
    }
    return [lefts, rights];
}

function writeText(context, text, centerX, centerY, font, fontStyle)
{
    context.textAlign = "center";
    context.textBaseline = 'middle'
    context.fillStyle = fontStyle;
    context.font = font;
    context.fillText(text, centerX, centerY);
}

function rotatePolygon(polygon, axis, angle)
{
    var points = [];
    for(var i = 0; i < polygon.length; i++) {
        var p = TD_RotatePointAboutAxis(new TD_Point(polygon[i].x, polygon[i].y, 0), axis, angle);
        points.push({x: p.x, y: p.y});
    }
    return points;
}

function interpolateLocation(point1, point2, weight1, weight2)
{
    var w = weight1 + weight2;
    return {
        x: (point1.x * weight1 + point2.x * weight2) / w,
        y: (point1.y * weight1 + point2.y * weight2) / w
    };
}