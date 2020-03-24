'use strict';


var Chart = { };

var Label = { };

function ofInt(x) {
  return x;
}

function ofDate(x) {
  return x;
}

function ofString(x) {
  return x;
}

var Line = {
  ofInt: ofInt,
  ofDate: ofDate,
  ofString: ofString
};

var Axis = { };

var Stack = { };

var Scatter = { };

var ClipContainer = { };

var VoronoiContainer = { };

exports.Chart = Chart;
exports.Label = Label;
exports.Line = Line;
exports.Axis = Axis;
exports.Stack = Stack;
exports.Scatter = Scatter;
exports.ClipContainer = ClipContainer;
exports.VoronoiContainer = VoronoiContainer;
/* No side effect */
