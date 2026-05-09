function PerformanceMonitor(displayElementId) {
    this.displayElementId = displayElementId;
    this.domElement = null;
    this.frameTimestamps = [];
    this.lastLogTime = 0;
    this.isActive = false;
}

PerformanceMonitor.prototype.toggle = function(isActive) {
    this.isActive = isActive;
    if (this.isActive && !this.domElement) {
        this.domElement = document.getElementById(this.displayElementId);
    }
    this.frameTimestamps = [];
};

PerformanceMonitor.prototype.tick = function(now, isFinalFrame) {
    if (!this.isActive) return;

    this.frameTimestamps.push(now);

    // The Rolling Window: Remove any timestamps older than 1000ms from 'now'
    while (this.frameTimestamps.length > 0 && this.frameTimestamps[0] <= now - 1000) {
        this.frameTimestamps.shift();
    }

    // Log if 1 second has passed, OR if the animation sequence just finished
    if (now - this.lastLogTime >= 1000 || isFinalFrame) {
        this.calculateAndLog(isFinalFrame);
        this.lastLogTime = now;
        
        if (isFinalFrame) {
            this.frameTimestamps = []; // Reset for the next movement burst
        }
    }
};

PerformanceMonitor.prototype.calculateAndLog = function(isFinalFrame) {
    if (this.frameTimestamps.length < 2) return;

    var maxDelta = 0;
    var totalTime = this.frameTimestamps[this.frameTimestamps.length - 1] - this.frameTimestamps[0];
    
    // Find the longest gap between any two consecutive frames in the window
    for (var i = 1; i < this.frameTimestamps.length; i++) {
        var delta = this.frameTimestamps[i] - this.frameTimestamps[i - 1];
        if (delta > maxDelta) {
            maxDelta = delta;
        }
    }

    // Calculate realized FPS based on the actual time elapsed in the window
    var realizedFPS = Math.round((this.frameTimestamps.length / totalTime) * 1000);
    var formattedMaxDelta = Math.round(maxDelta);

    var label = isFinalFrame ? "Burst" : "Rolling";
    var text = label + ": " + realizedFPS + " FPS | Max Gap: " + formattedMaxDelta + "ms";

    // Color code the console: Green if max gap is under 20ms (smooth), Red if over 33ms (jank)
    var color = maxDelta > 33 ? "#E74C3C" : (maxDelta <= 20 ? "#27AE60" : "#F39C12");
    console.log("%c " + text, "color: " + color + "; font-weight: bold;");

    if (this.domElement) {
        this.domElement.innerText = text;
        this.domElement.style.color = color; // Give visual feedback on the screen too!
    }
};