/*
 * index.js
 * Put your JavaScript in here
 */

"use strict";

var accelerometerOptions = { frequency: 1000 }; // update every 1000ms = 1 sec
var accelerometerWatcher = null;
var xLabel, yLabel, zLabel, tLabel;
var startButton, stopButton;
var startTime;

var xSmoothie, ySmoothie, zSmoothie;
var xCanvas, yCanvas, zCanvas;
var xLine, yLine, zLine;

document.addEventListener("deviceready", onDeviceReady, false);

// android has a back button, we want to stop when pressed
document.addEventListener("backbutton", stopWatchingAccelerometer, false);

function onDeviceReady() {
	xCanvas = document.getElementById('xCanvasId');

	xSmoothie = new SmoothieChart();

	xSmoothie.streamTo(xCanvas, 1000 /* delay for smooth graph */);

	xLine = new TimeSeries();
	yLine = new TimeSeries();
	zLine = new TimeSeries();

	xLabel 		= document.getElementById('xLabelId');
	yLabel 		= document.getElementById('yLabelId');
	zLabel 		= document.getElementById('zLabelId');
	tLabel 		= document.getElementById('tLabelId');
	startButton = document.getElementById('startButtonId');
	stopButton 	= document.getElementById('stopButtonId');

	startButton.addEventListener("click", startWatchingAccelerometer, false);
	stopButton.addEventListener( "click", stopWatchingAccelerometer,  false);

	startButton.disabled = false;
	stopButton.disabled  = true;
}

function startWatchingAccelerometer() {
	// See: https://github.com/apache/cordova-plugin-device-motion for details
	
	accelerometerWatcher = navigator.accelerometer.watchAcceleration(
		accelerometerSuccess,
		accelerometerFailure,
		accelerometerOptions);
	startTime = Date.now();
	startButton.disabled = true;
	stopButton.disabled  = false;

	xSmoothie.addTimeSeries(xLine, { strokeStyle:'rgb(255,0,0)', lineWidth:3 });
	xSmoothie.addTimeSeries(yLine, { strokeStyle:'rgb(0,255,0)', lineWidth:3 });
	xSmoothie.addTimeSeries(zLine, { strokeStyle:'rgb(0,0,255)', lineWidth:3 });
}

function stopWatchingAccelerometer() {
	if (accelerometerWatcher) {
		navigator.accelerometer.clearWatch(accelerometerWatcher);
		accelerometerWatcher = null;
		startButton.disabled = false;
		stopButton.disabled  = true;
	}
}

function accelerometerSuccess(acceleration) {
	xLabel.innerHTML = "x: " + (acceleration.x).toPrecision(5);
	yLabel.innerHTML = "y: " + (acceleration.y).toPrecision(5);
	zLabel.innerHTML = "z: " + (acceleration.z).toPrecision(6);
	tLabel.innerHTML = "t: " + Math.round(acceleration.timestamp - startTime);

	xLine.append(acceleration.timestamp, acceleration.x);
	yLine.append(acceleration.timestamp, acceleration.y);
	zLine.append(acceleration.timestamp, acceleration.z);
}

function accelerometerFailure() {
	alert("Error in Accelerometer!");
}