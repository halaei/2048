/**
 * HAVE FUN
**/
function haveFun(size)
{
	var game_div = document.getElementById("Triangular2048MainDiv");
    var view = game_div.getElementsByClassName("canvas_view")[0];
    var reset = game_div.getElementsByClassName("restart-button")[0];

    var score = game_div.getElementsByClassName("score")[0];
    var highscore = game_div.getElementsByClassName("highscore")[0];
    var storage = new LocalStorageManager();
	return new Game(
		new Grid(size),
		new StatusLog(storage),
		[new KeyboardController(document), new TouchController(view), new Reset(reset)],
		new CanvasView(view, size),
        new Scorboard(score, highscore, 0, storage)
    );
}