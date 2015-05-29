function GridLocation(row, rank)
{
    this.row = row;
    this.rank = rank;
}

function InsertAnimationComponent(dst, value, n_frames)
{
    this.dst = dst;
    this.value = value;
    this.n_frames = n_frames;
    this.cur_frame = 0;
}

function RollAnimationComponenet(src, dst, value, n_frames)
{
    this.src = src;
    this.dst = dst;
    this.value = value;
    this.n_frames = n_frames;
    this.cur_frame = 0;
}

function MergeAnimationComponent(src, old_value, new_value, n_frames)
{
    this.src = src;
    this.new_value = new_value;
    this.old_value = old_value;
    this.n_frames = n_frames;
    this.cur_frame = 0;
}

function Animation(n_frames)
{
    this.n_frames = n_frames;
    this.cur_frame = 0;
    this.components = [];
}

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

    //set state of the game
    this.game_over = false;

    this.animations = [];

}

CanvasView.prototype.draw = function()
{
    var self = this;
    var polygon = makeRegularPolygon(3, self.radius, self.center.x, self.center.y, - Math.PI / 2);
    function drawBoard() {
        drawPolygon(self.context, polygon, "red");
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
                var tile_style = new TileStyle(self.grid[i][j]);
                var triangle = makeRegularPolygon(3, radius, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                drawPolygon(self.context, triangle, "red");

                var triangle = makeRegularPolygon(3, radius * .85, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                drawPolygon(self.context, triangle, tile_style.line_style, tile_style.fill_style);

                writeText(self.context, self.grid[i][j], x, y[j % 2], tile_style.font, tile_style.font_style);
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

CanvasView.prototype.handleStepEvent = function(event)
{
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
            this.grid[i][j] = event.values[v];
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
    this.font = value < 100 ? "30px Arial" : value < 1000 ? "20px Arial" : "15px Arial";
    this.line_style = 'blue';
}
