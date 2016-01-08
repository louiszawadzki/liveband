var audioContext = new AudioContext();
var oscillator = audioContext.createOscillator();

var exports.play = oscillator.play;
var exports.stop = oscillator.stop;


