var song;
let x = [];
let fourierX;
let time;
let path = [];
let sliderTerms;
let sel;
let show = true;
let scl;
function preload() {song = loadSound('nowruz.mp3');}
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 2,1, 1,20);
  song.play();
  // Compute fourier coefficients with DFT
  const skip = 2;
  const size = 1/1000;
  if(windowWidth < 1400){
    scl = 0.05 * width;
  } else {
    scl = 0.04 * width;
  }
  for (let i = 0; i < drawing.length; i += skip) {
    const c = new Complex(scl * (drawing[i].x * size - 5), -scl * (drawing[i].y * size - 4));
    x.push(c);
  }
  fourierX = dft(x);
  fourierX.sort((a, b) => b.amp - a.amp);

  // Set initial potition
  time = -PI;

  //UI
  sel = createSelect();
  sel.position(windowWidth/2-300, windowHeight-72);
  sel.option('Moving');
  sel.option('Fixed');
  sel.style('font-size:15px');
  sel.changed(options);

  sliderTerms = createSlider(1, fourierX.length, 423, 1);
  sliderTerms.style('width', '400px');
  sliderTerms.position(windowWidth/2-200, windowHeight-70);
  sliderTerms.changed(clearPath);

  console.log(fourierX.length);
  // Maybe to change speed
  frameRate(20);
}

function draw() {

  background(0.8);
  translate(width / 2, height / 2);

  if (show === true) {

    // The Moving
    strokeJoin(ROUND);

    let v = Moving(0, 0, 0, fourierX, sliderTerms.value(), time);
    //I want to draw it just once
    if (-PI <= time && time <= PI + PI / 10) {
      path.unshift(v);
    }
    beginShape();
    noFill();
    strokeWeight(1);
    for (let i = 0; i < path.length; i++) {
      vertex(path[i].x, path[i].y);
    }
    endShape();




  } else {

    // The approximation curve
    strokeWeight(1);
    stroke(10);
    strokeJoin(ROUND);
    noFill();
    beginShape();
    for (let k = -180; k < 180; k+=0.5) {
      let vs = fourierSeries(fourierX, radians(k), sliderTerms.value());
      vertex(vs.x, vs.y);
    }
    endShape(CLOSE);


  }

  // Update time: two options
  const dt = 0.009;
  //const dt = TWO_PI / fourierX.length;
  time += dt;

}

// Extra functions

function options() {
  var item = sel.value();
  if (item === 'Moving') {
    clearPath();
    time = -PI;
    show = true;
  } else {
    show = false;
  }
}

function clearPath() {
  path = [];
  time = -PI;
}

function Moving(x, y, rotation, fourier, terms, t) {
  // I believe I don't need 'rotation' variable
  // I will check later :)
  for (let i = 0; i < terms; i++) {
    let prevx = x;
    let prevy = y;
    let freq = fourier[i].freq;
    let radius = fourier[i].amp;
    let phase = fourier[i].phase;

    x += radius * cos(freq * t + phase + rotation);
    y += radius * sin(freq * t + phase + rotation);


    strokeWeight(0.2);
    stroke( i*0 / fourier.length,5, 0.3);
    noFill();
    ellipse(prevx, prevy, radius * 2);
    stroke(1, 0, 50);
    line(prevx, prevy, x, y);
  }
  return createVector(x, y);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  scl = 0.003 * width;
  sliderTerms.position(windowWidth/2-200, windowHeight-70);
}
