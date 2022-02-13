class Graph {
  constructor(selector, clickHandler, width, height, padding = 31) {
    this.canvas = document.querySelector(selector);
    this.clickHandler = clickHandler;
    this.coordinates = null;
    this.width = width;
    this.height = height;
    this.ctx = this.canvas.getContext(`2d`);
    this.padding = padding;
    this.animate = window.requestAnimationFrame;
  }
  setLines(coordinates) {
    coordinates.forEach((c, i, array) => {
      let next = array[i + 1];
      if (next) {
        this.ctx.beginPath();
        this.ctx.moveTo(c.x, c.y);
        this.ctx.lineTo(next.x, next.y);
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      }
    });
  }
  setDotes(coordinates) {
    coordinates.forEach((c) => {
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, 6, 0, Math.PI * 2, true);
      this.ctx.fillStyle = "white";
      this.ctx.fill();
      this.ctx.stroke();
    });
  }
  setAxes() {
    const axisX = [
      { x: 25, y: 25 },
      { x: this.width - this.padding, y: 25 },
    ];
    const axisY = [
      { x: 0, y: 0 },
      { x: 0, y: this.height - this.padding * 2 },
    ];
    this.setLines(axisX);
    this.setLines(axisY);
  }
  transformAxes() {
    this.ctx.translate(7, this.height - 7);
    this.ctx.scale(1, -1);
  }
  setCanvasSize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  clearField() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  init() {
    this.setCanvasSize();
    this.transformAxes();
    this.setAxes();
    this.canvas.addEventListener("click", this.clickHandler);
  }
  offsetDotes(target, point1) {
    let ax, bx, ay, by;
    if (point1.x < target.x) {
      ax = point1.x;
      bx = target.x;
    } else {
      ax = target.x;
      bx = point1.x;
    }
    if (point1.y < target.y) {
      ay = point1.y;
      by = target.y;
    } else {
      ay = target.y;
      by = point1.y;
    }
    let newCX = 0;
    let newCY = 0;
    for (let i = ax; i <= bx; i++) {
      newCX = i;
    }
    for (let j = ay; j <= by; j++) {
      newCY = j;
    }
    return { x: newCX, y: newCY };
  }
  mixingDotes(oldValue, newValue) {
    const startElementOld = oldValue[0];
    const startElementNew = newValue[0];
    const endElementOld = oldValue[oldValue.length - 1];
    const endElementNew = newValue[newValue.length - 1];
    console.log(startElementOld);
    let result = this.offsetDotes(startElementOld, startElementNew);
    startElementOld.x = result.x;
    startElementOld.y = result.y;

    console.log(startElementOld);
    this.setDotes(oldValue);
    this.animate(this.mixingDotes);
    // console.log(startElementOld, startElementNew);
    // console.log(endElementOld, endElementNew);
  }
  render(coordinates) {
    if (!this.coordinates) {
      this.coordinates = coordinates;
      this.setLines(this.coordinates);
      this.setDotes(this.coordinates);
    } else {
      //this.animate(this.mixingDotes);
      this.mixingDotes(this.coordinates, coordinates);
    }
  }
}

export default Graph;
