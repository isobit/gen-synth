import {OUT, OfflineAudioContext, audioCtx} from 'lib/audio/context';
import {Oscillator, Mixer, Modulator, StereoPanner} from 'lib/audio/components';
import {Genome, SelectorGene, UniformFloatGene} from 'lib/genetics';

export var synthGenome = new Genome({
    //modFreqFactor: new UniformFloatGene(0.9, 1.1, 0.001),
    modFreqFactor: new UniformFloatGene(1.0, 1.0, 0),
    modDelay: new UniformFloatGene(0, 0.001, 0.0001),
    modGain: new UniformFloatGene(0, 400, 10),

    modFreqFactor2: new UniformFloatGene(1.0, 1.0, 0.01),
    modDelay2: new UniformFloatGene(0, 0.001, 0.0001),
    modGain2: new UniformFloatGene(0, 400, 10),

    sinMix: new UniformFloatGene(0, 1, 0.1),
    sawMix: new UniformFloatGene(0, 1, 0.1),
    sqrMix: new UniformFloatGene(0, 1, 0.1)
});

export class Synth {
    constructor(note, params = null, ctx = audioCtx) {
        this.note = note;
        this.modulator = new Modulator('sine', null, 0, null, ctx);
        this.modulator2 = new Modulator('sine', null, 0, null, ctx);
        this.carrier = new Mixer([
            new Oscillator('sine', note, ctx),
            new Oscillator('sawtooth', note, ctx),
            new Oscillator('square', note, ctx)
        ].map(o => {
                this.modulator.connect(o.frequency);
                this.modulator2.connect(o.frequency);
                return o;
            }), ctx);
        if (params) this.set(params);
    }
    connect(dest) {
        this.carrier.connect(dest);
    }
    set(params) {
        Object.keys(params).forEach(key => {
            let value = params[key];
            switch (key) {
                case 'modFreqFactor':
                    this.modulator.setFreq(value * this.note);
                    break;
                case 'modDelay':
                    this.modulator.setDelay(value);
                    break;
                case 'modGain':
                    this.modulator.setGain(value);
                    break;

                case 'modFreqFactor2':
                    this.modulator2.setFreq(value * this.note);
                    break;
                case 'modDelay2':
                    this.modulator2.setDelay(value);
                    break;
                case 'modGain2':
                    this.modulator2.setGain(value);
                    break;

                case 'sinMix':
                    this.carrier.setInGain(0, value);
                    break;
                case 'sawMix':
                    this.carrier.setInGain(1, value);
                    break;
                case 'sqrMix':
                    this.carrier.setInGain(2, value);
                    break;
            }
        });
    }
}

export function renderSynthOffline(note, params, length = 0.02) {
    let ctx = new OfflineAudioContext(1, 44100 * length, 44100);
    let synth = new Synth(note, params, ctx);
    synth.connect(ctx.destination);
    return ctx.startRendering();
}

