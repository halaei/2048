function CanvasView(canvas, gridSize)
{
    //set canvas
	this.canvas = canvas;
    this.context = canvas.getContext("2d");

    //set grid size
    this.gridSize = gridSize;
    this.initGrid();

    //set geometry
    this.center = {x:this.canvas.width / 2, y:this.canvas.height / 2};
    this.radius = this.center.x - 2;

    this.fps = 30;

    this.makeBoard();

    //set state of the game
    this.game_over = false;

    this.animations = [];
}

CanvasView.prototype.makeBoard = function()
{
    this.polygons = [];
    this.texts = [];
    this.polygons.push(
        new CPolygon(
            makeRegularPolygon(3, this.radius, this.center.x, this.center.y, - Math.PI / 2),
            "red", "white"));
    var stripes = partitionToStripes(this.polygons[0].vertex_list, this.gridSize);
    var size = (stripes[1][1].x - stripes[0][1].x);
    var radius = size / Math.sqrt(3);
    for(var i = 0; i < this.gridSize; i++)
    {
        var n = 2 * i + 1;
        var x = stripes[0][i].x;
        var y = [
            stripes[0][i].y + radius,
            stripes[0][i + 1].y - radius
        ];
        for(var j = 0; j < n; j++)
        {
            var tile_style = new TileStyle(0, 1);
            var triangle = makeRegularPolygon(3, radius, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
            this.polygons.push(new CPolygon(triangle, "red", null));

            triangle = makeRegularPolygon(3, radius * .85, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
            this.polygons.push(new CPolygon(triangle, tile_style.line_style, tile_style.fill_style));

            this.texts.push(new CText("0", {x: x, y: y[j % 2]}, tile_style.font, tile_style.font_style));
            x += size/2;

        }
    }
};

CanvasView.prototype.drawBoard = function()
{
    for(var i = 0; i < this.polygons.length; i++) {
        drawPolygon(this.context, this.polygons[i].vertex_list, this.polygons[i].line_style, this.polygons[i].fill_style);
    }
    for(i = 0; i < this.texts.length; i++) {
        writeText(this.context, this.texts[i].text, this.texts[i].center.x, this.texts[i].center.y, this.texts[i].font, this.texts[i].font_style);
    }
};

CanvasView.prototype.drawTiles = function()
{
    var self = this;
    var polygon = this.polygons[0].vertex_list;
    function axisOfRotation(grid_location, direction) {
        var d;
        var p;
        switch(direction){
            case 0:
                d = new TD_Point(1, 0, 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - grid_location.row, grid_location.row);
                break;
            case 1:
                d = new TD_Point(Math.cos(Math.PI/3), Math.sin(Math.PI/3), 0);
                p = interpolateLocation(polygon[1], polygon[2], self.gridSize - (grid_location.row - grid_location.rank / 2), (grid_location.row - grid_location.rank / 2));
                break;
            case 2:
                d = new TD_Point(- Math.cos(Math.PI/3), Math.sin(Math.PI/3), 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.rank + 1) / 2, (grid_location.rank + 1) / 2);
                break;
            case 3:
                d = new TD_Point(-1, 0, 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.row + 1), grid_location.row + 1);
                break;
            case 4:
                d = new TD_Point(- Math.cos(Math.PI/3), - Math.sin(Math.PI/3), 0);
                p = interpolateLocation(polygon[1], polygon[2], self.gridSize - (grid_location.row - (grid_location.rank - 1) / 2), (grid_location.row - (grid_location.rank - 1) / 2));
                break;
            case 5:
                d = new TD_Point(Math.cos(Math.PI/3), - Math.sin(Math.PI/3), 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.rank) / 2, (grid_location.rank) / 2);
                break;
        }
        p = new TD_Point(p.x, p.y, 0);
        return new TD_Line(p, d);
    }

    var stripes = partitionToStripes(this.polygons[0].vertex_list, this.gridSize);
    var size = (stripes[1][1].x - stripes[0][1].x);
    var radius = size / Math.sqrt(3);
    for(var i = 0; i < this.gridSize; i++)
    {
        var n = 2 * i + 1;
        var x = stripes[0][i].x;
        var y = [
            stripes[0][i].y + radius,
            stripes[0][i + 1].y - radius
        ];
        for(var j = 0; j < n; j++)
        {
            if(this.grid[i][j].value) {
                var tile_style = new TileStyle(this.grid[i][j].value, this.grid[i][j].text_size_factor);

                var triangle = makeRegularPolygon(3, radius * .85, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                var center = [{x: x, y: y[j % 2]}];

                if(this.grid[i][j].angle && this.grid[i][j].move_direction !== null) {
                    var axis = axisOfRotation(new GridLocation(i, j), this.grid[i][j].move_direction);
                    triangle = rotatePolygon(triangle, axis, this.grid[i][j].angle);
                    center = rotatePolygon(center, axis, this.grid[i][j].angle);
                }

                drawPolygon(this.context, triangle, tile_style.line_style, tile_style.fill_style);

                writeText(this.context, this.grid[i][j].value, center[0].x, center[0].y, tile_style.font, tile_style.font_style);
            }
            x += size/2;
        }
    }

};

CanvasView.prototype.renderAnimation = function()
{
    var time = new Date().getTime();
    while(this.animations.length && this.animations[0].finished(time)) {
        var a = this.animations.shift();
        a.commit(this.grid);
        this.draw();
        this.requestAnimationFrame();
        return;
    }

    if(this.animations.length == 0) {
        return;
    }

    this.animations[0].begin(this.grid);
    this.animations[0].getFrame(this.grid, time);
    this.draw();

    this.requestAnimationFrame();

};

CanvasView.prototype.requestAnimationFrame = function()
{
    var self = this;
    requestAnimationFrame(function(){
        self.renderAnimation();
    });
};

CanvasView.prototype.draw = function()
{
    this.drawBoard();
    this.drawTiles();
};

CanvasView.prototype.gameOver = function()
{
    this.game_over = true;
    console.log("game is over");
};

CanvasView.prototype.handleMoveEvent = function(event)
{
    if(event.gameOver) this.gameOver();
    this.requestAnimationFrame();
};

CanvasView.prototype.getNewAnimationStartTime = function()
{
    var cur = new Date().getTime();
    if(this.animations.length) {
        var a = this.animations[this.animations.length - 1];
        return Math.max(cur, a.start_time + a.duration + Math.ceil(1000 / this.fps));
    }
    return cur;
};

CanvasView.prototype.handleStepEvent = function(event)
{
    var animation = new Animation(200, this.getNewAnimationStartTime(), false);
    for(var i = 0; i < event.children.length; i++) {
        if(event.children[i].name == 'RollEvent') {
            animation.rolls.push(new RollAnimationComponenet(
                new GridLocation(event.children[i].src_cell.row, event.children[i].src_cell.rank),
                new GridLocation(event.children[i].dst_cell.row, event.children[i].dst_cell.rank),
                event.children[i].move_direction,
                event.children[i].value,
                event.children[i].value
            ));
        } else if(event.children[i].name == 'RollAndMergeEvent') {
            animation.rolls.push(new RollAnimationComponenet(
                new GridLocation(event.children[i].src_cell.row, event.children[i].src_cell.rank),
                new GridLocation(event.children[i].dst_cell.row, event.children[i].dst_cell.rank),
                event.children[i].move_direction,
                event.children[i].value / 2,
                event.children[i].value
            ));

        } else if(event.children[i].name == 'RandomInsertionEvent') {
            animation.inserts.push(new InsertAnimationComponent(
                new GridLocation(event.children[i].dst_cell.row, event.children[i].dst_cell.rank),
                event.children[i].value));
        }
    }
    this.animations.push(animation);
};

CanvasView.prototype.handleResetEvent = function(event)
{
    this.handleStatusUpdateEvent(event.children[0]);
};

CanvasView.prototype.initGrid = function()
{
    var grid = [];
    for(var i = 0; i < this.gridSize; i++) {
        grid[i] = [];
        for(var j = 0; j < 2 * i + 1; j++) {
            grid[i][j] = new CTile(0, 0, null, 1);
        }
    }
    this.grid = grid;
};

CanvasView.prototype.pushUpdateStatusAnimation = function(event)
{
    var v = 0;
    var a = new Animation(200, this.getNewAnimationStartTime(), true);
    for(var i = 0; i < this.gridSize; i++)
    {
        for(var j = 0; j < 2 * i + 1 ; j++)
        {
            if(event.values[v]) {
                a.inserts.push(new InsertAnimationComponent(new GridLocation(i, j), event.values[v]));
            }
            v++;
        }
    }
    this.animations.push(a);
};

CanvasView.prototype.handleStatusUpdateEvent = function(event)
{
    this.pushUpdateStatusAnimation(event);
    this.requestAnimationFrame();
};

CanvasView.prototype.register = function(game)
{
    /**
     * to check if game is over
     */
    game.on('MoveEvent', this, this.handleMoveEvent);
    game.on('StepEvent', this, this.handleStepEvent);
    game.on('ResetEvent', this, this.handleResetEvent);

};

var fill_colors = {
        0: 'white',
        2: 'darkgray',
        4: 'darkcyan',
        8: 'darkgreen',
        16: 'darkmagenta',
        32: 'darkorange',
        64: 'darkred',
        128: 'skyblue',
        256: 'springgreen',
        512: 'magenta',
        1024: 'orange',
        2048: 'red'
    };

function TileStyle(value, size_factor)
{
    var size = Math.ceil((value < 100 ? 25 : value < 1000 ? 20 : 15) * size_factor);
    this.fill_style =
        value <= 2048 ? fill_colors[value]:'black';
    this.font_style = value == 0 ? 'gray' : value <= 2048 ? 'black' : 'white';
    this.font = size + "px Clear Sans";
    this.line_style = 'blue';
}
