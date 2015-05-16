/**
 * HAVE FUN
**/
function haveFun()
{
	var game_div = document.getElementById("Triangular2048MainDiv");
    var view = game_div.getElementsByClassName("canvas_view")[0];
    var controller = game_div.getElementsByClassName("canvas_controller")[0];
	return new Game(
		new Grid(4),
		new EventLog(new LocalStorageManager()),
		[
			new CanvasController(controller),
		],
		new CanvasView(view, 4));
}