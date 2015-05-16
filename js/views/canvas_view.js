/**
 * CanvasView Class
**/
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
    this.gameOver = false;
    this.initGrid();

    //draw
    this.draw();
}

CanvasView.prototype.initGrid = function()
{
    this.grid = [];
    for(var i = 0; i < this.gridSize; i++)
    {
        this.grid[i] = [];
        for(var j = 0; j < 2 * i + 1 ; j++)
        {
            this.grid[i][j] = 0;
        }
    }
};

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
                var triangle = makeRegularPolygon(3, radius, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                drawPolygon(self.context, triangle, "red");

                var triangle = makeRegularPolygon(3, radius * .85, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                drawPolygon(self.context, triangle, "blue");

                writeText(self.context, self.grid[i][j], x, y[j % 2]);
                x += size/2;

            }
        }
    }

    drawBoard();
    drawTiles();
}

CanvasView.prototype.handleRollEvent = function(event)
{
    this.grid[event.src_cell.row][event.src_cell.rank] = 0;
    this.grid[event.dst_cell.row][event.dst_cell.rank] = event.value;
};

CanvasView.prototype.handleRollAndMergeEvent = function(event)
{
    this.grid[event.src_cell.row][event.src_cell.rank] = 0;
    this.grid[event.dst_cell.row][event.dst_cell.rank] = event.value;
};

CanvasView.prototype.handleRandomInsertionEvent = function(event)
{
    this.grid[event.dst_cell.row][event.dst_cell.rank] = event.dst_cell.tile.value;
};

CanvasView.prototype.handleGameOverEvent = function(event)
{
    console.log("game is over");
};

CanvasView.prototype.handleControlEvent = function(event)
{

};

CanvasView.prototype.onNewRandomTile = function(row, rank, value)
{
	
};

CanvasView.prototype.onGameOver = function()
{
 
};
