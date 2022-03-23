class Graph {
  constructor(canvasid, min_x = 0, max_x = 1, max_y = 100,
               height_multipl = 1, persentwidth = 69, step = 10) {
    this.step = step;
    this.timeoutlist = [];
    this.MAX_X = max_x;
    this.MAX_Y = max_y;
    this.MIN_X = min_x;
    this.HEIGHT_MULTIPL = height_multipl;
    this.canvas = document.getElementById(canvasid);
    this.context = this.canvas.getContext('2d');
    //соотношение оси x к оси y
    this._PROPORTIONS = Math.round(5 / this.HEIGHT_MULTIPL);
    // ширина холста по отношению к размеру экрана
    this._WIDTHCANVAS = persentwidth / 100;
    this.size = {
      width: 0,
      height: 0,
    }
    this._setCanvasSize();

    this._OFFSET_Y_AXIS = 15; //смещение оси Y от границы холста
    this._OFFSET_X_AXIS = 15; //смещение оси X от границы холста
    this.zeroPoint = {
      x : this._OFFSET_Y_AXIS,
      y : this.size.height - this._OFFSET_X_AXIS
    }

    this._TAIL_AXIS = 10; // длинна хвостика осей
    this._INDENT_AXIS = 18; // отступ конца оси от границ холста
    this._ARROW_LENGTH = 5; // длинна стрелочки
    
    this.scale = {
      x: (this.size.height - this._OFFSET_X_AXIS - this._INDENT_AXIS - this._ARROW_LENGTH) / max_x,
      y: (this.size.width - this._OFFSET_Y_AXIS - this._INDENT_AXIS - this._ARROW_LENGTH) / max_y
    }
    this._DELAYTIME = 100;
  }

  init() {
    this._DrawAxis();
    this._DrawGrid();
  }
  
  clear() {
    this.timeoutlist.forEach((item)=> {
      clearTimeout(item);
    });
    this.timeoutlist = [];
    this.context.restore();
    this.context.clearRect(0, 0, this.size.width, this.size.height);
    this.init();
  }

  _setCanvasSize() {
    //ширина холста и соотношение сторон
    this.size.width = this.canvas.width = Math.round(window.innerWidth * this._WIDTHCANVAS);
    this.size.height = this.canvas.height = Math.round(this.size.width / this._PROPORTIONS);
    console.log(this.size);
  }

  DrawPoint(x, y) {
    //сохранить состояние и сменить точку отчета
    this.context.save();
    this.context.translate(this.zeroPoint.x, this.zeroPoint.y);
    this.context.rotate(-Math.PI/2);
    x = x * this.scale.x;
    y = y * this.scale.y;
    this.context.lineWidth = 1;
    this.context.beginPath();
      // context.moveTo(x-1,y+1);
    this.context.fillRect(x - 1,y + 1, 3, 3);
    this.context.fill();
    this.context.restore();
  }

  DrawPoints() {
    for (let i = 0; i < this.MAX_Y; i++) {
      this.timeoutlist.push(
        setTimeout(()=>{
        this.DrawPoint( this.MIN_X + (this.MAX_X - this.MIN_X) * Math.random(), i)
      }, this._DELAYTIME * i));
    }
  }

  DrawDensity(a,b) {
    console.log(a, b);
    this.context.save();
    this.context.translate(this.zeroPoint.x, this.zeroPoint.y);
    this.context.rotate(-Math.PI/2);
    this.context.strokeStyle = "red";
    let start_x = this.scale.x * (1 / (b - a));
    let start_y = this.scale.y * a;
    let end_y = this.scale.y * b;
    console.log(start_x, end_y, start_y);
    this.context.beginPath();
    this.context.moveTo(start_x, start_y);
    this.context.lineTo(start_x, end_y);
    this.context.stroke();
    this.context.save();
    this.context.rotate(Math.PI / 2);
    this.context.fillStyle = "red";
    this.context.fillText(1 / (b - a), (start_y + end_y)/2, -(start_x + 3));
    this.context.restore();
    this.context.restore();
  }
  _DrawAxis() {
    //сохранить состояние и сменить точку отчета
    this.context.save();
    this.context.translate(this.zeroPoint.x, this.zeroPoint.y);
    this.context.rotate(-Math.PI/2);
    //ось x становится осью y и наоборот.
    this.context.beginPath();
    this.context.lineWidth = 3;
    //drow zero point
    this.context.arc(0,0,2,0,Math.PI*2,true);
    // start y axis line
    this.context.moveTo(-this._TAIL_AXIS, 0);
    this.context.lineTo(this.size.height - this._INDENT_AXIS,0);
    //arrow of y axis
    this.context.lineTo(this.size.height - this._INDENT_AXIS - this._ARROW_LENGTH, -this._ARROW_LENGTH);
    this.context.moveTo(this.size.height - this._INDENT_AXIS,0);
    this.context.lineTo(this.size.height - this._INDENT_AXIS - this._ARROW_LENGTH, this._ARROW_LENGTH);
    //end y axis
    // start x axis line
    this.context.moveTo(0, -this._TAIL_AXIS);
    this.context.lineTo(0, this.size.width - this._INDENT_AXIS);
    //arrow of x axis
    this.context.lineTo(this._ARROW_LENGTH, this.size.width - this._INDENT_AXIS - this._ARROW_LENGTH);
    this.context.moveTo(0, this.size.width - this._INDENT_AXIS);
    this.context.lineTo(-this._ARROW_LENGTH, this.size.width - this._INDENT_AXIS - this._ARROW_LENGTH);
    //end x axis
    this.context.stroke()
    this.context.restore();
  }
  _DrawGrid(step=this.step) {
    //сохранить состояние и сменить точку отчета
    this.context.save();
    this.context.translate(this.zeroPoint.x, this.zeroPoint.y);
    this.context.rotate(-Math.PI/2);
    // single line parallel to axis x 
    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.setLineDash([3, 10]);
    this.context.strokeStyle = "gray"
    // this.context.scale(this.scale.x, this.scale.y);
    this.context.moveTo(this.MAX_X * this.scale.x, 0);
    this.context.lineTo(this.MAX_X * this.scale.x, this.MAX_Y * this.scale.y);
    this.context.save();
    this.context.rotate(Math.PI / 2);
    this.context.fillText(this.MAX_X, 3, - this.MAX_X * this.scale.x - 3);
    this.context.restore();
    if (this.MIN_X != 0) {
      this.context.moveTo(this.MIN_X * this.scale.x, 0);
      this.context.lineTo(this.MIN_X * this.scale.x, this.MAX_Y * this.scale.y);
      this.context.save();
      this.context.rotate(Math.PI / 2);
      this.context.fillText(this.MIN_X, 3, - this.MIN_X * this.scale.x + 10);
      this.context.restore();
    }
    //unit lines parralel to axis y
    for (let i = 1; i <= this.MAX_Y; i++) {
      this.context.moveTo(0, step * i * this.scale.y);
      this.context.lineTo(this.MAX_X * this.scale.x + 40, step * i * this.scale.y);
      this.context.save();
      this.context.rotate(Math.PI / 2);
      this.context.fillText(i * step, i * step * this.scale.y - 5, 10);
      this.context.restore();
    }
    this.context.stroke()
    //востановить состсояние
    this.context.restore();
  }

}

class getDataSet {
  constructor(selector) {
    this.min = null;
    this.max = null;
    this.counters = null;
    const inputElements = document.querySelectorAll(selector);
    inputElements.forEach((input) => {
      if (input.name === 'min') {
        this.min = parseInt(input.value);
      } else if (input.name === 'max') {
        this.max = parseInt(input.value);
      } else if (input.name === 'counters') {
        this.num_count = parseInt(input.value);
      }
    })
  }
}

window.onload = () => {
  let inputdata = new getDataSet('input[type=number]');
  let randOnOne = new Graph('graphrandom1', 0, 1, inputdata.num_count, 1);
  let randOnRange = new Graph('graphrandom2', inputdata.min, inputdata.max, inputdata.num_count, 2);
  let dansity = new Graph('graphdensity', 0, 10/(inputdata.max - inputdata.min), inputdata.max + 10, 1, 96, 50);
  randOnOne.init();
  randOnRange.init();

  dansity.init();
  dansity.DrawDensity(inputdata.min, inputdata.max);

  const btnStart = document.querySelector("#btnMakeModel");
  const btnClear = document.querySelector('#btnClear');
  const btnShow = document.querySelector('#btnShow');

  const inputfields = document.querySelectorAll('input[type=number]');
  inputfields.forEach((input) => {
    input.addEventListener('change',() => {
      inputdata = new getDataSet('input[type=number]');
      randOnOne = new Graph('graphrandom1', 0, 1, inputdata.num_count, 1);
      randOnRange = new Graph('graphrandom2', inputdata.min, inputdata.max, inputdata.num_count, 2);
      dansity = new Graph('graphdensity', 0, 10/(inputdata.max - inputdata.min), inputdata.max + 10, 1, 96, 50);
      randOnOne.init();
      randOnRange.init();
      dansity.init();
      dansity.DrawDensity(inputdata.min, inputdata.max);
    })
  });
  const savelabel = document.querySelector('input[type=checkbox]');
  const counterbox = document.querySelector('.counter');
  let counter = 0;
  btnStart.addEventListener('click',() => {
    if (savelabel.checked) {
      randOnOne.DrawPoints();
      randOnRange.DrawPoints();
      counter = counter + 1;
      counterbox.textContent = counter;
    } else {
      counter = 1;
      randOnOne.clear();
      randOnRange.clear();
      counterbox.textContent = counter;
      randOnOne.DrawPoints();
      randOnRange.DrawPoints();
    }
    btnClear.disabled = false;
    btnShow.disabled = false;
  });
  
  btnClear.addEventListener('click', () => {
    randOnOne.clear();
    randOnRange.clear();
    btnClear.disabled = true;
    btnShow.disabled = true;
    counter = 0;
    counterbox.textContent = 0;
  });
}