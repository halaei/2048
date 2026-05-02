const UnitTest = require('../unit_test.js');
const { JSDOM } = require('jsdom');

function TestMicroGame()
{
    this.testDescription = "Testing Micro Game (size 3) with random play until game over with Async Rendering";
}

TestMicroGame.prototype = new UnitTest();

/**
 * Main test execution
 * transformed to async to allow the Node.js event loop to process 
 * CanvasView animations between moves.
 */
TestMicroGame.prototype.testMicroGameRandomPlay = async function()
{
    UnitTest.prototype.setUp.call(this);

    // 1. Create production-like HTML structure using jsdom
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <body>
            <div id="Triangular2048MainDiv">
                <div class="view-container">
                    <canvas class="canvas_view" width="500" height="500"></canvas>
                    <div id="game-message" class="hidden">
                        <p id="message-text"></p>
                        <div class="lower">
                            <a class="keep-playing-button hidden">Keep going</a>
                            <a class="retry-button hidden">Try again</a>
                        </div>
                    </div>
                </div>
                <div class="scoreboard">
                    <div class="score">0</div>
                    <div class="highscore">0</div>
                </div>
            </div>
        </body>
        </html>
    `);

    global.document = dom.window.document;
    global.window = dom.window;

    // 2. Configuration for size 3 (Micro game)
    const configuration = {
        initNumberOfTiles: 2,
        numberOfRandomTiles: function(){return 1;},
        getNewTileValue: function(){return 2;},
        namespace: "3:",
    };

    const gameCanvas = dom.window.document.querySelector('.canvas_view');
    const realCanvasView = new CanvasView(gameCanvas, 3);
    const keyboardController = new KeyboardController(gameCanvas);
    
    const scoreDiv = dom.window.document.querySelector('.score');
    const highscoreDiv = dom.window.document.querySelector('.highscore');
    const realScoreboard = new Scorboard(scoreDiv, highscoreDiv, 0, new LocalStorageManager(configuration.namespace));

    this.grid = new Grid(3);
    this.eventLog = new StatusLog(new LocalStorageManager(configuration.namespace));
    this.view = realCanvasView;
    this.scoreboard = realScoreboard;

    // Create the game
    this.game = new Game(this.grid, this.eventLog, [keyboardController], this.view, this.scoreboard, configuration);

    // 3. Helper to wait for the CanvasView animation queue to empty
    const flushAnimations = () => {
        return new Promise((resolve) => {
            const checkQueue = () => {
                // If animations remain, yield to the event loop and check again
                if (this.view.animations.length === 0) {
                    resolve();
                } else {
                    setImmediate(checkQueue);
                }
            };
            checkQueue();
        });
    };

    let moves = 0;
    let maxMoves = 1000;
    let highestTile = 0;
    const directions = ['up', 'up-right', 'down-right', 'down', 'down-left', 'up-left'];
    const directionKeys = { 'up': 'W', 'up-right': 'E', 'down-right': 'A', 'down': 'S', 'down-left': 'D', 'up-left': 'F' };

    // Helper functions for keyboard events
    const sendKeyEvent = (key, eventType) => {
        const event = { keyCode: key.charCodeAt(0), preventDefault: () => {} };
        if (eventType === 'keydown' && gameCanvas.onkeydown) gameCanvas.onkeydown(event);
        else if (eventType === 'keyup' && gameCanvas.onkeyup) gameCanvas.onkeyup(event);
    };

    const makeKeyboardMove = (direction) => {
        const key = directionKeys[direction];
        sendKeyEvent(key, 'keydown');
        sendKeyEvent(key, 'keyup');
    };

    const getGridState = () => JSON.stringify(this.game.getCellValues());

    console.log('🎮 Starting Micro Game with Async Render validation...');

    // 4. ASYNC GAME LOOP
    while (!this.grid.gameIsOver() && moves < maxMoves) {
        const stateBefore = getGridState();
        let moveMade = false;
        
        for (let attempt = 0; attempt < 10 && !moveMade; attempt++) {
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            makeKeyboardMove(randomDirection);
            
            if (getGridState() !== stateBefore) {
                moveMade = true;
                moves++;
                
                // IMPORTANT: Wait for the render queue to process so drawBoard is called
                await flushAnimations(); 

                const currentTiles = this.game.getCellValues();
                highestTile = Math.max(highestTile, ...currentTiles);
                break;
            }
        }
        if (!moveMade) break;
    }

    // 5. Assertions
    this.assertTrue(moves > 0, "Game should have made at least one move");
    this.assertTrue(this.grid.gameIsOver(), "Game should reach terminal state");
    this.assertTrue(this.grid.getEmptyCells().length === 0, "Board should be full at Game Over");

    // Verify neighbors for "True" Game Over logic
    let illegalMergeFound = false;
    const cells = this.grid.cells;
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            const cell = cells[i][j];
            if (!cell || !cell.tile || cell.tile.value === 0) continue;
            for (let d = 0; d < 6; d++) {
                const neighbor = this.grid.neighbor(cell, d);
                if (neighbor && neighbor.tile && neighbor.tile.value === cell.tile.value) {
                    illegalMergeFound = true;
                    break;
                }
            }
        }
    }

    this.assertTrue(!illegalMergeFound, "No illegal merges found at Game Over");
    console.log(`✅ Game completed with ${moves} moves. Rendering validated.`);
};

module.exports = TestMicroGame;