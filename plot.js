// plot.js

// Axis object
function Axis(id, min, max, step, stepType, color, scale) {
   this.id = id;
   this.min = min;
   this.max = max;
   this.step = step;
   this.stepType = stepType;  // abs, num
   this.color = color;
   this.scale = scale;        // log, linear
}

// Plot object
function Plot(canvasID, coordCanvas, axes, image, title, grid) {
   this.canvas = document.getElementById(canvasID);
   this.coordCanvas = document.getElementById(coordCanvas);
   this.context = this.canvas.getContext('2d');
   this.coordContext = this.coordCanvas.getContext('2d');
   this.axes = axes;       // array of 2 Axis objects, ordered
   this.image = image;     // source (address or dataURL)
   this.title = title;
   this.grid = grid;       // Boolean
   this.tickSize = 10;

   // Axis range in coordinate units
   this.range = [this.axes[0].max - this.axes[0].min,
                 this.axes[1].max - this.axes[1].min];

   // Number of pixels per coordinate unit
   this.pixelsPerUnit = [this.canvas.width / this.range[0],
                         this.canvas.height / this.range[1]];

   // Central pixel location
   this.centerPixel = [Math.round(Math.abs(this.axes[0].min / this.range[0]) * this.canvas.width),
                       Math.round(Math.abs(this.axes[1].min / this.range[1]) * this.canvas.height)];

   // Draw axes
   this.drawAxes();

   // Draw grid
   if (this.grid) {
      this.drawGrid();
   }

   console.log('initialized plot.')
}

Plot.prototype.drawAxes = function() {
   var context = this.coordContext;
   var incr, pos;

   // Draw horizontal axis
   context.beginPath();
   context.moveTo(0, this.centerPixel[1]);
   context.lineTo(this.canvas.width, this.centerPixel[1]);
   context.strokeStyle = "#000000";
   context.lineWidth = 1;
   context.stroke();

   // Draw horizontal axis tick marks
   if (this.axes[0].stepType == 'abs') {
      incr = this.pixelsPerUnit[0] * this.axes[0].step;
   } else if (this.axes[0].stepType == 'num') {
      incr = this.pixelsPerUnit[0] * (this.range[0] / this.axes[0].step);
   }

   pos = this.centerPixel[0] - incr;
   while (pos > 0) {
      context.beginPath();
      context.moveTo(pos, this.centerPixel[1] - this.tickSize / 2);
      context.lineTo(pos, this.centerPixel[1] + this.tickSize / 2);
      context.stroke();
      pos = Math.round(pos - incr);
   }

   pos = this.centerPixel[0] + incr;
   while (pos < this.canvas.width) {
      context.beginPath();
      context.moveTo(pos, this.centerPixel[1] - this.tickSize / 2);
      context.lineTo(pos, this.centerPixel[1] + this.tickSize / 2);
      context.stroke();
      pos = Math.round(pos + incr);
   }

   // Draw vertical axis
   context.beginPath();
   context.moveTo(this.centerPixel[0], 0);
   context.lineTo(this.centerPixel[0], this.canvas.height);
   context.strokeStyle = "#000000";
   context.lineWidth = 1;
   context.stroke();

   // Draw vertical axis tick marks
   if (this.axes[1].stepType == 'abs') {
      incr = this.pixelsPerUnit[1] * this.axes[1].step;
   } else if (this.axes[1].stepType == 'num') {
      incr = this.pixelsPerUnit[1] * (this.range[1] / this.axes[1].step);
   }

   pos = this.centerPixel[1] - incr;
   while (pos > 0) {
      context.beginPath();
      context.moveTo(this.centerPixel[0] - this.tickSize / 2, pos);
      context.lineTo(this.centerPixel[0] + this.tickSize / 2, pos);
      context.stroke();
      pos = Math.round(pos - incr);
   }

   pos = this.centerPixel[1] + incr;
   while (pos < this.canvas.width) {
      context.beginPath();
      context.moveTo(this.centerPixel[0] - this.tickSize / 2, pos);
      context.lineTo(this.centerPixel[0] + this.tickSize / 2, pos);
      context.stroke();
      pos = Math.round(pos + incr);
   }
}

Plot.prototype.drawGrid = function() {
   //
}

Plot.prototype.drawRect = function(coordArray, color, thickness) {
   // coordArray = [x1, y1, x2, y2]
   var context = this.context;

   context.beginPath();
   context.lineWidth = thickness;
   context.strokeStyle = color;

   var x1 = this.centerPixel[0] + (coordArray[0] * this.pixelsPerUnit[0]);
   var y1 = this.centerPixel[1] + (coordArray[1] * this.pixelsPerUnit[1]);
   var x2 = this.centerPixel[0] + (coordArray[2] * this.pixelsPerUnit[0]);
   var y2 = this.centerPixel[1] + (coordArray[3] * this.pixelsPerUnit[1]);

   context.rect(x1, y1, x2 - x1, y2 - y1);
   context.stroke();
}
































