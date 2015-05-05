import {audioCtx, OUT} from './context';
import {NOTES} from './notes'

export class Oscillator {
    constructor(
        type = 'sine',
        freq = NOTES.A4,
        ctx = audioCtx
    ) {
		console.log(ctx);
        this.node = ctx.createOscillator();
        this.setType(type);
        this.setFreq(freq);
        this.frequency = this.node.frequency;
        this.node.start();
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setType(type) {
        this.node.type = type;
    }
    setFreq(freq) {
        this.node.frequency.value = freq;
    }
    stop() {
        this.node.stop();
    }
}

export class Gain {
    constructor(
        source,
        gain = 1,
        ctx = audioCtx
    ) {
        this.node = ctx.createGain();
        this.gain = this.node.gain;
        this.setGain(gain);
        source.connect(this.node);
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setGain(gain) {
        this.node.gain.value = gain;
    }
}

export class Delay {
    constructor(
        source,
        delay = 0.0,
        ctx = audioCtx
    ) {
        this.node = ctx.createDelay();
        this.delay = this.node.delayTime;
        this.setDelay(delay);
        source.connect(this.node);
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setDelay(delay) {
        this.node.delayTime.value = delay;
    }
}

export class Modulator {
    constructor(
        type = 'sine',
        freq = 1,
        gain = 1,
        delay = 0,
        ctx = audioCtx
    ) {
        this.oscNode = new Oscillator(type, freq, ctx);
        this.frequency = this.oscNode.node.frequency;
        this.type = this.oscNode.type;

        this.delayNode = new Delay(this.oscNode, delay, ctx);
        this.delay = this.delayNode.delay;

        this.gainNode = new Gain(this.delayNode, gain, ctx);
        this.gain = this.gainNode.gain;
    }
    connect(dest) {
        this.gainNode.connect(dest);
    }
    setType(type) {
        this.oscNode.setType(type);
    }
    setFreq(freq) {
        this.oscNode.setFreq(freq);
    }
    setGain(gain) {
        this.gainNode.setGain(gain);
    }
    setDelay(delay) {
        this.delayNode.setDelay(delay);
    }
}

export class Compressor {
    constructor(
        source,
        ctx = audioCtx
    ) {
        this.node = ctx.createDynamicsCompressor();
        source.connect(this.node);
    }
    connect(dest) {
        this.node.connect(dest);
    }
}

export class Mixer {
    constructor(
        channels = [],
        ctx = audioCtx
    ) {
        this.outNode = ctx.createGain();
        this.outGain = this.outNode.gain;
        this.inNodes = channels.map(ch => {
            let g = ctx.createGain();
            ch.connect(g);
            g.connect(this.outNode);
            return g;
        });
        this.inGain = this.inNodes.map(node => node.gain);
    }
    connect(dest) {
        this.outNode.connect(dest);
    }
    setInGain(i, gain) {
        this.inNodes[i].gain.value = gain;
    }
    setAllInGain(gain) {
        this.inNodes.forEach(ch => ch.gain.value = gain);
    }
    setOutGain(gain) {
        this.outNode.gain.value = gain;
    }
    mute() {
        this.mutedGain = this.outNode.gain.value;
        this.setOutGain(0);
    }
    unmute() {
        this.setOutGain(this.mutedGain || 0);
    }
}

export class StereoPanner {
    constructor(
        source,
        pan = 0,
        ctx = audioCtx
    ) {
        this.node = ctx.createStereoPanner();
        this.pan = this.node.pan;
        this.setPan(pan);
        source.connect(this.node);
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setPan(pan) {
        this.node.pan.value = pan;
    }
}

export class CustomOscillator {
    constructor(
        real = [],
        imaginary = [],
        freq = NOTES.A4,
        ctx = audioCtx
    ) {
        this.node = ctx.createOscillator();
        let periodicWave = ctx.createPeriodicWave(new Float32Array(real), new Float32Array(imaginary));
        this.node.setPeriodicWave(periodicWave);
        this.setFreq(freq);
        this.frequency = this.node.frequency;
        this.node.start();
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setFreq(freq) {
        this.node.frequency.value = freq;
    }
}

export class BitCrusher {
    constructor(
        source,
        bits = 4,       // between 1 and 16
        normFreq = 0.5, // between 0.0 and 1.0
        ctx = audioCtx
    ) {
        let bufferSize = 256;
        let step = Math.pow(0.5, bits);
        let phaser = 0;
        let last = 0;
        this.node = ctx.createScriptProcessor(bufferSize, 1, 1);
        this.node.onaudioprocess = function(e) {
            let inputBuffer = e.inputBuffer;
            let outputBuffer = e.outputBuffer;
            for (let ch = 0; ch < outputBuffer.numberOfChannels; ch++) {
                let input = inputBuffer.getChannelData(ch);
                let output = outputBuffer.getChannelData(ch);
                for (let i = 0; i < inputBuffer.length; i++) {
                    phaser += normFreq;
                    if (phaser >= 1.0) {
                        phaser -= 1.0;
                        last = step * Math.floor(input[i] / step + 0.5);
                    }
                    output[i] = last;
                }
            }
        };
        source.connect(this.node);
    }
    connect(dest) {
        this.node.connect(dest);
    }
}

export class NoiseConvolver {
    constructor(
        source,
        ctx = audioCtx
    ) {
        this.node = ctx.createConvolver();
        let noiseBuffer = ctx.createBuffer(2, 0.5 * ctx.sampleRate, ctx.sampleRate);
        let left = noiseBuffer.getChannelData(0);
        let right = noiseBuffer.getChannelData(1);
        for (let i = 0; i < noiseBuffer.length; i++) {
            left[i] = Math.random() * 2 - 1;
            right[i] = Math.random() * 2 - 1;
        }
        this.node.buffer = noiseBuffer;
        source.connect(this.node);
    }
    connect(dest) {
        this.node.connect(dest);
    }
}
