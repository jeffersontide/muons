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
function Plot(canvasID, coordCanvas, axes, title, grid, origin) {
   this.canvas = document.getElementById(canvasID);
   this.coordCanvas = document.getElementById(coordCanvas);
   this.context = this.canvas.getContext('2d');
   this.coordContext = this.coordCanvas.getContext('2d');
   this.axes = axes;       // array of 2 Axis objects, ordered
   this.title = title;
   this.grid = grid;       // Boolean
   this.tickSize = 10;
   this.origin = origin;

   this.init();
}

Plot.prototype.init = function() {
   // Clear canvas
   this.clearAxes();

   // Axis range in coordinate units
   this.range = [this.axes[0].max - this.axes[0].min,
                 this.axes[1].max - this.axes[1].min];

   // Number of pixels per coordinate unit
   this.pixelsPerUnit = [this.canvas.width / this.range[0],
                         this.canvas.height / this.range[1]];

   // Central pixel location
   this.centerPixel = [Math.round(Math.abs(this.axes[0].min / this.range[0])
                                  * this.canvas.width),
                       Math.round(Math.abs(this.axes[1].min / this.range[1])
                                  * this.canvas.height)];

   // Draw grid
   if (this.grid) {
      this.drawGrid();
   }

   // Draw axes
   this.drawAxes();
}

Plot.prototype.clearAxes = function() {
   var context = this.coordContext;
   context.clearRect(0, 0, this.coordCanvas.width, this.coordCanvas.height);
}

// never touch this again
Plot.prototype.drawAxes = function() {
   var context = this.coordContext;
   var incr, pos, step;

   // Set draw settings
   context.strokeStyle = "#000000";
   context.lineWidth = 1;
   context.textAlign = 'center';
   context.textBaseline = 'middle';

   // Draw horizontal axis
   context.beginPath();
   context.moveTo(0, this.centerPixel[1]);
   context.lineTo(this.canvas.width, this.centerPixel[1]);
   context.stroke();

   // Draw horizontal axis tick marks
   if (this.axes[0].stepType == 'abs') {
      step = this.axes[0].step;
      incr = this.pixelsPerUnit[0] * step;
   } else if (this.axes[0].stepType == 'num') {
      step = this.range[0] / this.axes[0].step;
      incr = this.pixelsPerUnit[0] * step;
   }

   var unitsPerLabel = Math.round(1.0 / step);

   // Left side ticks
   pos = this.centerPixel[0] - incr;
   tick = -1;
   unit = -1;

   while (pos > 0) {
      context.beginPath();
      context.moveTo(pos, this.centerPixel[1] - this.tickSize / 2);
      context.lineTo(pos, this.centerPixel[1] + this.tickSize / 2);
      context.stroke();

      // Draw tick markers
      if (Math.abs(tick) % unitsPerLabel == 0) {
         context.fillText(unit, pos, this.centerPixel[1] + this.tickSize / 2 + 5);
         unit--;
      }

      pos = Math.round(pos - incr);
      tick--;
   }

   // Right side ticks
   pos = this.centerPixel[0] + incr;
   unit = 1;
   tick = 1;

   while (pos < this.canvas.width) {
      context.beginPath();
      context.moveTo(pos, this.centerPixel[1] - this.tickSize / 2);
      context.lineTo(pos, this.centerPixel[1] + this.tickSize / 2);
      context.stroke();

      // Draw tick markers
      if (Math.abs(tick) % unitsPerLabel == 0) {
         context.fillText(unit, pos, this.centerPixel[1] + this.tickSize / 2 + 5);
         unit++;
      }

      pos = Math.round(pos + incr);
      tick++;
   }

   // Draw vertical axis
   context.beginPath();
   context.moveTo(this.centerPixel[0], 0);
   context.lineTo(this.centerPixel[0], this.canvas.height);
   context.stroke();

   // Draw vertical axis tick marks
   if (this.axes[1].stepType == 'abs') {
      incr = this.pixelsPerUnit[1] * this.axes[1].step;
   } else if (this.axes[1].stepType == 'num') {
      incr = this.pixelsPerUnit[1] * (this.range[1] / this.axes[1].step);
   }

   unitsPerLabel = Math.round(1.0 / step);

   // Bottom ticks
   pos = this.centerPixel[1] - incr;
   unit = -1;
   tick = -1;

   while (pos > 0) {
      context.beginPath();
      context.moveTo(this.centerPixel[0] - this.tickSize / 2, pos);
      context.lineTo(this.centerPixel[0] + this.tickSize / 2, pos);
      context.stroke();

      // Label ticks
      if (Math.abs(tick) % unitsPerLabel == 0) {
         context.fillText(-unit, this.centerPixel[0] - this.tickSize / 2 - 5, pos);
         unit--;
      }

      pos = Math.round(pos - incr);
      tick--;
   }

   // Top ticks
   pos = this.centerPixel[1] + incr;
   unit = 1;
   tick = 1;

   while (pos < this.canvas.width) {
      context.beginPath();
      context.moveTo(this.centerPixel[0] - this.tickSize / 2, pos);
      context.lineTo(this.centerPixel[0] + this.tickSize / 2, pos);
      context.stroke();

      if (Math.abs(tick) % unitsPerLabel == 0) {
         context.fillText(-unit, this.centerPixel[0] - this.tickSize / 2 - 5, pos);
         unit++;
      }

      pos = Math.round(pos + incr);
      tick++;
   }
}

Plot.prototype.drawGrid = function() {
   var context = this.coordContext;
   var incr, pos;

   context.strokeStyle = "#aaaaaa";
   context.lineWidth = 1;

   // Draw vertical lines
   if (this.axes[0].stepType == 'abs') {
      incr = this.pixelsPerUnit[0] * this.axes[0].step;
   } else if (this.axes[0].stepType == 'num') {
      incr = this.pixelsPerUnit[0] * (this.range[0] / this.axes[0].step);
   }

   pos = this.centerPixel[0] - incr;
   while (pos > 0) {
      context.beginPath();
      context.moveTo(pos, 0);
      context.lineTo(pos, this.canvas.height);
      context.stroke();
      pos = Math.round(pos - incr);
   }

   pos = this.centerPixel[0] + incr;
   while (pos < this.canvas.width) {
      context.beginPath();
      context.moveTo(pos, 0);
      context.lineTo(pos, this.canvas.height);
      context.stroke();
      pos = Math.round(pos + incr);
   }

   // Draw horizontal lines
   if (this.axes[1].stepType == 'abs') {
      incr = this.pixelsPerUnit[1] * this.axes[1].step;
   } else if (this.axes[1].stepType == 'num') {
      incr = this.pixelsPerUnit[1] * (this.range[1] / this.axes[1].step);
   }

   pos = this.centerPixel[1] - incr;
   while (pos > 0) {
      context.beginPath();
      context.moveTo(0, pos);
      context.lineTo(this.canvas.width, pos);
      context.stroke();
      pos = Math.round(pos - incr);
   }

   pos = this.centerPixel[1] + incr;
   while (pos < this.canvas.width) {
      context.beginPath();
      context.moveTo(0, pos);
      context.lineTo(this.canvas.width, pos);
      context.stroke();
      pos = Math.round(pos + incr);
   }
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

Plot.prototype.identifyRect = function(coordArray, color, thickness) {
   // coordArray = [x1, y1, x2, y2]
   var context = this.context;

   context.beginPath();
   context.lineWidth = thickness;
   context.strokeStyle = color;

   var x1 = this.centerPixel[0] + (coordArray[0] * this.pixelsPerUnit[0]);
   var y1 = this.centerPixel[1] + (coordArray[1] * this.pixelsPerUnit[1]);
   var x2 = this.centerPixel[0] + (coordArray[2] * this.pixelsPerUnit[0]);
   var y2 = this.centerPixel[1] + (coordArray[3] * this.pixelsPerUnit[1]);

   // Figure out the relative orientation of (x1, y1) and (x2, y2) and set the
   // identifying box accordingly
   // /***/ You'll need to figure this out again if you flip the y coordinates
   // in pixel space
   if (x1 < x2 && y1 < y2) {
      // NW to SE
      x1 -= 2;
      y1 -= 2;
      x2 += 2;
      y2 += 2;
   } else if (x1 > x2 && y1 > y2) {
      // SE to NW
      x1 += 2;
      y1 += 2;
      x2 -= 2;
      y2 -= 2;
   } else if (x1 < x2 && y1 > y2) {
      // SW to NE
      x1 -= 2;
      y1 += 2;
      x2 += 2;
      y2 -= 2;
   } else if (x1 > x2 && y1 < y2) {
      // NE to SW
      x1 += 2;
      y1 -= 2;
      x2 -= 2;
      y2 += 2;
   } else {
      // Something is wrong
      console.log('fuck');
   }

   context.rect(x1, y1, x2 - x1, y2 - y1);
   context.stroke();
}

Plot.prototype.setOrigin = function(x_coord, y_coord, x, y) {
   // (x, y) represent the desired origin position with respect to the NW
   // corner of the canvas

   // Find (x0, y0) -- the current pixel position of the origin wrt. the NW corner
   // of the canvas
   var x0 = -(this.axes[0].min - x_coord) * this.pixelsPerUnit[0];
   var y0 = -(this.axes[1].min - y_coord) * this.pixelsPerUnit[1];

   // Need to shift the graph by ___ in coordinate units
   var x_shift = (x - x0) / this.pixelsPerUnit[0];
   var y_shift = (y - y0) / this.pixelsPerUnit[1];

   // Reset the axes' min/max values accordingly
   this.axes[0].min -= x_shift;
   this.axes[0].max -= x_shift;
   this.axes[1].min -= y_shift;
   this.axes[1].max -= y_shift;

   // Redraw axes
   this.init();
}

Plot.prototype.setScaleX = function(x0) {
   // terrible
   this.setScaleX_x0 = x0; // in pixels
   var x_origin = -this.axes[0].min * this.pixelsPerUnit[0];

   // Original axis limits
   this.axes[0].min0 = this.axes[0].min;
   this.axes[0].max0 = this.axes[0].max;
}

Plot.prototype.scaleX = function(x) {
   // x0: start-drag location, in pixels
   // x_origin: origin location, in pixels
   // x: end-drag location, in pixels
   var x0 = this.setScaleX_x0;
   var x_origin = -this.axes[0].min * this.pixelsPerUnit[0];

   // Set scaling factor for axes
   var delta = (x - x0) / 100;
   var scale = Math.pow(2, delta);

   var tooLarge = (this.axes[0].max0 - this.axes[0].min0) / scale > 20;
   var tooSmall = (this.axes[0].max0 - this.axes[0].min0) / scale < 0.5;

   if (!tooLarge && !tooSmall) {
      this.axes[0].min = this.axes[0].min0 / scale;
      this.axes[0].max = this.axes[0].max0 / scale;

      // Redraw axes
      this.init();
   }
}

Plot.prototype.setScaleY = function(y0) {
   // terrible
   this.setScaleY_y0 = y0; // in pixels
   var y_origin = -this.axes[1].min * this.pixelsPerUnit[1];

   // Original axis limits
   this.axes[1].min0 = this.axes[1].min;
   this.axes[1].max0 = this.axes[1].max;
}

Plot.prototype.scaleY = function(y) {
   // y0: start-drag location, in pixels
   // y_origin: origin location, in pixels
   // y: end-drag location, in pixels
   var y0 = this.setScaleY_y0;
   var y_origin = -this.axes[1].min * this.pixelsPerUnit[1];

   // Set scaling factor for axes
   var delta = (y - y0) / 100;
   var scale = Math.pow(2, -delta);

   var tooLarge = (this.axes[1].max0 - this.axes[1].min0) / scale > 20;
   var tooSmall = (this.axes[1].max0 - this.axes[1].min0) / scale < 0.5;

   if (!tooLarge && !tooSmall) {
      this.axes[1].min = this.axes[1].min0 / scale;
      this.axes[1].max = this.axes[1].max0 / scale;

      // Redraw axes
      this.init();
   }
}

































