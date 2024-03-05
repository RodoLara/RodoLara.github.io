document.getElementById("cleansand").style.display = "none";

function make2DArray(cols, rows){
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++){
        arr[i] = new Array(rows);
        for (let j = 0; j < arr[i].length; j++){
            arr[i][j] = 0;
        }
    }
    return arr;
}

let test;
let grid;
let velocityGrid;
let w = 5;
let cols, rows;
let hueValue = 200;
let gravity = 0.1;

function withinCols(i){
    return i >= 0 && i <= cols - 1;
}

function withinRows(j){
    return j >= 0 && j <= rows - 1;
}

function setup() {
    let canvasWidth = windowWidth;
    let canvasHeight = windowHeight - document.querySelector('header').offsetHeight;
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvasContainer')
    colorMode(HSB, 360, 255, 255);
    cols = floor(width / w);
    rows = floor(height / w);
    grid = make2DArray(cols, rows);
    velocityGrid = make2DArray(cols, rows);
}

function mouseDragged(){}

function draw() {
    background(0);
    

    if (mouseIsPressed) {
        let mouseCol = floor(mouseX / w);
        let mouseRow = floor(mouseY / w);

        let matrix = 5;
        let extent = floor(matrix / 2);
        for (let i = -extent; i <= extent; i++) {
            for (let j = -extent; j <= extent; j++) {
                if (random(1) < 0.75) {
                    let col = mouseCol + i;
                    let row = mouseRow + j;
                    if (withinCols(col) && withinRows(row)) {
                        grid[col][row] = hueValue;
                        
                        velocityGrid[col][row] = 1;
                    }
                }   
            }
        }
    
        hueValue += 0.8;
        if (hueValue > 360) {
            hueValue = 1;
        }
    }
  

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            noStroke();
            if (grid[i][j] > 0) {
                fill(grid[i][j], 140, 255);
                let x = i * w;
                let y = j * w;
                square(x, y, w);
            }
        }
    }
  
    let nextGrid = make2DArray(cols, rows);
    let nextVelocityGrid = make2DArray(cols, rows);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
        
            let state = grid[i][j];
            let velocity = velocityGrid[i][j];
            let moved = false;
            if (state > 0) {
                let newPos = int(j + velocity);
                for (let y = newPos; y > j; y--) {
                    let below = grid[i][y];
                    let dir = 1;
                    if (random(1) < 0.5) {
                        dir *= -1;
                    }
                    let belowA = -1;
                    let belowB = -1;
                    if (withinCols(i + dir)) belowA = grid[i + dir][y];
                    if (withinCols(i - dir)) belowB = grid[i - dir][y];
  
                    if (below === 0) {
                        nextGrid[i][y] = state;
                        nextVelocityGrid[i][y] = velocity + gravity;
                        moved = true;
                        break;
                    } else if (belowA === 0) {
                        nextGrid[i + dir][y] = state;
                        nextVelocityGrid[i + dir][y] = velocity + gravity;
                        moved = true;
                        break;
                    } else if (belowB === 0) {
                        nextGrid[i - dir][y] = state;
                        nextVelocityGrid[i - dir][y] = velocity + gravity;
                        moved = true;
                        break;
                    }
                }
            }
  
            if (state > 0 && !moved) {
                document.getElementById("cleansand").style.display = "inline";
                nextGrid[i][j] = grid[i][j];
                nextVelocityGrid[i][j] = velocityGrid[i][j] + gravity;
            }
        }
    }
    grid = nextGrid;
    velocityGrid = nextVelocityGrid;
}

document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
      var greetings1 = document.getElementById("greetings1");
      greetings1.style.opacity = "1";
      greetings1.style.top = "0";
    }, 1000);
    setTimeout(function() {
        var greetings2 = document.getElementById("greetings2");
        greetings2.style.opacity = "1";
        greetings2.style.top = "0";
      }, 2000);
    setTimeout(function() {
      var greetings3 = document.getElementById("greetings3");
      greetings3.style.opacity = "1";
      greetings3.style.top = "0";
    }, 3000);
    setTimeout(function() {
        greetings3.style.opacity = "0";
        greetings3.style.top = "-50px";
      }, 10000);
    setTimeout(function() {
        greetings2.style.opacity = "0";
        greetings2.style.top = "-50px";
    }, 9000);
    setTimeout(function() {
        greetings1.style.opacity = "0";
        greetings1.style.top = "-50px";
    }, 8000);
    
  });
