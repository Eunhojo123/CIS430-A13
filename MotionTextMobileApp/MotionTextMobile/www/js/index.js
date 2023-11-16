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

document.addEventListener("deviceready", onDeviceReady, false);
// android has a back button, we want to stop when pressed
document.addEventListener("backbutton", stopWatchingAccelerometer, false);

function onDeviceReady() {

	// StatusBar.overlaysWebView(false); // force ios to show status bar

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
	accelerometerWatcher = navigator.accelerometer.watchAcceleration(
		accelerometerSuccess,
		accelerometerFailure,
		accelerometerOptions);
	startTime = Date.now();
	startButton.disabled = true;
	stopButton.disabled  = false;
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
}

function accelerometerFailure() {
	alert("Error in Accelerometer!");
}