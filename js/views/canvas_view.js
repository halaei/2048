/**
 * CanvasView Class
**/
function CanvasView(canvas)
{
	this.canvas = canvas;
    this.context = canvas.getContext("2d");
}

CanvasView.prototype.dispatchEvents = function(events)
{

}

CanvasView.prototype.onNewRandomTile = function(row, rank, value)
{
	
}

CanvasView.prototype.onGameOver = function()
{
 
}

CanvasView.prototype.onNewGame = function()
{
	haveFun();
}