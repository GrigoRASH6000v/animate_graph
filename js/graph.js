import cloneDeep from './cloneDeep.js';
class Graph {
  constructor(selector, width, height, totalDotes = 8, padding = 30) {
    this.canvas = document.querySelector(selector);
    this.totalDotes = totalDotes;
    this.coordinates = null;
    this.newCoordinates = null;
    this.width = width;
    this.height = height;
    this.ctx = this.canvas.getContext(`2d`);
    this.padding = padding;
    this.toggle = false;
  }
  cloneDeep(array) {
    return array.map(el => cloneDeep(el));
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
  getRandomInt(min, max) {
    let res = Math.floor(Math.random() * max);
    if (res < min) {
      return this.getRandomInt(min, max);
    }
    return res;
  }
  createDotes() {
    let array = new Array(this.totalDotes).fill();
    const interval = Math.round(
      (this.width - this.padding * 4) / (this.totalDotes - 1)
    );
    return array.map((d, i) => {
      return {
        x: interval * i + this.padding * 2,
        y: this.getRandomInt(this.padding * 2, this.height - this.padding),
      };
    });
  }
  setDotes(coordinates) {
    coordinates.forEach(c => {
      this.ctx.beginPath();
      this.ctx.arc(c.x, c.y, 6, 0, Math.PI * 2, true);
      this.ctx.fillStyle = 'white';
      this.ctx.fill();
      this.ctx.stroke();
    });
  }
  setAxes() {
    const axisX = [
      { x: this.padding, y: this.padding },
      { x: this.width - this.padding, y: this.padding },
    ];
    const axisY = [
      { x: this.padding, y: this.padding },
      { x: this.padding, y: this.height - this.padding },
    ];
    this.setLines(axisX);
    this.setLines(axisY);
  }
  transformAxes() {
    this.ctx.translate(0, this.height - 0);
    this.ctx.scale(1, -1);
  }
  setCanvasSize() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }
  clearField() {
    this.ctx.clearRect(
      this.padding + 1,
      this.padding + 1,
      this.width - this.padding,
      this.height - this.padding
    );
  }
  clickHandler() {
    if (!this.toggle) {
      this.totalDotes = (this.totalDotes - 2) / 2 + 2;
      this.mixingDotes(this.cloneDeep(this.coordinates), this.createDotes());
      this.toggle = !this.toggle;
    } else {
      this.totalDotes = (this.totalDotes - 2) * 2 + 2;
      this.mixingDotes(this.cloneDeep(this.newCoordinates), this.coordinates);
      this.toggle = !this.toggle;
    }
  }
  render() {
    this.clearField();
    this.setLines(this.coordinates);
    this.setDotes(this.coordinates);
  }
  init() {
    this.setCanvasSize();
    this.transformAxes();
    this.setAxes();
    this.coordinates = this.createDotes();
    this.render();
    this.canvas.addEventListener('click', () => this.clickHandler());
  }
  offsetDotes(target, point1) {
    let status = true;
    if (point1.x < target.x) {
      point1.x += 1;
    } else if (point1.x > target.x) {
      point1.x -= 1;
    }
    if (point1.y < target.y) {
      point1.y += 1;
    } else if (point1.y > target.y) {
      point1.y -= 1;
    }
    if (point1.x === target.x && point1.y === target.y) status = false;
    return status;
  }
  mixingDotes(oldValue, newValue) {
    let results = [];
    this.clearField();
    for (let i = 0; i < newValue.length; i++) {
      let result;
      if (newValue.length !== oldValue.length) {
        let indexPoint1 = i * 2;
        let indexPoint2 = indexPoint1 - 1;
        let point1 = oldValue[indexPoint1];
        let point2 = oldValue[indexPoint2];
        if (indexPoint1 < oldValue.length) {
          result = this.offsetDotes(newValue[i], point1);
          results.push(result);
        }
        if (indexPoint2 > 0) {
          result = this.offsetDotes(newValue[i], point2);
          results.push(result);
        }
      } else {
        result = this.offsetDotes(newValue[i], oldValue[i]);
        results.push(result);
      }
    }
    this.setLines(oldValue);
    this.setDotes(oldValue);
    let resultCheck = results.every(r => !r);
    if (!resultCheck) {
      return setTimeout(() => this.mixingDotes(oldValue, newValue));
    }
    this.newCoordinates = oldValue;
  }
}

export default Graph;
