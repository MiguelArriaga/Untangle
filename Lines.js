

class MyLine {
  constructor(ni, nj) {
    this.ni = ni;
    this.nj = nj;
    this.isGood = true;
    // this.n1 = all_dots.list[ni];
    // this.n2 = all_dots.list[nj];

    // tell neighbours
    all_dots.list[ni].neighb.push(nj);
    all_dots.list[nj].neighb.push(ni);
  }

  getLength(){
    let n1 = all_dots.list[this.ni];
    let n2 = all_dots.list[this.nj];
    return dist(n1.x,n1.y,n2.x,n2.y);
  }
  
  bump(refLegth){
    let n1 = all_dots.list[this.ni];
    let n2 = all_dots.list[this.nj];
    let dirx = n2.x - n1.x;
    let diry = n2.y - n1.y;
    
    let a=(refLegth-this.getLength());
    let forceFactor = -Math.sign(a)*Math.pow(abs(a),0.5) * FORCE_SCALE;
    // let forceFactor = -a * FORCE_SCALE;
    
    n1.x += dirx*forceFactor;
    n1.y += diry*forceFactor;
    n2.x -= dirx*forceFactor;
    n2.y -= diry*forceFactor;
  }
  
  
  draw() {
    let n1 = all_dots.list[this.ni];
    let n2 = all_dots.list[this.nj];
    let draw_scaling = 1.0/(sqrt(zoom));
    if (this.isGood) {
      stroke(lineGoodCol);
    } else {
      stroke(lineBadCol);
    }
    strokeWeight(LINE_SIZE*draw_scaling);
    line(n1.x, n1.y, n2.x, n2.y);
  }

  isCrossing(other) {

    // Common Nodes do not cross
    if ((this.ni == other.ni) || (this.ni == other.nj) ||
      (this.nj == other.ni) || (this.nj == other.nj)) {
      // console.log("Shares Node");
      return false;
    }

    // Get Nodes
    let tni = all_dots.list[this.ni];
    let tnj = all_dots.list[this.nj];
    let oni = all_dots.list[other.ni];
    let onj = all_dots.list[other.nj];

    // Xrange and Yrange do not touch
    let mintx = min(tni.x, tnj.x);
    let minty = min(tni.y, tnj.y);
    let minox = min(oni.x, onj.x);
    let minoy = min(oni.y, onj.y);
    let maxtx = max(tni.x, tnj.x);
    let maxty = max(tni.y, tnj.y);
    let maxox = max(oni.x, onj.x);
    let maxoy = max(oni.y, onj.y);

    if ((mintx > maxox) || (maxtx < minox) ||
      (minty > maxoy) || (maxty < minoy)) {
      // console.log("No Overlap");
      return false;
    }


    let dtx = tnj.x - tni.x;
    let dty = tnj.y - tni.y;
    let dox = onj.x - oni.x;
    let doy = onj.y - oni.y;

    // console.log("tni.x", tni.x);
    // console.log("tni.y", tni.y);
    // console.log("tnj.x", tnj.x);
    // console.log("tnj.y", tnj.y);
    // console.log("oni.x", oni.x);
    // console.log("oni.y", oni.y);
    // console.log("onj.x", onj.x);
    // console.log("onj.y", onj.y);

    let det = dty * dox - dtx * doy;
    if (abs(det) < width) {
      // console.log("Parallel")
      return false;
    } else {
      let dpx = oni.x - tni.x;
      let dpy = oni.y - tni.y;

      let alf = (-doy * dpx + dox * dpy) / det;
      // console.log("alpha", alf);
      if (alf < -0.01 || alf > 1.01) {
        // console.log("Not crossing (alpha)")
        return false;
      } else {
        let bet = (dpy * dtx - dpx * dty) / det;
        // console.log("beta", bet);
        if (bet < -0.01 || bet > 1.01) {
          // console.log("Not crossing (beta)")
          return false;
        } else {
          // console.log("Crossing")
          return true;
        }
      }
    }

  }

}
