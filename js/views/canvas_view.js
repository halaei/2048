function CanvasView(canvas, gridSize) {
    //set canvas
    this.canvas = canvas;
    this.context = canvas.getContext("2d");

    //set grid size
    this.gridSize = gridSize;
    this.initGrid();

    //set geometry
    this.center = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
    this.radius = this.center.x - 6;

    this.fps = 30;

    this.makeBoard();

    //set state of the game
    this.game_over = false;

    this.animations = [];

    //is set to merge hint animation with the next step event
    this.merge_hint = false;
    this.debug = false;

}

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

CanvasView.prototype.drawBoard = function () {
    var ctx = this.context;

    // Draw the main board background
    drawPolygon(ctx, this.polygons[0].vertex_list, '#bbada0', '#ffffff');

    for (var i = 1; i < this.polygons.length; i++) {
        var points = this.polygons[i].vertex_list;

        // Draw the "Cell Slot" (the recessed area)
        drawPolygon(ctx, points, '#ffffff', '#ffffff');

        // Draw the "Half-Cylinder Rail" effect on the edges
        ctx.strokeStyle = '#e0adad';
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.stroke();

        // Add a tiny highlight to the crest of the rail
        // ctx.strokeStyle = '#d6cdc4';
        // ctx.lineWidth = 1;
        // ctx.stroke();
    }
};

CanvasView.prototype.drawTiles = function () {
    var self = this;
    var polygon = this.polygons[0].vertex_list;

    // Helper functions for rotation and centers
    function axisOfRotation(grid_location, direction) {
        var d;
        var p;
        switch (direction) {
            case 0:
                d = new TD_Point(1, 0, 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - grid_location.row, grid_location.row);
                break;
            case 1:
                d = new TD_Point(Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0);
                p = interpolateLocation(polygon[1], polygon[2], self.gridSize - (grid_location.row - grid_location.rank / 2), (grid_location.row - grid_location.rank / 2));
                break;
            case 2:
                d = new TD_Point(- Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.rank + 1) / 2, (grid_location.rank + 1) / 2);
                break;
            case 3:
                d = new TD_Point(-1, 0, 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.row + 1), grid_location.row + 1);
                break;
            case 4:
                d = new TD_Point(- Math.cos(Math.PI / 3), - Math.sin(Math.PI / 3), 0);
                p = interpolateLocation(polygon[1], polygon[2], self.gridSize - (grid_location.row - (grid_location.rank - 1) / 2), (grid_location.row - (grid_location.rank - 1) / 2));
                break;
            case 5:
                d = new TD_Point(Math.cos(Math.PI / 3), - Math.sin(Math.PI / 3), 0);
                p = interpolateLocation(polygon[0], polygon[1], self.gridSize - (grid_location.rank) / 2, (grid_location.rank) / 2);
                break;
        }
        p = new TD_Point(p.x, p.y, 0);
        return new TD_Line(p, d);
    }

    var stripes = partitionToStripes(this.polygons[0].vertex_list, this.gridSize);
    var size = (stripes[1][1].x - stripes[0][1].x);
    var radius = size / Math.sqrt(3);

    function getCellCenter(row, rank) {
        if (row < 0 || row >= self.gridSize || rank < 0 || rank >= 2 * row + 1) {
            return null;
        }
        return {
            x: stripes[0][row].x + rank * size / 2,
            y: [stripes[0][row].y + radius, stripes[0][row + 1].y - radius][rank % 2]
        };
    }

    function getNextLocation(location, direction) {
        if (location.rank % 2) {
            switch (direction) {
                case 0:
                case 5:
                    return { row: location.row - 1, rank: location.rank - 1 };
                case 1:
                case 2:
                    return { row: location.row, rank: location.rank + 1 };
                case 3:
                case 4:
                    return { row: location.row, rank: location.rank - 1 };
            }
        } else {
            switch (direction) {
                case 0:
                case 1:
                    return { row: location.row, rank: location.rank + 1 };
                case 2:
                case 3:
                    return { row: location.row + 1, rank: location.rank + 1 };
                case 4:
                case 5:
                    return { row: location.row, rank: location.rank - 1 };
            }
        }
        return null;
    }

    for (var anglie_filter = 0; anglie_filter < 2; anglie_filter++) {
        for (var i = 0; i < this.gridSize; i++) {
            var n = 2 * i + 1;
            var x = stripes[0][i].x;
            var y = [
                stripes[0][i].y + radius,
                stripes[0][i + 1].y - radius
            ];
            for (var j = 0; j < n; j++) {
                if (this.grid[i][j].value) {
                    if ((anglie_filter && this.grid[i][j].angle > Math.PI / 2) ||
                        (!anglie_filter && this.grid[i][j].angle <= Math.PI / 2)) {
                        var tile_style = new TileStyle(
                            this.grid[i][j].value,
                            1
                        );

                        var triangle = makeRegularPolygon(3, radius * .85, x, y[j % 2], j % 2 ? Math.PI / 2 : - Math.PI / 2);
                        var flat_triangle = [
                            { x: triangle[0].x, y: triangle[0].y },
                            { x: triangle[1].x, y: triangle[1].y },
                            { x: triangle[2].x, y: triangle[2].y }
                        ];
                        var center = { x: x, y: y[j % 2] };
                        var textCenter = { x: center.x, y: center.y };
                        var textMatrix = [1, 0, 0, 1, 0, 0];

                        if (this.grid[i][j].angle && this.grid[i][j].move_direction !== null) {
                            var axis = axisOfRotation(new GridLocation(i, j), this.grid[i][j].move_direction);
                            triangle = rotatePolygon2D(triangle, axis.point, axis.direction, this.grid[i][j].angle);
                            textMatrix = getRotationTransform2D(axis.point, axis.direction, this.grid[i][j].angle, true);

                            if (this.grid[i][j].angle > Math.PI / 2) {
                                var nextLoc = getNextLocation(new GridLocation(i, j), this.grid[i][j].move_direction);
                                var nextCenter = nextLoc ? getCellCenter(nextLoc.row, nextLoc.rank) : null;
                                if (nextCenter) textCenter = nextCenter;
                            }
                        }

                        // 1. CALCULATE DYNAMIC LIGHTING
                        var centerX = (triangle[0].x + triangle[1].x + triangle[2].x) / 3;
                        var centerY = (triangle[0].y + triangle[1].y + triangle[2].y) / 3;

                        var lightShiftX = 0;
                        var lightShiftY = -radius * 0.1; // Default slight top-down light

                        if (this.grid[i][j].angle && this.grid[i][j].move_direction !== null) {
                            // Find the "Raised Tip" geometrically.
                            // The two vertices on the hinge hardly move. The tip moves the most.
                            var tipIndex = 0;
                            var maxDistSq = -1;
                            for (var k = 0; k < 3; k++) {
                                var dx = triangle[k].x - flat_triangle[k].x;
                                var dy = triangle[k].y - flat_triangle[k].y;
                                var distSq = dx * dx + dy * dy; // Distance squared
                                if (distSq > maxDistSq) {
                                    maxDistSq = distSq;
                                    tipIndex = k;
                                }
                            }

                            // Target the physical raised tip
                            var tipX = triangle[tipIndex].x;
                            var tipY = triangle[tipIndex].y;

                            // Get the vector from the 2D center to the 2D raised tip
                            var vecX = tipX - centerX;
                            var vecY = tipY - centerY;

                            // Shift the light along that vector based on the tilt
                            var tiltIntensity = Math.sin(this.grid[i][j].angle);

                            // 0.85 keeps the center of the glow slightly inside the tip
                            lightShiftX = vecX * tiltIntensity * 0.85;
                            lightShiftY = vecY * tiltIntensity * 0.85;
                        }

                        // 2. GRADIENT
                        var tiltIntensity = Math.sin(this.grid[i][j].angle);

                        // Calculate a "shadow" color by slightly darkening the base
                        // You could add a helper to your TileStyle or just use rgba overlay
                        var shadowOpacity = tiltIntensity * 0.4;

                        var grad = this.context.createRadialGradient(
                            centerX + lightShiftX, centerY + lightShiftY, radius * 0.05,
                            centerX, centerY, radius
                        );

                        if (this.debug) {
                            grad.addColorStop(0, '#ff0000'); // RED DEBUG HOTSPOT
                            grad.addColorStop(0.4, tile_style.colors.light);
                            grad.addColorStop(1, tile_style.colors.base);
                        } else {
                            grad.addColorStop(0, tile_style.colors.light);
                            grad.addColorStop(0.7, tile_style.colors.base);
                            grad.addColorStop(1, "rgba(0,0,0," + shadowOpacity + ")");
                        }


                        this.context.fillStyle = grad;
                        this.context.beginPath();
                        this.context.moveTo(triangle[0].x, triangle[0].y);
                        for (var k = 1; k < triangle.length; k++) {
                            this.context.lineTo(triangle[k].x, triangle[k].y);
                        }
                        this.context.closePath();
                        this.context.fillStyle = grad;
                        this.context.fill();
                        // 2. DRAW THE BORDER (Jewel Edge)
                        this.context.strokeStyle = "rgba(255, 255, 255, 0.4)";
                        this.context.lineWidth = 1.5;
                        this.context.stroke();

                        // 3. DRAW THE TEXT
                        drawTextTransformed(this.context, this.grid[i][j].value, textCenter.x, textCenter.y, tile_style.font, tile_style.font_style, textMatrix);
                    }
                }
                x += size / 2;
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

CanvasView.prototype.requestAnimationFrame = function () {
    var self = this;
    requestAnimationFrame(function () {
        self.renderAnimation();
    });
};

CanvasView.prototype.draw = function () {
    this.drawBoard();
    this.drawTiles();
};

CanvasView.prototype.gameOver = function () {
    this.game_over = true;
    console.log("game is over");
};

CanvasView.prototype.handleMoveEvent = function (event) {
    this.merge_hint = true;
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
    game.on('MoveEvent', this, this.handleMoveEvent);
    game.on('StepEvent', this, this.handleStepEvent);
    game.on('ResetEvent', this, this.handleResetEvent);
    game.on('BeginMoveHintEvent', this, this.handleBeginMoveHint);
    game.on('EndMoveHintEvent', this, this.handleEndMoveHint);
};

var TILE_PALETTE = {
    0: { base: '#f0f0f0', light: '#ffffff', shadow: '#d1d1d1' }, // White
    2: { base: '#b0b0b0', light: '#e0e0e0', shadow: '#888888' }, // DarkGray
    4: { base: '#008b8b', light: '#00b3b3', shadow: '#005f5f' }, // DarkCyan
    8: { base: '#006400', light: '#009900', shadow: '#003300' }, // DarkGreen
    16: { base: '#8b008b', light: '#b300b3', shadow: '#5f005f' }, // DarkMagenta
    32: { base: '#ff8c00', light: '#ffb347', shadow: '#cc7000' }, // DarkOrange
    64: { base: '#8b0000', light: '#b30000', shadow: '#5f0000' }, // DarkRed
    128: { base: '#4A90E2', light: '#7EBFFF', shadow: '#215999' }, // SkyBlue
    256: { base: '#00ff7f', light: '#66ffb2', shadow: '#00cc66' }, // SpringGreen
    512: { base: '#ff00ff', light: '#ff66ff', shadow: '#cc00cc' }, // Magenta
    1024: { base: '#ffa500', light: '#ffc14d', shadow: '#cc8400' }, // Orange
    2048: { base: '#ff0000', light: '#ff6666', shadow: '#cc0000' }  // Red
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