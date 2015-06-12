
function haveFun(size)
{
    var configurations = {
        3: {
            initNumberOfTiles: 2,
            numberOfRandomTiles: function(){return 1;},
            getNewTileValue: function(){return 2;}
        },
        4: {
            initNumberOfTiles: 3,
            numberOfRandomTiles: function(){return 1;},
            getNewTileValue: function(){return Math.random() < .7 ? 2 : 4;}
        },
        5: {
            initNumberOfTiles: 3,
            numberOfRandomTiles: function(){return 2;},
            getNewTileValue: function(){return Math.random() < .9 ? 4 : 8;}
        }
    };
    var conf = configurations[size] ? configurations[size]: configurations[5];
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
        new Scorboard(score, highscore, 0, storage),
        conf
    );
}