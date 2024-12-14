// general variables
const cube_l = 50;
const cube_dist = 170;
const asta_l = 12;

const n_cubes = 16;

// fog
let currentPenPos;

let realColor;
let realStroke;
let fogColor;
let fogStroke;

// camera control
let mouse_was_pressed = false;
let starting_mouse_coords;
let angleX = 0.5;
let angleY = 2.1;
const sensitivity = 0.001;

let playerPos;
let playerSpeed = 5;

function setup() {
  createCanvas(500, 500, WEBGL);
  cam = createCamera();
  cam.setPosition(0, 0, 0);

  realColor = color(40);
  realStroke = color(255);
  fogColor = color(240);
  fogStroke = color(240);

  playerPos = createVector(60, 0, 50);

  strokeWeight(0.5);
}

function draw() {
  background(fogColor);

  perspective(0.6, 1, 0.1, 10000);
  
  // camera control
  if (mouseIsPressed && mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
    if (!mouse_was_pressed) { // activate on click
      starting_mouse_coords = createVector(mouseX, mouseY);
      mouse_was_pressed = true;
    }
    camLookAt(angleX - (mouseY - starting_mouse_coords.y) * sensitivity, angleY + (mouseX - starting_mouse_coords.x) * sensitivity);
  } else {
    if (!mouse_was_pressed) {
      camLookAt(angleX, angleY);
    } else { // activate on release click
      angleX -= (mouseY - starting_mouse_coords.y) * sensitivity;
      angleY += (mouseX - starting_mouse_coords.x) * sensitivity;
      mouse_was_pressed = false;
    }
  }
  // player control

  if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
    playerPos.x -= playerSpeed;
  }
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    playerPos.z -= playerSpeed;
  }  
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    playerPos.z += playerSpeed;
  }
  if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
    playerPos.x += playerSpeed;
  }
  if (keyIsDown(32)) {
    playerPos.y += playerSpeed;
  }
  if (keyIsDown(16)) {
    playerPos.y -= playerSpeed;
  }
  

  currentPenPos = createVector(0, 0, 0);
  // offset per non essere al centro di un cubo
  ciao(cube_l+cube_dist + playerPos.x, cube_l+cube_dist + playerPos.y, cube_l+cube_dist + playerPos.z);

  // costruzione griglia
  ciao(-n_cubes*(cube_l+cube_dist)/2, -n_cubes*(cube_l+cube_dist)/2, -n_cubes*(cube_l+cube_dist)/2);
  for (let z = 0; z<n_cubes; z++) {
    for (let y = 0; y < n_cubes; y++) {
      for (let x = 0; x < n_cubes; x++) {
        fog(currentPenPos.mag());
        box(cube_l);

        ciao(0, (cube_l+cube_dist)/2, 0);
        fog(currentPenPos.mag());
        box(asta_l, cube_dist, asta_l);

        ciao(0, -(cube_l+cube_dist)/2, (cube_l+cube_dist)/2);
        fog(currentPenPos.mag());
        box(asta_l, asta_l, cube_dist);

        ciao((cube_l+cube_dist)/2, 0, -(cube_l+cube_dist)/2);
        fog(currentPenPos.mag());
        box(cube_dist, asta_l, asta_l);

        ciao((cube_l+cube_dist)/2, 0, 0);
      }
      ciao(-(cube_l+cube_dist)*n_cubes, cube_dist+cube_l, 0);
    }
    ciao(0, -(cube_l+cube_dist)*n_cubes, cube_dist+cube_l);
  }
}

function camLookAt(angleX, angleY){
  cam.lookAt(500 * sin(angleY), 500 * sin(angleX), 500 * cos(angleX) * cos(angleY));
}

const no_fog_radius = 900;
const all_fog_radius = 2500;

function fog(dist){
  if(dist < no_fog_radius){
    fill(realColor);
    stroke(realStroke);
    return;
  }
  if(dist < all_fog_radius){
    fill(lerpColor(realColor, fogColor, map(dist, no_fog_radius, all_fog_radius, 0, 1)));
    stroke(lerpColor(realStroke, fogStroke, map(dist, no_fog_radius, all_fog_radius, 0, 1)));
    return;
  }
  fill(fogColor);
  stroke(fogStroke);
  return;
}

function ciao(x, y, z) {
  translate(x, y, z);
  v = createVector(x, y, z);
  currentPenPos.add(v);
}