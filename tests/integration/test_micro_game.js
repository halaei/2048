const UnitTest = require('../unit_test.js');
const { JSDOM } = require('jsdom');

function TestMicroGame()
{
    this.testDescription = "Testing Micro Game (size 3) with random play until game over";
}

TestMicroGame.prototype = new UnitTest();

TestMicroGame.prototype.testMicroGameRandomPlay = function()
{
    UnitTest.prototype.setUp.call(this);

    // Create production-like HTML structure using jsdom
    const dom = new JSDOM(`
        <!DOCTYPE html>
        <html>
        <body>
            <div id="Triangular2048MainDiv">
                <div class="heading">
                    <h1 class="title">T2048</h1>
                    <div class="scoreboard">
                        <div class="score">0</div>
                        <div class="highscore">0</div>
                    </div>
                </div>
                <div class="view-container">
                    <canvas class="canvas_view" width="500" height="500"></canvas>
                    <div id="game-message" class="hidden">
                        <p id="message-text"></p>
                    </div>
                </div>
                <div class="help">
                    <p>(controls: drag&drop, touch or keys: WEASDF)</p>
                </div>
            </div>
        </body>
        </html>
    `);

    // Set up global DOM objects for the test
    global.document = dom.window.document;
    global.window = dom.window;

    // Configuration for size 3 (Micro game)
    const configuration = {
        initNumberOfTiles: 2,
        numberOfRandomTiles: function(){return 1;},
        getNewTileValue: function(){return 2;},
        namespace: "3:",
    };

    // Create mock view (keep this as mock since it's for UI)
    const mockView = {
        register: function(game) {
            // Do nothing for automated test
        }
    };
    
    // Create real scoreboard with real DOM elements from jsdom
    const scoreDiv = dom.window.document.querySelector('.score');
    const highscoreDiv = dom.window.document.querySelector('.highscore');
    const realScoreboard = new Scorboard(scoreDiv, highscoreDiv, 0, new LocalStorageManager(configuration.namespace));

    // Create game components with keyboard controller
    this.grid = new Grid(3);
    this.eventLog = new StatusLog(new LocalStorageManager(configuration.namespace));
    
    // Use the real canvas element from the DOM for keyboard controller
    const gameCanvas = dom.window.document.querySelector('.canvas_view');
    const keyboardController = new KeyboardController(gameCanvas);
    this.controllers = [keyboardController];
    
    this.view = mockView;
    this.scoreboard = realScoreboard;

    // Create the game
    this.game = new Game(this.grid, this.eventLog, this.controllers, this.view, this.scoreboard, configuration);

    // Track game statistics
    let moves = 0;
    let maxMoves = 1000; // Safety limit to prevent infinite loop
    let highestTile = 0; // Track highest tile reached
    
    // Triangular game has 6 directions: WEASDF
    const directions = ['up', 'up-right', 'down-right', 'down', 'down-left', 'up-left'];
    // Map directions to keyboard keys (WEASDF for triangular game)
    const directionKeys = {
        'up': 'W',           // W = up
        'up-right': 'E',     // E = up-right  
        'down-right': 'A',   // A = down-right
        'down': 'S',         // S = down
        'down-left': 'D',    // D = down-left
        'up-left': 'F'       // F = up-left
    };

    console.log('🎮 Starting Micro Game (3x3) with random keyboard play...');

    // Helper function to send keyboard event
    const sendKeyEvent = (key, eventType) => {
        const event = {
            keyCode: key.charCodeAt(0),
            preventDefault: () => {}
        };
        
        if (eventType === 'keydown' && gameCanvas.onkeydown) {
            gameCanvas.onkeydown(event);
        } else if (eventType === 'keyup' && gameCanvas.onkeyup) {
            gameCanvas.onkeyup(event);
        }
    };

    // Helper function to make a move with keyboard events
    const makeKeyboardMove = (direction) => {
        const key = directionKeys[direction];
        sendKeyEvent(key, 'keydown');
        sendKeyEvent(key, 'keyup');
    };

    // Helper function to get grid state
    const getGridState = () => JSON.stringify(this.game.getCellValues());

    // Play until game over or max moves reached
    while (!this.grid.gameIsOver() && moves < maxMoves) {
        // Capture state before the move
        const stateBefore = getGridState();
        
        let moveMade = false;
        // Try random directions (increased to 10 attempts)
        for (let attempt = 0; attempt < 10 && !moveMade; attempt++) {
            const randomDirection = directions[Math.floor(Math.random() * directions.length)];
            makeKeyboardMove(randomDirection);
            
            // Check if the board actually changed (moved or merged)
            if (getGridState() !== stateBefore) {
                moveMade = true;
                moves++;
                
                // Update highest tile reached
                const currentTiles = this.game.getCellValues();
                highestTile = Math.max(highestTile, ...currentTiles);
                break;
            }
        }

        // Exhaustive fallback (if random didn't work)
        if (!moveMade) {
            for (const direction of directions) {
                makeKeyboardMove(direction);
                if (getGridState() !== stateBefore) {
                    moveMade = true;
                    moves++;
                    
                    // Update highest tile reached
                    const currentTiles = this.game.getCellValues();
                    highestTile = Math.max(highestTile, ...currentTiles);
                    break;
                }
            }
        }

        // Break if we literally can't move anymore (should match gameIsOver)
        if (!moveMade) break;
        
        // Log progress every 50 moves
        if (moves % 50 === 0) {
            console.log(`📊 Move ${moves}: Score = ${this.game.score}, Highest tile = ${highestTile}, Empty cells: ${this.grid.getEmptyCells().length}`);
        }
    }

    // Test assertions
    this.assertTrue(moves > 0, "Game should have made at least one move");
    this.assertTrue(this.game.score >= 0, "Score should be non-negative");

    // Log final results
    console.log(`🏁 Game completed!`);
    console.log(`📈 Final score: ${this.game.score}`);
    console.log(`🎯 Total moves: ${moves}`);
    console.log(`� Highest tile reached: ${highestTile}`);
    console.log(`� Game over: ${this.grid.gameIsOver()}`);
    console.log(`🏆 Won: ${this.game.won || false}`);
    console.log(`📊 Empty cells remaining: ${this.grid.getEmptyCells().length}`);
    
    // Show final grid state
    const cellValues = this.game.getCellValues();
    console.log(`📋 Final grid: [${cellValues.join(', ')}]`);
    
    // Simplified and improved assertions
    this.assertTrue(this.grid.gameIsOver(), "Game should reach a terminal state");
    this.assertTrue(this.grid.getEmptyCells().length === 0, "Board should be full at Game Over");
    this.assertTrue(moves >= 5, "Should have made at least 5 moves in a completed game");
    this.assertTrue(highestTile >= 4, "Should have reached at least tile value 4");
    
    // 1. Manually verify no neighbors have the same value (The "True" Game Over logic)
    const cells = this.grid.cells; // Assuming this.grid.cells is the internal array
    let illegalMergeFound = false;

    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            const cell = cells[i][j];
            if (!cell || !cell.tile || cell.tile.value === 0) continue;

            // Check all neighbors of this specific cell (6 directions for triangular grid)
            for (let direction = 0; direction < 6; direction++) {
                const neighbor = this.grid.neighbor(cell, direction);
                if (neighbor && neighbor.tile && neighbor.tile.value === cell.tile.value) {
                    illegalMergeFound = true;
                    console.error(`❌ Logic Error: Cell at (${i}, ${j}) has same value as neighbor! Value: ${cell.tile.value}`);
                    break;
                }
            }
            if (illegalMergeFound) break;
        }
        if (illegalMergeFound) break;
    }

    this.assertTrue(!illegalMergeFound, "Game Over state reached, but identical neighboring tiles were found!");
    
    console.log(`✅ Game completed successfully with ${moves} moves, score ${this.game.score}, and highest tile ${highestTile}`);
};

module.exports = TestMicroGame;
