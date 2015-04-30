import {audioCtx, OUT} from './context';
import {NOTES} from './notes'

export class Oscillator {
    constructor(
        type = 'sine',
        freq = NOTES.A4,
        ctx = audioCtx
    ) {
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
    stop() {
        this.oscNode.stop();
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
