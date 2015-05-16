
function getMousePosition(event) {
    var target = event.target;
    var rect = target.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}

function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
}