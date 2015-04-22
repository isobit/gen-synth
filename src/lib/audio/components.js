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
        this.node.start();
        if (dest) this.connect(dest);
        this.frequency = this.node.frequency;
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
