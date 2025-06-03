let player, buzz, buzz2;
let minSize = 100;
let maxSize = 600;
let maxShapeSize = 500;
let minShapeSize = 20;
let showStatic = false;
let startScreen = true;

let sliderX, sliderWidth, sliderHeight;
let dragging = false;

let shapeX1, shapeY1, shapeSize1;
let shapeX2, shapeY2, shapeSize2;

let playingSound = 0;

function preload() {
  player = loadSound('sounds/sound.mp3');
  buzz = loadSound('sounds/buzz.mp3');
  buzz2 = loadSound('sounds/buzz2.mp3');
}

function setup() {
  let cnv = createCanvas(600, 600);
  cnv.parent(document.body);
  background(0);
  noLoop();

  player.loop();

  sliderX = width / 2;
  sliderWidth = width - 100;
  sliderHeight = 20;
}

function draw() {
  background(0);

  let s = map(width, minSize, maxSize, minShapeSize, maxShapeSize);
  let shapeType = int(random(5));

  shapeX1 = random(width / 2);
  shapeY1 = random(height);
  shapeSize1 = s;

  shapeX2 = width - shapeX1;
  shapeY2 = height - shapeY1;
  shapeSize2 = s;

  fill(0);
  drawShape(shapeType, shapeX1, shapeY1, shapeSize1);
  fill(255);
  drawShape(shapeType, shapeX2, shapeY2, shapeSize2);

  if (showStatic) {
    drawStatic();
  }

  if (checkCollision()) {
    if (playingSound !== 2) {
      stopAllSounds();
      buzz2.play();
      playingSound = 2;
    }
  }

  drawSlider();
  adjustSound();
}

function drawSlider() {
  fill(150);
  rect(50, height - 40, sliderWidth, sliderHeight, 10);

  fill(255, 0, 0);
  ellipse(sliderX, height - 30, 20, 20);
}

function mousePressed() {
  if (startScreen) {
    startScreen = false;
  }

  if (dist(mouseX, mouseY, sliderX, height - 30) < 10) {
    dragging = true;
  }

  redraw();
}

function mouseDragged() {
  if (!startScreen && dragging) {
    sliderX = constrain(mouseX, 50, 50 + sliderWidth);
    let newWidth = int(map(sliderX, 50, 50 + sliderWidth, minSize, maxSize));
    resizeCanvas(newWidth, newWidth);
    showStatic = true;
    redraw();
  }
}

function mouseReleased() {
  dragging = false;
}

function adjustSound() {
  let volume = map(width, minSize, maxSize, -20, 5);
  player.setVolume(map(volume, -20, 5, 0, 1));
}

function drawShape(type, x, y, s) {
  switch (type) {
    case 0:
      ellipse(x, y, s, s);
      break;
    case 1:
      ellipse(x, y, s, s);
      rect(x - s / 2, y - s / 2, s, s);
      break;
    case 2:
      triangle(x, y - s / 2, x - s / 2, y + s / 2, x + s / 2, y + s / 2);
      break;
    case 3:
      ellipse(x, y, s * 1.5, s);
      break;
    case 4:
      rect(x, y, s * 1.5, s / 2);
      break;
  }
}

function mouseMoved() {
  let over1 = dist(mouseX, mouseY, shapeX1, shapeY1) < shapeSize1 / 2;
  let over2 = dist(mouseX, mouseY, shapeX2, shapeY2) < shapeSize2 / 2;

  if ((over1 || over2) && playingSound !== 1) {
    stopAllSounds();
    buzz.play();
    playingSound = 1;
  }
}

function stopAllSounds() {
  if (buzz.isPlaying()) buzz.stop();
  if (buzz2.isPlaying()) buzz2.stop();
  playingSound = 0;
}

function checkCollision() {
  let d = dist(shapeX1, shapeY1, shapeX2, shapeY2);
  let minD = (shapeSize1 + shapeSize2) / 2;
  return d < minD;
}

function drawStatic() {
  for (let i = 0; i < 1000; i++) {
    stroke(random(255));
    point(random(width), random(height));
  }
}
