
function haveFun(size)
{
    var configurations = {
        3: {
            initNumberOfTiles: 2,
            numberOfRandomTiles: function(){return 1;},
            getNewTileValue: function(){return 2;},
            namespace: "3:",
        },
        4: {
            initNumberOfTiles: 3,
            numberOfRandomTiles: function(){return 1;},
            getNewTileValue: function(){return Math.random() < .7 ? 2 : 4;},
            namespace: "",
        },
        5: {
            initNumberOfTiles: 3,
            numberOfRandomTiles: function(){return 2;},
            getNewTileValue: function(){return Math.random() < .9 ? 4 : 8;},
            namespace: "5:",
        }
    };
    var conf = configurations[size] ? configurations[size]: configurations[5];
	var game_div = document.getElementById("Triangular2048MainDiv");
    var view = game_div.getElementsByClassName("canvas_view")[0];
    var reset = game_div.getElementsByClassName("restart-button")[0];

    var score = game_div.getElementsByClassName("score")[0];
    var highscore = game_div.getElementsByClassName("highscore")[0];
    var storage = new LocalStorageManager(conf.namespace);
// --- NEW: Inject the FPS display element ---
    var fpsDisplay = document.createElement("div");
    fpsDisplay.id = "fps-display";
    fpsDisplay.innerText = "0 FPS";
    document.body.appendChild(fpsDisplay);

    var canvasView = new CanvasView(view, size, {
        slow: false,
        pfs: 60,
        hotspot: false,
        log_fps: false, // Default is false[cite: 16]
    });

    // --- NEW: Secret Debug Mode Logic ---
    var tapTimes = [];
    highscore.addEventListener('pointerdown', function(e) {
        var now = Date.now();
        tapTimes.push(now);
        
        // Remove taps older than 3 seconds (3000ms)
        tapTimes = tapTimes.filter(t => now - t <= 3000);
        
        // If 10 taps remain in the array, activate!
        if (tapTimes.length >= 10) {
            tapTimes = []; // Reset the counter
            
            // Toggle the visibility and state
            fpsDisplay.style.display = "block";
            canvasView.debug.log_fps = true;
            
            // Initialize the FPS tick if it wasn't done in the constructor
            if (!canvasView.fpsTick) {
                canvasView.fpsTick = { lastTime: performance.now(), frames: 0 };
            }
            
            console.log("Secret Debug Mode Activated");
        }
    });
    return new Game(
		new Grid(size),
		new StatusLog(storage),
		[new KeyboardController(document), new TouchController(view), new Reset(reset)],
		canvasView,
        new Scorboard(score, highscore, 0, storage),
        conf
    );
}