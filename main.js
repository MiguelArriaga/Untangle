// new Q5("global"); //initialize q5
p5.disableFriendlyErrors = true; // disables FES
// Settings
let CLOSE_ENOUGH;
let DOT_SIZE;
let LINE_SIZE;
let FORCE_SCALE = 0.0005;
let CM_FORCE_SCALE = 0.25;
let TARGET_LENGTH = 20;

// Game options
let targN = 35; //21; // Target number of dots (actual number >= N due to algorithm)
let easyMode = false; // Shows crossing lines in red
let darkMode = true; // Dark mode color scheme


// Colors
let backgroundCol;
let idleCol;
let draggingCol;
let neighbourCol;
let lineGoodCol;
let lineBadCol;

// Global variables
let all_dots;
let all_lines;
let NDots;
let NLines;

let dragging = false;
let solvedPuzzle = false;
let showEnd = true;
let touchesDist = 0;
let zoom0;
let bumpLines = false;

let buttons = {};

let xCM;
let yCM;
let minWidthHeight;
let targetRadius;


// Set-up Function
function setup() {
  // Initialize Canvas
  // createCanvas(1080/3,(1920-510)/3);
  // createCanvas(displayWidth, displayHeight);
  createCanvas(floor(windowWidth), floor(windowHeight));
  DOT_SIZE = min(width, height) / 80; //4
  CLOSE_ENOUGH = DOT_SIZE * 7; //20
  LINE_SIZE = DOT_SIZE * 0.3; //1.2
  TARGET_LENGTH = DOT_SIZE * 10;
  minWidthHeight = min(width,height);
  setColors();

  // UI Initalize
  buttons["Play Again"] = new CanvasButton('Play Again', startGame);

  buttons["Easy Mode"] = new CanvasButton('Easy Mode', swichtEasyMode);
  buttons["Dark Mode"] = new CanvasButton('Light Mode', swichtDarkMode);
  buttons["Recenter"] = new CanvasButton('Recenter', centerScreen);

  buttons["Restart"] = new CanvasButton('Restart', startGame);
  buttons["Flow"] = new CanvasButton('Flow', switchBumpMode);
  buttons["Flow"].isActive = true;

  startGame();
}

function startGame() {
  buttons["Play Again"].isActive = false;
  solvedPuzzle = false;
  showEnd = true;
  generateGrid(targN, shuffle_points = true);
  while (targN>3 && all_lines.check_status(easyMode)) {
    // Small puzzels sometimes appear solved ()
      generateGrid(targN, shuffle_points = true);
    };
  
  centerScreen();
  buttons["Flow"].txt = "Flow";
  bumpLines = false;
  
  targetRadius = 1.5*TARGET_LENGTH*sqrt(NDots);
  
  }


  // Draw Function
  function draw() {
    // let start = millis();
    zoomPan();
    // start = printDelta(start,"zoom/pan")

    // Fill Background
    background(backgroundCol);
    // start = printDelta(start,"fill background")

    // Update the line colors in easy mode
    if (easyMode && dragging) {
      all_lines.check_status(easyMode);
    }
    // start = printDelta(start,"easy mode check status")

    // Bump lines when game ends or user requests
    if (bumpLines) {
      all_lines.bump();
      all_dots.bumpCM();
    }
    // start = printDelta(start,"bump")

    // Show the lines and dots
    all_lines.draw();
    // start = printDelta(start,"draw lines")

    all_dots.draw();
    // start = printDelta(start,"draw dots")

    // // Like KeyPressed() but for holding (has weird bugs)
    // if (keyIsPressed===true) {
    //   myKeyDown();
    // }

    // UI for end game (Board is checked when user releases the mouse/finger)
    if (solvedPuzzle) {
      if (showEnd) {
        endGame();
      } else {
        buttons["Play Again"].isActive = false;
      }
    }
    // start = printDelta(start,"solved")

    let bW = minWidthHeight / 5;
    let bH = bW / 4;
    let db = 10;
    buttons["Easy Mode"].updateProperties(wx(bW / 2 + db), wy(bH / 2 + db), bW / zoom, bH / zoom, backgroundCol, lineGoodCol);
    buttons["Dark Mode"].updateProperties(wx(3 * (bW / 2 + db)), wy(bH / 2 + db), bW / zoom, bH / zoom, backgroundCol, lineGoodCol);
    buttons["Recenter"].updateProperties(wx(5 * (bW / 2 + db)), wy(bH / 2 + db), bW / zoom, bH / zoom, backgroundCol, lineGoodCol);
    buttons["Restart"].updateProperties(wx(width - (bW / 2 + db)), wy(bH / 2 + db), 3 * bH / zoom, bH / zoom, backgroundCol, lineGoodCol);
    buttons["Flow"].updateProperties(wx(bW / 2 + db), wy(3 * (bH / 2 + db)), bW / zoom, bH / zoom, backgroundCol, lineGoodCol);
    // start = printDelta(start,"button set-up")

    for (var btnk in buttons) {
      buttons[btnk].draw(wmouseX(), wmouseY());
    }
    // start = printDelta(start,"button show")

    // // debug circle
    // stroke(0, 255, 0);
    // strokeWeight(1);
    // fill(0, 255, 0);
    // ellipse(wmouseX(), wmouseY(), 10 / zoom);
    // debug circle
    // noStroke();
    // fill(255, 0, 0);
    // ellipse(xCM, yCM, 10 / zoom);
    // fill(0, 255, 0);
    // ellipse(xCenter, yCenter, 10 / zoom);

  }

  // function printDelta(start,message){
  //   elapsed = millis()-start;
  //   console.log(message + " took: " + elapsed + "ms.");
  //   return millis();
  // }



  function endGame() {
    fill(lineGoodCol);
    noStroke();
    textSize(width / (10 * zoom));
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text('You Won', xCenter, yCenter);

    buttons["Play Again"].updateProperties(xCenter, yCenter + width / (10 * zoom), width / (4 * zoom), width / (15 * zoom), backgroundCol, lineGoodCol);
    buttons["Play Again"].isActive = true;

    // Prize for winning is the Flow button
    buttons["Flow"].isActive = true;
    buttons["Flow"].txt = "Stop Flow";
    bumpLines = true;
  }



  // function myKeyDown() {
  //   if (key == 'c') {
  //     centerScreen();
  //   }
  //   if (key == 'b') {
  //     all_lines.bump();
  //   }
  // }

  function touchStarted() {
    mousePressed();
    return false;
  }

  function touchEnded() {
    mouseReleased();
    return false;
  }

  function touchMoved() {
    if (touches.length === 2 && touchesDist > 0) {
      let newdist = dist(touches[0].x, touches[0].y, touches[1].x, touches[1].y);
      zoomAbsEvent(touchesDist - newdist);
    }
    return false;
  }


  // Mouse-press Function
  function mousePressed() {
    if (mouseButton === CENTER || touches.length === 2) {
      startPan();
      if (touches.length === 2) {
        touchesDist = dist(touches[0].x, touches[0].y,
          touches[1].x, touches[1].y);
        zoom0 = zoom;
      }
    }

    if (mouseButton === LEFT || touches.length == 1) {
      // Interact with UI
      for (var btnk in buttons) {
        buttons[btnk].possibleClickDown(wmouseX(), wmouseY());
      }


      // Drag Nodes
      dragging = true;
      let closestdistance = Infinity;
      let closestDot = null;
      for (let dot of all_dots.list) {
        let dotDist = dot.dist(wmouseX(), wmouseY());
        if (dotDist < closestdistance) {
          closestdistance = dotDist;
          closestDot = dot;
        }
      }
      if (closestDot) {
        if (closestDot.contains(wmouseX(), wmouseY(), CLOSE_ENOUGH / zoom)) {
          closestDot.click();
        }
      }
    }
    return false;
  }

  function mouseReleased() {
    if (mouseButton === CENTER || touches.length < 2) {
      endPan();
    }

    if (mouseButton === LEFT || touches.length == 0) {
      // Interact with UI
      for (var btnk in buttons) {
        if (buttons[btnk].isClickUp(wmouseX(), wmouseY())) {
          buttons[btnk].click();
        }
      }

      dragging = false;
      all_dots.release();
      if (solvedPuzzle) {
        showEnd = false;
      }
      solvedPuzzle = all_lines.check_status(easyMode);
    }
    return false;
  }

  function mouseWheel(event) {
    zoomRelEvent(event.delta);
    return false;
  }



  function swichtEasyMode() {
    if (easyMode) {
      buttons["Easy Mode"].txt = "Easy Mode";
      easyMode = false;
    } else {
      buttons["Easy Mode"].txt = "Normal Mode";
      easyMode = true;
    }
    all_lines.check_status(easyMode);
  }

  function swichtDarkMode() {
    if (darkMode) {
      buttons["Dark Mode"].txt = "Dark Mode";
      darkMode = false;
    } else {
      buttons["Dark Mode"].txt = "Light Mode";
      darkMode = true;
    }
    setColors();
  }


  function switchBumpMode() {
    if (bumpLines) {
      buttons["Flow"].txt = "Flow";
      bumpLines = false;
    } else {
      buttons["Flow"].txt = "Stop Flow";
      bumpLines = true;
    }
  }



  function setColors() {
    // Define colors
    if (darkMode) {
      backgroundCol = color(20, 200);
      idleCol = color(0, 120, 180);
      draggingCol = color(240, 200);
      neighbourCol = color(190, 50, 10);
      lineGoodCol = color(255, 200);
      lineBadCol = color(150, 10, 10, 200);
    } else {
      backgroundCol = color(255, 200);
      idleCol = color(0, 120, 180);
      draggingCol = color(20, 200);
      neighbourCol = color(190, 50, 10);
      lineGoodCol = color(20, 200);
      lineBadCol = color(245, 100, 100, 200);
    }
  }