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
function Plot(canvasID, coordCanvas, axes, title, grid, center) {
   this.canvas = document.getElementById(canvasID);
   this.coordCanvas = document.getElementById(coordCanvas);
   this.context = this.canvas.getContext('2d');
   this.coordContext = this.coordCanvas.getContext('2d');
   this.axes = axes;       // array of 2 Axis objects, ordered
   this.title = title;
   this.grid = grid;       // Boolean
   this.tickSize = 10;
   this.center = center;

   this.unitsPerLabel = 1.0;

   this.update();
}

Plot.prototype.update = function() {
   // Clear canvas
   this.clearAxes();

   // Axis range in coordinate units
   this.range = [this.axes[0].max - this.axes[0].min,
                 this.axes[1].max - this.axes[1].min];

   // Number of pixels per coordinate unit
   this.pixelsPerUnit = [this.canvas.width / this.range[0],
                         this.canvas.height / this.range[1]];

   // Central pixel location
   this.centerPixel = [Math.round((this.center[0] - this.axes[0].min) / this.range[0]
                                  * this.canvas.width),
                       Math.round((this.center[1] - this.axes[1].min) / this.range[1]
                                  * this.canvas.height)];

   this.originPixel = [Math.round((0 - this.axes[0].min) / this.range[0]
                                 * this.canvas.width),
                       Math.round((0 - this.axes[1].min) / this.range[1]
                                 * this.canvas.height)];

   // Draw grid
   if (this.grid) {
      this.drawGrid();
   }

   // Draw axes
   this.drawAxes();
}

Plot.prototype.setOrigin = function(x, y) {
   this.origin = [x, y];
   this.update();
}

Plot.prototype.clearAxes = function() {
   var context = this.coordContext;
   context.clearRect(0, 0, this.coordCanvas.width, this.coordCanvas.height);
}

// never touch this again
Plot.prototype.drawAxes = function() {
   var context = this.coordContext;
   var step, incr, ticksPerLabel, start, pos, skip;

   // Set draw settings
   context.strokeStyle = "#000000";
   context.lineWidth = 1;
   context.textAlign = 'center';
   context.textBaseline = 'middle';

   // Draw horizontal axis
   context.beginPath();
   context.moveTo(0, this.canvas.height - this.centerPixel[1]);
   context.lineTo(this.canvas.width, this.canvas.height - this.centerPixel[1]);
   context.stroke();

   // Draw horizontal ticks
   if (this.axes[0].stepType == 'abs') {
      step = this.axes[0].step;
      incr = (this.pixelsPerUnit[0] * step); ///
   } else if (this.axes[0].stepType == 'num') {
      step = this.range[0] / this.axes[0].step;
      incr = (this.pixelsPerUnit[0] * step); ///
   }

   ticksPerLabel = Math.round(1.0 / step);

   start = step - ((this.axes[0].min / step) - Math.floor(this.axes[0].min / step)) * step;
   pos = start * this.pixelsPerUnit[0];
   tick = Math.floor(this.axes[0].min * ticksPerLabel) + 1;
   unit = Math.floor(this.axes[0].min) + 1; // First unit label to appear

   // Your axes might land right on top of a tick mark. If so, skip it.
   if (this.center[0] / step == Math.floor(this.center[0] / step)) {
      skip = Math.round(this.center[0] / step);
   } else {
      skip = tick - 1;
   }

   while (pos < this.canvas.width) {
      // Check if this tick crosses the axis
      if (tick == skip) {
         if (tick % ticksPerLabel == 0) {
            unit++;
         }
         tick++;
         pos += incr;
         continue;
      }

      // Draw tick
      context.beginPath();
      context.moveTo(pos, this.canvas.height - this.centerPixel[1] - this.tickSize / 2);
      context.lineTo(pos, this.canvas.height - this.centerPixel[1] + this.tickSize / 2);
      context.stroke();

      // Draw tick label
      if (tick % ticksPerLabel == 0) {
         context.fillText(unit, pos, this.canvas.height - this.centerPixel[1] + this.tickSize / 2 + 5);
         unit++;
      }

      pos += incr;
      tick++;
   }

   // Draw vertical axis
   context.beginPath();
   context.moveTo(this.centerPixel[0], 0);
   context.lineTo(this.centerPixel[0], this.canvas.height);
   context.stroke();

   // Draw vertical ticks
   if (this.axes[1].stepType == 'abs') {
      step = this.axes[1].step;
      incr = (this.pixelsPerUnit[1] * step); ///
   } else if (this.axes[1].stepType == 'num') {
      step = this.range[1] / this.axes[1].step;
      incr = (this.pixelsPerUnit[1] * step); ///
   }

   ticksPerLabel = Math.round(1.0 / step);

   start = step - (this.axes[1].min / step - Math.floor(this.axes[1].min / step)) * step;
   pos = this.canvas.height - start * this.pixelsPerUnit[1];
   tick = Math.floor(this.axes[1].min * ticksPerLabel) + 1;
   unit = Math.floor(this.axes[1].min) + 1; // First unit label to appear

   // Your axes might land right on top of a tick mark. If so, skip it.
   if (this.center[1] / step == Math.floor(this.center[1] / step)) {
      skip = this.center[1] / step; ///
   } else {
      skip = tick - 1;
   }

   while (pos > 0) {
      // Check if this tick crosses the axis
      if (tick == skip) {
         if (tick % ticksPerLabel == 0) {
            unit++;
         }
         tick++;
         pos -= incr;
         continue;
      }

      // Draw tick
      context.beginPath();
      context.moveTo(this.centerPixel[0] - this.tickSize / 2, pos);
      context.lineTo(this.centerPixel[0] + this.tickSize / 2, pos);
      context.stroke();

      // Draw tick label
      if (tick % ticksPerLabel == 0) {
         context.fillText(unit, this.centerPixel[0] - this.tickSize / 2 - 5, pos);
         unit++;
      }

      pos -= incr;
      tick++;
   }
}

// this either
Plot.prototype.drawGrid = function() {
   var context = this.coordContext;
   var incr, pos, ticksPerLabel, start, tick;

   context.strokeStyle = "#aaaaaa";
   context.lineWidth = 1;

   // Draw horizontal ticks
   if (this.axes[0].stepType == 'abs') {
      step = this.axes[0].step;
      incr = this.pixelsPerUnit[0] * step; ///
   } else if (this.axes[0].stepType == 'num') {
      step = this.range[0] / this.axes[0].step;
      incr = this.pixelsPerUnit[0] * step; ///
   }

   ticksPerLabel = Math.round(1.0 / step);

   start = step - ((this.axes[0].min / step) - Math.floor(this.axes[0].min / step)) * step;
   pos = start * this.pixelsPerUnit[0];
   tick = Math.floor(this.axes[0].min * ticksPerLabel) + 1;

   // Your axes might land right on top of a tick mark. If so, skip it.
   if (this.center[0] / step == Math.floor(this.center[0] / step)) {
      skip = Math.round(this.center[0] / step);
   } else {
      skip = tick - 1;
   }

   while (pos < this.canvas.width) {
      // Check if this tick crosses the axis
      if (tick == skip) {
         tick++;
         pos += incr;
         continue;
      }

      // Draw line
      context.beginPath();
      context.moveTo(pos, 0);
      context.lineTo(pos, this.canvas.height);
      context.stroke();

      pos += incr;
      tick++;
   }

   // Draw vertical ticks
   if (this.axes[1].stepType == 'abs') {
      step = this.axes[1].step;
      incr = (this.pixelsPerUnit[1] * step); ///
   } else if (this.axes[1].stepType == 'num') {
      step = this.range[1] / this.axes[1].step;
      incr = (this.pixelsPerUnit[1] * step); ///
   }

   ticksPerLabel = Math.round(1.0 / step);

   start = step - (this.axes[1].min / step - Math.floor(this.axes[1].min / step)) * step;
   pos = this.canvas.height - start * this.pixelsPerUnit[1];
   tick = Math.floor(this.axes[1].min * ticksPerLabel) + 1;

   // Your axes might land right on top of a tick mark. If so, skip it.
   if (this.center[1] / step == Math.floor(this.center[1] / step)) {
      skip = Math.round(this.center[1] / step);
   } else {
      skip = tick - 1;
   }

   while (pos > 0) {
      // Check if this tick crosses the axis
      if (tick == skip) {
         tick++;
         pos -= incr;
         continue;
      }

      // Draw tick
      context.beginPath();
      context.moveTo(0, pos);
      context.lineTo(this.canvas.width, pos);
      context.stroke();
      
      pos -= incr;
      tick++;
   }
}

Plot.prototype.drawRect = function(coordArray, color, thickness) {
   // coordArray = [x1, y1, x2, y2]
   var context = this.context;

   context.beginPath();
   context.lineWidth = thickness;
   context.strokeStyle = color;

   var x1 = this.originPixel[0] + (coordArray[0] * this.pixelsPerUnit[0]);
   var y1 = this.originPixel[1] + (coordArray[1] * this.pixelsPerUnit[1]);
   var x2 = this.originPixel[0] + (coordArray[2] * this.pixelsPerUnit[0]);
   var y2 = this.originPixel[1] + (coordArray[3] * this.pixelsPerUnit[1]);

   context.rect(x1, this.canvas.height - y1, x2 - x1, -(y2 - y1));
   context.stroke();
}

Plot.prototype.identifyRect = function(coordArray, color, thickness) {
   // coordArray = [x1, y1, x2, y2]
   var context = this.context;

   context.beginPath();
   context.lineWidth = thickness;
   context.strokeStyle = color;

   var x1 = this.originPixel[0] + (coordArray[0] * this.pixelsPerUnit[0]);
   var y1 = this.originPixel[1] + (coordArray[1] * this.pixelsPerUnit[1]);
   var x2 = this.originPixel[0] + (coordArray[2] * this.pixelsPerUnit[0]);
   var y2 = this.originPixel[1] + (coordArray[3] * this.pixelsPerUnit[1]);

   // Figure out the relative orientation of (x1, y1) and (x2, y2) and set the
   // identifying box accordingly
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
      console.log('bad coords:', x1, y1, x2, y2);
   }

   context.rect(x1, this.canvas.height - y1, x2 - x1, -(y2 - y1));
   context.stroke();
}

Plot.prototype.setOrigin = function(x_coord, y_coord, x, y) {
   // Set the axes at the desired coordinates
   this.center = [x_coord, y_coord];

   // (x, y) represents the desired pixel position of the center

   // Find the pixel location of the current center
   var x0 = (this.center[0] - this.axes[0].min) * this.pixelsPerUnit[0];
   var y0 = this.canvas.height - (this.center[1] - this.axes[1].min) * this.pixelsPerUnit[1];

   // Shift the axes
   var x_shift = (x - x0) / this.pixelsPerUnit[0];
   var y_shift = -(y - y0) / this.pixelsPerUnit[1];

   this.axes[0].min -= x_shift;
   this.axes[0].max -= x_shift;
   this.axes[1].min -= y_shift;
   this.axes[1].max -= y_shift;

   // Redraw axes
   this.update();
}

Plot.prototype.setScaleX = function(x0) {
   // terrible
   this.setScaleX_x0 = x0; // in pixels

   // Original axis limits
   this.axes[0].min0 = this.axes[0].min;
   this.axes[0].max0 = this.axes[0].max;
}

Plot.prototype.scaleX = function(x) {
   // x0: start-drag location, in pixels
   // x: end-drag location, in pixels
   var x0 = this.setScaleX_x0;

   // Set scaling factor for axes
   var delta = (x - x0) / 100;
   var scale = Math.pow(2, delta);

   var tooLarge = (this.axes[0].max0 - this.axes[0].min0) / scale > 20;
   var tooSmall = (this.axes[0].max0 - this.axes[0].min0) / scale < 0.5;

   if (!tooLarge && !tooSmall) {
      this.axes[0].min = (this.axes[0].min0 - this.center[0]) / scale + this.center[0];
      this.axes[0].max = (this.axes[0].max0 - this.center[0]) / scale + this.center[0];

      // Redraw axes
      this.update();
   }
}

Plot.prototype.setScaleY = function(y0) {
   // terrible
   this.setScaleY_y0 = y0; // in pixels

   // Original axis limits
   this.axes[1].min0 = this.axes[1].min;
   this.axes[1].max0 = this.axes[1].max;
}

Plot.prototype.scaleY = function(y) {
   // y0: start-drag location, in pixels
   // y: end-drag location, in pixels
   var y0 = this.setScaleY_y0;

   // Set scaling factor for axes
   var delta = (y - y0) / 100;
   var scale = Math.pow(2, -delta);

   var tooLarge = (this.axes[1].max0 - this.axes[1].min0) / scale > 20;
   var tooSmall = (this.axes[1].max0 - this.axes[1].min0) / scale < 0.5;

   if (!tooLarge && !tooSmall) {
      this.axes[1].min = (this.axes[1].min0 - this.center[1]) / scale + this.center[1];
      this.axes[1].max = (this.axes[1].max0 - this.center[1]) / scale + this.center[1];

      // Redraw axes
      this.update();
   }
}

































