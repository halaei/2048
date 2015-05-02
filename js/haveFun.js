/**
 * HAVE FUN
**/
function haveFun()
{
	var gameDiv = getElementById("Triangular2048MainDiv");
	return new Game(
		new Grid(4),
		new EventLog(new Storage()),
		[
			new KeyboardController(gameDiv),
			new MouseController(gameDiv),
			new TouchController(gameDiv)
		],
		new CanvasView(gameDiv));
}

haveFun();