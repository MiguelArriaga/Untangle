class Objects {
  constructor() {
    this.list = [];
  }

  release() {
    for (let ob of this.list) {
      ob.release();
    }
  }

  setRefLength(){
    let totalL = 0;

    for (let i = 0; i < this.list.length; i++) {
      totalL += this.list[i].getLength();
    }
    
    TARGET_LENGTH = totalL/this.list.length;
  }
  
  bumpCM(){
    let xTotal =0;
    let yTotal =0;
    
    // Get CM
    for (let i = 0; i < this.list.length; i++) {
      xTotal += this.list[i].x;
      yTotal += this.list[i].y;
    }
    
    xCM = xTotal/this.list.length;
    yCM = yTotal/this.list.length;
    
    // Get Avg distance
    let dAvg = 0
    for (let i = 0; i < this.list.length; i++) {
      dAvg += dist(this.list[i].x,this.list[i].y,xCM,yCM);
    }
    dAvg = dAvg/this.list.length;

    
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].bumpCM(xCM,yCM,dAvg);
    }
    
  }
  
  bump() {
    for (let i = 0; i < this.list.length; i++) {
      this.list[i].bump(TARGET_LENGTH);
    }
  }

  check_status(isEasyMode) {
    let isSolved = true;
    for (let lin of this.list) {
      lin.isGood = true;
    }

    for (let i = 0; i < this.list.length - 1; i++) {
      for (let j = i + 1; j < this.list.length; j++) {
        // console.log("i" + str(i) + ", j" + str(j));
        if (this.list[i].isCrossing(this.list[j])) {
          // console.log("is crossing");
          if (isEasyMode) {
            this.list[i].isGood = false;
            this.list[j].isGood = false;
          }
          isSolved = false;
        }
      }
    }
    return isSolved;
  }

  draw() {
    for (let ob of this.list) {
      ob.draw();
    }
  }

}