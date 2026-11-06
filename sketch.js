let catchSound = new Audio('hit.mp3');
let levelSound = new Audio('levelup.mp3');
let overSound = new Audio('over.mp3');

let stars = [];
let i;
let s;

let state = 'start';
let skele = null;
let caught = 0;
let goal = 10;
let level = 1;
let showTime = 2000;
let gap = 600
let nextSpawn = 0;
let levelTime = 40;
let levelStart = 0;
let timeLeft = 40;




function setup() {

  createCanvas(960, 540);
  for (i = 0; i < 30; i++) {
    stars.push({ x: random(0, 960), y: random(0, 240), w: random(5, 10), h: random(5, 10) });
  }
}

function draw() {
  background(0, 0, 0);
  noStroke();

  //stars
  fill(255);
  for (s of stars) {
    ellipse(s.x, s.y, s.w, s.h);
  }

  //moon
  fill(156, 3, 0)
  ellipse(880, 80, 100)
  fill(212, 4, 0);
  ellipse(884, 76, 88);
  

  //ground
  fill(84, 68, 7);
  rect(0, 240, 960, 300);

  if (skele !== null && skele.y === 260) drawSkele(skele.x, skeleUp(skele), skele.golden);

  //tombs 
  drawTomb(80, 260);
  drawTomb(240, 260);
  drawTomb(400, 260);
  drawTomb(560, 260);
  drawTomb(720, 260);
  drawTomb(880, 260);


  if (skele !== null && skele.y === 410) drawSkele(skele.x, skeleUp(skele), skele.golden);
  
  drawTomb(80, 410);
  drawTomb(240, 410);
  drawTomb(400, 410);
  drawTomb(560, 410);
  drawTomb(720, 410);
  drawTomb(880, 410);




  if (state === 'play') {
    timeLeft = max(0, levelTime - (millis() - levelStart) / 1000)

    if (skele === null && millis() > nextSpawn) {
      skele = {x: 80 + floor(random(6)) * 160, y: random([260, 410]), startTime: millis(), golden: random() < 0.1}
    };

    if (skele !== null && millis() - skele.startTime > showTime) {
      skele = null
      nextSpawn = millis() + gap;
    }

    if (caught >= goal) { 
      state = 'levelup';
      levelSound.currentTime = 0;
      levelSound.play();
    } 
    else if (timeLeft === 0) {
      state = 'over'
      overSound.currentTime = 0;
      overSound.play();
    }
  }


  
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text('level ' + level + '   caught: ' + caught + '/' + goal, 12, 10);
  textAlign(RIGHT, TOP);
  text('time: ' + ceil(timeLeft), width - 12, 10);


  if (state !== 'play') {
  fill(0, 0, 0, 170);
  rect(0, 0, 960, 540);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(28);
  if (state === 'start') {
    textSize(70)
    textFont('Times New Roman')
    textStyle(BOLD)
    fill(212, 4, 0)
    text('SKELETON SMASH', 960 / 2, (540 / 2) - 140);

    textSize(20)
    textFont('Georgia')
    textStyle(ITALIC)
    fill(255)
    text('Catch the skeletons before time runs out!', 960 /2, (540/2) - 80)
    textStyle(NORMAL)
    text('Golden skeletons count as 5', 960 /2, (540/2) - 50)

    textFont('Courier New')
    textSize(25)
    text('click to start', 960 /2, (540/2) + 20)
  }
  if (state === 'levelup') text('Level ' + level + ' complete!\nclick for next level', 960 / 2, 540 / 2);
  if (state === 'over') text("Time up!\nyou caught " + caught + '/' + goal + '\nclick to retry', 960 / 2, 540 / 2);
  }



  //mouse thingy
  //rmove later
  noStroke();
  fill(255);
  textSize(12);
  text(mouseX + ', ' + mouseY, mouseX + 15, mouseY + 15);
}

function drawSkele(x, y, gold) {

  let r = 255
  let g = 255
  let b = 255;

  if (gold) {
    g = 247
    b = 125
  }
  
  fill(r, g, b)
  noStroke()
  ellipse(x, y, 50, 55)
  rect(x - 5, y + 25, 10, 60)
  rect(x - 17.5, y + 35, 35, 4)
  rect(x - 20, y + 45, 40, 4)
  rect(x - 22.5, y + 55, 45, 4)
  rect(x - 25, y + 65, 50, 4)
  stroke(r, g, b)
  strokeWeight(6)
  line(x, y + 85, x + 25, y + 115)
  line(x, y + 85, x - 25, y + 115)
  noStroke()
  fill(15, 10, 25)
  ellipse(x + 10, y - 5, 12, 10)
  ellipse(x - 10, y - 5, 12, 10)
  
}

function drawTomb(x, y) {
  fill(122, 122, 120)
  quad(x - 30, y, x + 30, y, x+ 40, y+ 70, x - 40, y + 70)
  fill(182, 184, 178)
  rect(x +30, y, -60, -30)
  ellipse(x, y - 30, 60)
}

function startLevel() {
  state = 'play';
  caught = 0;
  skele = null;
  levelStart = millis();
  nextSpawn = millis() + gap
  
}

function skeleUp(meow) {
  let t = min(1, (millis() - meow.startTime) / 300)
  return lerp(meow.y, meow.y - 120, t)
}


function mousePressed() {
  if (state === 'start') {
    startLevel()
    return;
  }
  if (state === 'levelup') {
    level++;
    showTime = showTime * 0.7
    goal += 2;
    startLevel()
    return;
  }
  if (state === 'over') {
    level = 1
    showTime = 2000
    goal = 10;
    startLevel();
    return;
  }

  if (skele === null) return;
  if (dist(mouseX, mouseY, skele.x, skeleUp(skele) + 18) < 50) {
    catchSound.currentTime = 0;
    catchSound.play()
    if (skele.golden) 
      caught += 5;
    else
    caught++;
    skele = null
    nextSpawn = millis() + gap;
    
  }

  
}

