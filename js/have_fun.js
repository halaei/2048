/**
 * HAVE FUN
**/
function haveFun()
{
	var game_div = document.getElementById("Triangular2048MainDiv");
    var view = game_div.getElementsByClassName("canvas_view")[0];
    var controller = game_div.getElementsByClassName("canvas_controller")[0];
    var reset = game_div.getElementsByClassName("restart-button")[0];

    var score = game_div.getElementsByClassName("score")[0];
    var highscore = game_div.getElementsByClassName("highscore")[0];
    var storage = new LocalStorageManager();
	return new Game(
		new Grid(4),
		new EventLog(storage),
		[new CanvasController(controller), new KeyboardController(document), new TouchController(view), new Reset(reset)],
		new CanvasView(view, 4),
        new Scorboard(score, highscore, 0, storage)
    );
}