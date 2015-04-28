export var AudioContext = window.AudioContext || window.webkitAudioContext;
if (!AudioContext) alert('Your browser does not support the web audio api!');

export var audioCtx = new AudioContext();

export var OUT = audioCtx.destination;
