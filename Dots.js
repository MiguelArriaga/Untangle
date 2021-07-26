class MyDot {
  constructor(x0, y0) {
    this.x = x0;
    this.y = y0;
    this.radius = DOT_SIZE;
    this.dragging = false;
    this.neighb = [];
    this.nb_dragging = false;
  }

  dist(px, py) {
    return dist(px, py, this.x, this.y);
  }

  contains(px, py, inc_dist = 0) {
    if (inc_dist <= 0) {
      inc_dist = this.radius;
    }

    return (this.dist(px, py) < inc_dist);
  }

  click() {
    this.dragging = true;
    this.offsetX = this.x - wmouseX();
    this.offsetY = this.y - wmouseY();
    for (let ni of this.neighb) {
      all_dots.list[ni].nb_dragging = true;
    }
  }

  release() {
    this.dragging = false;
    for (let ni of this.neighb) {
      all_dots.list[ni].nb_dragging = false;
    }
  }

  bumpCM(xCM, yCM,dAvg) {
    let dirx = this.x - xCM;
    let diry = this.y - yCM ;
    
    let d = 3*dAvg/targetRadius; //Theo factor should be 3
    // let d = 2*dist(this.x,this.y,xCM,yCM)/min(width,height);
    let a = constrain(1-d,0.001,1);
    
    let forceFactor = a*CM_FORCE_SCALE;
    // let forceFactor = -a * FORCE_SCALE;

    this.x += dirx * forceFactor + 0.02*(xCenter - xCM);
    this.y += diry * forceFactor + 0.02*(yCenter - yCM);
  }


  draw() {
    let draw_scaling = 1.0 / (sqrt(zoom));

    let col = idleCol;
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = wmouseX() + this.offsetX;
      this.y = wmouseY() + this.offsetY;
      col = draggingCol;
    } else if (this.nb_dragging) {
      col = neighbourCol;
    }
    stroke(lineGoodCol);
    strokeWeight(1 * draw_scaling);
    fill(col);
    ellipse(this.x, this.y, this.radius * 2 * draw_scaling);
  }
}