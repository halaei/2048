function CanvasView(canvas, gridSize) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    // 1. CAPTURE & LOCK DIMENSIONS
    this.logicalWidth = parseInt(canvas.getAttribute("width") || 500, 10);
    this.logicalHeight = parseInt(canvas.getAttribute("height") || 500, 10);
    this.dpr = globalThis.devicePixelRatio || 1;

    // 2. INITIALIZE BUFFER
    this.canvas.width = this.logicalWidth * this.dpr;
    this.canvas.height = this.logicalHeight * this.dpr;
    this.context.scale(this.dpr, this.dpr);

    this.gridSize = gridSize;
    this.initGrid();
    this.center = { x: this.logicalWidth / 2, y: this.logicalHeight / 2 };
    this.radius = this.center.x - 6;
    this.fps = 30;

    // 3. CACHE THE BOARD (using fixed dpr)
    this.boardCache = document.createElement('canvas');
    this.boardCache.width = this.canvas.width;
    this.boardCache.height = this.canvas.height;
    this.renderBoardToCache();

    this.game_over = false;
    this.animations = [];
}

CanvasView.prototype.renderBoardToCache = function () {
    var tempCtx = this.boardCache.getContext('2d');
    tempCtx.scale(this.dpr, this.dpr); // Use locked dpr
    
    this.makeBoard(); 
    // Draw the main board background
    drawPolygon(tempCtx, this.polygons[0].vertex_list, '#bbada0', '#ffffff');

    for (var i = 1; i < this.polygons.length; i++) {
        var points = this.polygons[i].vertex_list;
        drawPolygon(tempCtx, points, '#ffffff', '#ffffff');
        tempCtx.strokeStyle = '#e0adad';
        tempCtx.lineWidth = 2;
        tempCtx.stroke();
    }
};

CanvasView.prototype.draw = function () {
    // Clear using logical dimensions (the scale(dpr) handles the rest)
    this.context.clearRect(0, 0, this.logicalWidth, this.logicalHeight);
    
    // Draw the cached board
    // Since the context is scaled by dpr, drawing at logical size fills the buffer
    this.context.drawImage(this.boardCache, 0, 0, this.logicalWidth, this.logicalHeight);
    
    this.drawTiles();
};

CanvasView.prototype.makeBoard = function () {
    this.polygons = [];
    this.polygons.push(
        new CPolygon(
            makeRegularPolygon(3, this.radius, this.center.x, this.center.y, - Math.PI / 2),
            "red", "white"));
    var stripes = partitionToStripes(this.polygons[0].vertex_list, this.gridSize);
    var size = (stripes[1][1].x - stripes[0][1].x);
    var radius = size / Math.sqrt(3);
    for (var i = 0; i < this.gridSize; i++) {
        var n = 2 * i + 1;
        var x = stripes[0][i].x;
        var y = [
            stripes[0][i].y + radius,
            stripes[0][i + 1].y - radius
        ];
        for (var j = 0; j < n; j++) {
            var tile_style = new TileStyle(0, 1);
            var triangle = makeRegularPolygon(3, radius, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
            //this.polygons.push(new CPolygon(triangle, "red", null));

            triangle = makeRegularPolygon(3, radius * .9, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
            this.polygons.push(new CPolygon(triangle, tile_style.line_style, tile_style.fill_style));

            x += size / 2;
        }
    }
};

CanvasView.prototype.drawTiles = function () {
    var self = this;
    var polygon = this.polygons[0].vertex_list;
    var stripes = partitionToStripes(polygon, this.gridSize);
    var size = (stripes[1][1].x - stripes[0][1].x);
    var radius = size / Math.sqrt(3);

    // --- 1. HELPERS (Moved outside loops for speed) ---
    function getCellCenter(row, rank) {
        return {
            x: stripes[0][row].x + rank * size / 2,
            y: [stripes[0][row].y + radius, stripes[0][row + 1].y - radius][rank % 2]
        };
    }

    function axisOfRotation(grid_location, direction) {
        var d, p;
        switch (direction) {
            case 0: d = new TD_Point(1, 0, 0); p = interpolateLocation(polygon[0], polygon[1], self.gridSize - grid_location.row, grid_location.row); break;
            case 1: d = new TD_Point(Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0); p = interpolateLocation(polygon[1], polygon[2], self.gridSize - (grid_location.row - grid_location.rank / 2), (grid_location.row - grid_location.rank / 2)); break;
            case 2: d = new TD_Point(- Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0); p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.rank + 1) / 2, (grid_location.rank + 1) / 2); break;
            case 3: d = new TD_Point(-1, 0, 0); p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.row + 1), grid_location.row + 1); break;
            case 4: d = new TD_Point(- Math.cos(Math.PI / 3), - Math.sin(Math.PI / 3), 0); p = interpolateLocation(polygon[1], polygon[2], self.gridSize - (grid_location.row - (grid_location.rank - 1) / 2), (grid_location.row - (grid_location.rank - 1) / 2)); break;
            case 5: d = new TD_Point(Math.cos(Math.PI / 3), - Math.sin(Math.PI / 3), 0); p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.rank) / 2, (grid_location.rank) / 2); break;
        }
        return new TD_Line(new TD_Point(p.x, p.y, 0), d);
    }

    function getNextLocation(location, direction) {
        if (location.rank % 2) {
            switch (direction) {
                case 0: case 5: return { row: location.row - 1, rank: location.rank - 1 };
                case 1: case 2: return { row: location.row, rank: location.rank + 1 };
                case 3: case 4: return { row: location.row, rank: location.rank - 1 };
            }
        } else {
            switch (direction) {
                case 0: case 1: return { row: location.row, rank: location.rank + 1 };
                case 2: case 3: return { row: location.row + 1, rank: location.rank + 1 };
                case 4: case 5: return { row: location.row, rank: location.rank - 1 };
            }
        }
        return null;
    }

    // --- 2. MAIN DRAW LOOP ---
    for (var anglie_filter = 0; anglie_filter < 2; anglie_filter++) {
        for (var i = 0; i < this.gridSize; i++) {
            for (var j = 0; j < (2 * i + 1); j++) {
                var tile = this.grid[i][j];
                if (!tile.value) continue;

                // Pass 0: Flat or rising tiles. Pass 1: Tiles falling into new slots.
                if ((anglie_filter && tile.angle > Math.PI / 2) || (!anglie_filter && tile.angle <= Math.PI / 2)) {
                    var center = getCellCenter(i, j);
                    var tile_style = new TileStyle(tile.value, 1);
                    var triangle = makeRegularPolygon(3, radius * .85, center.x, center.y, j % 2 ? Math.PI / 2 : - Math.PI / 2);
                    
                    var textMatrix = [1, 0, 0, 1, 0, 0];
                    var lightShiftX = 0, lightShiftY = -radius * 0.1;
                    var drawX = center.x, drawY = center.y;
                    var textPos = { x: center.x, y: center.y }; // Default text position

                    // 3D Geometry calculations
                    if (tile.angle > 0.01 && tile.move_direction !== null) {
                        var axis = axisOfRotation(new GridLocation(i, j), tile.move_direction);
                        var flat_triangle = JSON.parse(JSON.stringify(triangle));
                        
                        triangle = rotatePolygon2D(triangle, axis.point, axis.direction, tile.angle);
                        textMatrix = getRotationTransform2D(axis.point, axis.direction, tile.angle, true);

                        // If flipped past 90 degrees, calculate the center of the next slot
                        if (tile.angle > Math.PI / 2) {
                            var nextLoc = getNextLocation(new GridLocation(i, j), tile.move_direction);
                            var nextCenter = nextLoc ? getCellCenter(nextLoc.row, nextLoc.rank) : null;
                            if (nextCenter) textPos = nextCenter;
                        }

                        // Lighting "Center" (Physical center of the rotated face)
                        drawX = (triangle[0].x + triangle[1].x + triangle[2].x) / 3;
                        drawY = (triangle[0].y + triangle[1].y + triangle[2].y) / 3;
                        
                        var tipIndex = 0, maxDistSq = -1;
                        for (var k = 0; k < 3; k++) {
                            var dx = triangle[k].x - flat_triangle[k].x, dy = triangle[k].y - flat_triangle[k].y;
                            var distSq = dx * dx + dy * dy;
                            if (distSq > maxDistSq) { maxDistSq = distSq; tipIndex = k; }
                        }
                        var tiltIntensity = Math.sin(tile.angle);
                        lightShiftX = (triangle[tipIndex].x - drawX) * tiltIntensity * 0.85;
                        lightShiftY = (triangle[tipIndex].y - drawY) * tiltIntensity * 0.85;
                    }

                    this.context.save();
                    
                    // Shadow
                    if (tile.angle > 0.05) {
                        this.context.shadowColor = "rgba(0, 0, 0, 0.2)";
                        this.context.shadowBlur = radius * 0.15;
                    }

                    // Face Gradient
                    var grad = this.context.createRadialGradient(drawX + lightShiftX, drawY + lightShiftY, radius * 0.05, drawX, drawY, radius);
                    grad.addColorStop(0, tile_style.colors.light);
                    grad.addColorStop(1, tile_style.colors.base);
                    
                    this.context.fillStyle = grad;
                    this.context.beginPath();
                    this.context.moveTo(triangle[0].x, triangle[0].y);
                    for (var k = 1; k < triangle.length; k++) this.context.lineTo(triangle[k].x, triangle[k].y);
                    this.context.closePath();
                    this.context.fill();

                    // Optimized Double Stroke Border
                    this.context.strokeStyle = "rgba(0, 0, 0, 0.1)";
                    this.context.lineWidth = 3;
                    this.context.stroke();
                    this.context.strokeStyle = "rgba(255, 255, 255, 0.5)";
                    this.context.lineWidth = 1;
                    this.context.stroke();

                    this.context.restore();

                    // FIXED: Draw text at textPos, not center.x/y!
                    drawTextTransformed(this.context, tile.value, textPos.x, textPos.y, tile_style.font, tile_style.font_style, textMatrix);
                }
            }
        }
    }
};

CanvasView.prototype.renderAnimation = function () {
    var time = new Date().getTime();
    if (this.animations.length && this.animations[0].finished(time)) {
        var a = this.animations.shift();
        a.commit(this.grid);
        this.draw();
        // Check if this was the last animation and a win is pending
        if (this.animations.length === 0) {
            if (this.pendingWinMessage) {
                this.showGameMessage("The Apex Reached!", false);
                this.pendingWinMessage = false;
            } else if (this.pendingGameOverMessage) {
                this.showGameMessage("Game Over!", true);
                this.pendingGameOverMessage = false;
            }
        }
        this.requestAnimationFrame();
        return;
    }

    if (this.animations.length == 0) {
        return;
    }

    this.animations[0].begin(this.grid);
    this.animations[0].getFrame(this.grid, time);
    this.draw();

    this.requestAnimationFrame();

};

CanvasView.prototype.showGameMessage = function(text, isGameOver) {
    const container = document.getElementById("game-message");
    const textElement = document.getElementById("message-text");
    const keepGoing = container.querySelector(".keep-playing-button");
    const retry = container.querySelector(".retry-button");

    if (container && textElement) {
        textElement.textContent = text;
        container.classList.remove("hidden", "game-won", "game-over");

        if (isGameOver) {
            container.classList.add("game-over");
            keepGoing.classList.add("hidden");
            retry.classList.remove("hidden");
            retry.onclick = () => this.reset(); 
        } else {
            container.classList.add("game-won")
            keepGoing.classList.remove("hidden");
            retry.classList.add("hidden");
            keepGoing.onclick = () => container.classList.add("hidden");
        }
    }
};

CanvasView.prototype.requestAnimationFrame = function () {
    var self = this;
    requestAnimationFrame(function () {
        self.renderAnimation();
    });
};

CanvasView.prototype.gameOver = function () {
    this.game_over = true;
    this.pendingGameOverMessage = true;
    console.log("game is over");
};

CanvasView.prototype.handleMoveEvent = function (event) {
    this.merge_hint = true;
    if (event.won && !this.hasWon) {
        this.pendingWinMessage = true;
        this.hasWon = true; 
    }
    if (event.game_over) this.gameOver();
    this.requestAnimationFrame();
};

CanvasView.prototype.getNewAnimationStartTime = function () {
    var cur = new Date().getTime();
    if (this.animations.length) {
        var a = this.animations[this.animations.length - 1];
        return Math.max(cur, a.start_time + a.duration + Math.ceil(1000 / this.fps));
    }
    return cur;
};

CanvasView.prototype.handleStepEvent = function (event) {
    var animation = new Animation(this.debug ? 2000 : 200, this.getNewAnimationStartTime(), false);
    if (this.merge_hint) {
        animation.duration *= 3 / 4;
        animation.merge_hint = true;
        this.merge_hint = false;
    }
    for (var i = 0; i < event.children.length; i++) {
        if (event.children[i].name == 'RollEvent') {
            animation.rolls.push(new RollAnimationComponenet(
                new GridLocation(event.children[i].src_cell.row, event.children[i].src_cell.rank),
                new GridLocation(event.children[i].dst_cell.row, event.children[i].dst_cell.rank),
                event.children[i].move_direction,
                event.children[i].value,
                event.children[i].value
            ));
        } else if (event.children[i].name == 'RollAndMergeEvent') {
            animation.rolls.push(new RollAnimationComponenet(
                new GridLocation(event.children[i].src_cell.row, event.children[i].src_cell.rank),
                new GridLocation(event.children[i].dst_cell.row, event.children[i].dst_cell.rank),
                event.children[i].move_direction,
                event.children[i].value / 2,
                event.children[i].value
            ));

        } else if (event.children[i].name == 'RandomInsertionEvent') {
            animation.inserts.push(new InsertAnimationComponent(
                new GridLocation(event.children[i].dst_cell.row, event.children[i].dst_cell.rank),
                event.children[i].value));
        }
    }
    this.animations.push(animation);
};

CanvasView.prototype.handleResetEvent = function (event) {
    this.merge_hint = true;
    this.handleStatusUpdateEvent(event.children[0]);
};

CanvasView.prototype.initGrid = function () {
    var grid = [];
    for (var i = 0; i < this.gridSize; i++) {
        grid[i] = [];
        for (var j = 0; j < 2 * i + 1; j++) {
            grid[i][j] = new CTile(0, 0, null, 1);
        }
    }
    this.grid = grid;
};

CanvasView.prototype.pushUpdateStatusAnimation = function (event) {
    var v = 0;
    var a = new Animation(this.debug ? 2000 : 200, this.getNewAnimationStartTime(), true);
    for (var i = 0; i < this.gridSize; i++) {
        for (var j = 0; j < 2 * i + 1; j++) {
            if (event.values[v]) {
                a.inserts.push(new InsertAnimationComponent(new GridLocation(i, j), event.values[v]));
            }
            v++;
        }
    }
    this.animations.push(a);
};

CanvasView.prototype.handleStatusUpdateEvent = function (event) {
    this.pushUpdateStatusAnimation(event);
    this.requestAnimationFrame();
};

CanvasView.prototype.clearHints = function () {
    for (var i = this.animations.length - 1; i >= 0; i--) {
        if (this.animations[i].hints.length > 0) {
            this.animations[i].clear_hints = true;
            this.animations[i].finished = function () { return true; };
        }
    }
    this.animations.push(newClearHintAnimation(this.getNewAnimationStartTime()));
};

CanvasView.prototype.handleBeginMoveHint = function (event) {
    console.log('preview for moving in direction: ' + event.direction);

    this.clearHints();

    var animation = new Animation(this.debug ? 500 : 50, this.getNewAnimationStartTime(), false);
    for (var i = 0; i < event.previews.length; i++) {
        animation.hints.push(new HintAnimationComponent(event.previews[i].cell, event.previews[i].neighbor,
            event.previews[i].move_direction, event.previews[i].cell.tile.value));
    }
    this.animations.push(animation);
    this.requestAnimationFrame();
};

CanvasView.prototype.handleEndMoveHint = function (event) {
    this.clearHints();
    this.requestAnimationFrame();
    console.log('end of preview');
};

CanvasView.prototype.register = function (game) {
    /**
     * to check if game is over
     */
    this.reset = function() {
        game.reset();
        const container = document.getElementById("game-message");
        container.classList.add("hidden");
    };
    game.on('MoveEvent', this, this.handleMoveEvent);
    game.on('StepEvent', this, this.handleStepEvent);
    game.on('ResetEvent', this, this.handleResetEvent);
    game.on('BeginMoveHintEvent', this, this.handleBeginMoveHint);
    game.on('EndMoveHintEvent', this, this.handleEndMoveHint);
};

var TILE_PALETTE = {
    0:    { base: '#f0f0f0', light: '#ffffff' }, // Empty Slot
    2:    { base: '#9BC6DA', light: '#C6E2EE' }, // Soft Blue (Starting)
    4:    { base: '#4A90E2', light: '#7EBFFF' }, // Sapphire
    8:    { base: '#27AE60', light: '#58D68D' }, // Emerald
    16:   { base: '#8E44AD', light: '#BB8FCE' }, // Amethyst
    32:   { base: '#D35400', light: '#EB984E' }, // Amber
    64:   { base: '#C0392B', light: '#E74C3C' }, // Ruby
    128:  { base: '#1ABC9C', light: '#48C9B0' }, // Turquoise
    256:  { base: '#2C3E50', light: '#5D6D7E' }, // Obsidian
    512:  { base: '#F39C12', light: '#F7DC6F' }, // Topaz
    1024: { base: '#E67E22', light: '#F0B27A' }, // Fire Opal
    2048: { base: '#D4AF37', light: '#F1C40F' }  // GOLD (The Goal)
};

function TileStyle(value, size_factor) {
    var theme = TILE_PALETTE[value] || { base: '#222', light: '#444', shadow: '#000' };
    var size = Math.ceil((value < 100 ? 25 : value < 1000 ? 20 : 15) * size_factor);

    this.colors = theme;
    // We'll use white text for almost everything to make the jewel colors glow
    this.font_style = value === 0 ? '#444'
        : value === 2 ? '#333333'
            : '#ffffff';
    this.font = "bold " + size + "px Clear Sans";
}