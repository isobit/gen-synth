import {audioCtx, OUT} from './context';
import {NOTES} from './notes'

export class Oscillator {
    constructor(
        type = 'sine',
        freq = NOTES.A4,
        dest = null
    ) {
        this.node = audioCtx.createOscillator();
        this.setType(type);
        this.setFreq(freq);

        this.frequency = this.node.frequency;

        this.node.start();

        if (dest) this.connect(dest);
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
}

export class Gain {
    constructor(
        source,
        gain = 1,
        dest = null
    ) {
        this.node = audioCtx.createGain();
        this.setGain(gain);

        this.gain = this.node.gain;

        source.connect(this.node);
        if (dest) this.connect(dest);
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setGain(gain) {
        this.node.gain.value = gain;
    }
}

export class LFO {
    constructor(
        type = 'sine',
        freq = 1,
        gain = 1,
        dest = null
    ) {
        this.oscNode = new Oscillator(type, freq);
        this.gainNode = new Gain(this.oscNode, gain);

        this.frequency = this.oscNode.node.frequency;
        this.type = this.oscNode.node.type;
        this.gain = this.gainNode.node.gain;

        if (dest) this.connect(dest);
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
}

export class Compressor {
    constructor(
        source,
        dest = null
    ) {
        this.node = audioCtx.createDynamicsCompressor();

        source.connect(this.node);
        if (dest) this.connect(dest);
    }
    connect(dest) {
        this.node.connect(dest);
    }
}

export class Mixer {
    constructor(
        channels = [],
        dest = null
    ) {
        this.outNode = audioCtx.createGain();
        this.gain = this.outNode.gain;
        this.inNodes = channels.map(ch => {
            let g = audioCtx.createGain();
            ch.connect(g);
            g.connect(this.outNode);
            return g;
        });
        if (dest) this.connect(dest);
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
        dest = null
    ) {
        this.node = audioCtx.createStereoPanner();
        this.setPan(pan);

        this.pan = this.node.pan;

        source.connect(this.node);
        if (dest) this.connect(dest);
    }
    connect(dest) {
        this.node.connect(dest);
    }
    setPan(pan) {
        this.node.pan.value = pan;
    }
}
