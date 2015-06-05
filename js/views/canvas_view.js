function CanvasView(canvas, gridSize)
{
    //set canvas
	this.canvas = canvas;
    this.context = canvas.getContext("2d");

    //set grid size
    this.gridSize = gridSize;

    //set geometry
    this.center = {x:this.canvas.width / 2, y:this.canvas.height / 2};
    this.radius = this.center.x - 2;

    this.lastFrameTimestamp = 0;
    this.fps = 30;

    //set state of the game
    this.game_over = false;

    this.animations = [];

}

CanvasView.prototype.drawBoard = function()
{

};

CanvasView.prototype.drawTiles = function()
{

};

CanvasView.prototype.updateFrame = function()
{

}

CanvasView.prototype.renderAnimation = function()
{
    if(this.animations.length && this.animations[0].finished()) {
        this.animations.pop();
    }

    if(this.animations.length == 0) {
        //do nothing
        return;
    }

    requestAnimationFrame(this.renderAnimation);

}

CanvasView.prototype.draw = function()
{
    var self = this;
    var polygon = makeRegularPolygon(3, self.radius, self.center.x, self.center.y, - Math.PI / 2);

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

    function drawBoard() {
        drawPolygon(self.context, polygon, "red");

        var stripes = partitionToStripes(polygon, self.gridSize);
        var size = (stripes[1][1].x - stripes[0][1].x);
        var radius = size / Math.sqrt(3);
        for(var i = 0; i < self.gridSize; i++)
        {
            var n = 2 * i + 1;
            var x = stripes[0][i].x;
            var y = [
                stripes[0][i].y + radius,
                stripes[0][i + 1].y - radius
            ];
            for(var j = 0; j < n; j++)
            {
                var tile_style = new TileStyle(0);
                var triangle = makeRegularPolygon(3, radius, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                drawPolygon(self.context, triangle, "red");

                var triangle = makeRegularPolygon(3, radius * .85, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                drawPolygon(self.context, triangle, tile_style.line_style, tile_style.fill_style);

                writeText(self.context, 0, x, y[j % 2], tile_style.font, tile_style.font_style);
                x += size/2;

            }
        }
    }

    function drawTiles() {
        var stripes = partitionToStripes(polygon, self.gridSize);
        var size = (stripes[1][1].x - stripes[0][1].x);
        var radius = size / Math.sqrt(3);
        for(var i = 0; i < self.gridSize; i++)
        {
            var n = 2 * i + 1;
            var x = stripes[0][i].x;
            var y = [
                stripes[0][i].y + radius,
                stripes[0][i + 1].y - radius
                ];
            for(var j = 0; j < n; j++)
            {
                if(self.grid[i][j].value) {
                    var tile_style = new TileStyle(self.grid[i][j].value);

                    var triangle = makeRegularPolygon(3, radius * .85, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);

                    if(self.grid[i][j].angle && self.grid[i][j].move_direction !== null) {
                        var axis = axisOfRotation(new GridLocation(i, j), self.grid[i][j].move_direction);
                        triangle = rotatePolygon(triangle, axis, self.grid[i][j].angle);
                    }

                    drawPolygon(self.context, triangle, tile_style.line_style, tile_style.fill_style);

                    writeText(self.context, self.grid[i][j].value, x, y[j % 2], tile_style.font, tile_style.font_style);
                }

                x += size/2;

            }
        }
    }

    drawBoard();
    drawTiles();
}


CanvasView.prototype.gameOver = function()
{
    this.game_over = true;
    console.log("game is over");
};

CanvasView.prototype.handleMoveEvent = function(event)
{
    if(event.gameOver) this.gameOver();
};

CanvasView.prototype.getNewAnimationStartTime = function()
{
    if(this.animations.length) {
        var a = this.animations[this.animations.length - 1];
        return a.start_time + a.duration + 1000 / this.fps;
    }
    return new Date().getTime();
}

CanvasView.prototype.handleStepEvent = function(event)
{
    var animation = new Animation(250, this.getNewAnimationStartTime());
    for(var i = 0; i < event.children.length; i++) {
        if(event.name == 'RollEvent') {
            animation.components.push(new RollAnimationComponenet(
                new GridLocation(event.src_cell.row, event.src_cell.rank),
                new GridLocation(event.dst_cell.row, event.dst_cell.rank),
                event.value,
                event.value
            ));
        } else if(event.name == 'RollAndMergeEvent') {
            animation.components.push(new RollAnimationComponenet(
                new GridLocation(event.src_cell.row, event.src_cell.rank),
                new GridLocation(event.dst_cell.row, event.dst_cell.rank),
                event.value / 2,
                event.value
            ));

        } else if(event.name == 'RandomInsertionEvent') {
            animation.components.push(new InsertAnimationComponent(
                new GridLocation(event.dst_cell.row, event.dst_cell.rank),
                event.value));
        }
    }
    this.animations.push(animation);
};

CanvasView.prototype.handleResetEvent = function(event)
{
}

CanvasView.prototype.handleStatusUpdateEvent = function(event)
{
    this.grid = [];
    var v = 0;
    for(var i = 0; i < this.gridSize; i++)
    {
        this.grid[i] = [];
        for(var j = 0; j < 2 * i + 1 ; j++)
        {
            this.grid[i][j] = {value: event.values[v], angle: 0, move_direction: null};
            v++;
        }
    }
    this.draw();
}

CanvasView.prototype.register = function(game)
{
    /**
     * to check if game is over
     */
    game.on('MoveEvent', this, this.handleMoveEvent);
    game.on('StepEvent', this, this.handleStepEvent);
    game.on('ResetEvent', this, this.handleResetEvent);

    /**
     * for no animation view and to guarantee exactness of final view after the end of animation
     */
    game.on('StatusUpdateEvent', this, this.handleStatusUpdateEvent);
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

function TileStyle(value)
{
    this.fill_style =
        value <= 2048 ? fill_colors[value]:'black';
    this.font_style = value == 0 ? 'gray' : value <= 2048 ? 'black' : 'white';
    this.font = value < 100 ? "25px Clear Sans" : value < 1000 ? "20px Clear Sans" : "15px Arial";
    this.line_style = 'blue';
}
