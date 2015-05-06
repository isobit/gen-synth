import {OfflineAudioContext, audioCtx} from 'lib/audio/context';
import {
    Oscillator,
    CustomOscillator,
    Delay,
    Mixer,
    Modulator,
    StereoPanner,
    BitCrusher,
    NoiseConvolver
    } from 'lib/audio/components';
import {Genome, Gene, SelectorGene, UniformFloatGene} from 'lib/genetics';

export var synthGenome = new Genome({
    mod1FreqFactor: new UniformFloatGene(1.0, 1.0, 0),
    mod1Delay: new UniformFloatGene(0, 0.01, 0.0001),
    mod1Gain: new UniformFloatGene(0, 400, 10),

    //mod2FreqFactor: new SelectorGene([3/5,2/3,3/4,1/2,1,2], 1),
    mod2FreqFactor: new UniformFloatGene(0.975, 1.025, 0.005),
    mod2Delay: new UniformFloatGene(0, 0.01, 0.0001),
    mod2Gain: new UniformFloatGene(0, 400, 10),

	panGain: new UniformFloatGene(0, 0.5, 0.1),
	panFreq: new UniformFloatGene(0, 10, 0.5),

    sinMix: new UniformFloatGene(0, 1, 0.1),
    sinDelay: new UniformFloatGene(0, 0.01, 0.0001),
    sawMix: new UniformFloatGene(0, 1, 0.1),
    sawDelay: new UniformFloatGene(0, 0.001, 0.0001),
    sqrMix: new UniformFloatGene(0, 1, 0.1),
    sqrDelay: new UniformFloatGene(0, 0.01, 0.0001),
    triMix: new UniformFloatGene(0, 1, 0.1),
    triDelay: new UniformFloatGene(0, 0.01, 0.0001)
});

export class Synth {
	constructor(note, params = null, ctx = audioCtx) {
		this.note = note;
		this.panMod = new Modulator('sine', undefined, 0, undefined, ctx);
		this.modulator1 = new Modulator('sine', undefined, 0, undefined, ctx);
		this.modulator2 = new Modulator('sine', undefined, 0, undefined, ctx);
        this.oscillators = [
            new Oscillator('sine', note, ctx),
            new Oscillator('sawtooth', note, ctx),
            new Oscillator('square', note, ctx),
            new Oscillator('triangle', note, ctx)
        ]
            .map(o => {
                this.modulator1.connect(o.frequency);
                this.modulator2.connect(o.frequency);
                return o;
            })
            .map(o => {
                return new Delay(o, undefined, ctx);
            });
		this.carrier = new Mixer(this.oscillators, ctx);
		this.node = new StereoPanner(this.carrier, 0, ctx);
        this.panMod.connect(this.node.pan);
		if (params) this.set(params);
	}
	connect(dest) {
		this.node.connect(dest);
	}
	set(params) {
		Object.keys(params).forEach(key => {
			let value = params[key];
			switch (key) {
				case 'mod1FreqFactor':
					this.modulator1.setFreq(value * this.note);
					break;
				case 'mod1Delay':
					this.modulator1.setDelay(value);
					break;
				case 'mod1Gain':
					this.modulator1.setGain(value);
					break;

				case 'mod2FreqFactor':
					this.modulator2.setFreq(value * this.note);
					break;
				case 'mod2Delay':
					this.modulator2.setDelay(value);
					break;
				case 'mod2Gain':
					this.modulator2.setGain(value);
					break;

				case 'panFreq':
					this.panMod.setFreq(value);
					break;
				case 'panGain':
					this.panMod.setGain(value);
					break;

				case 'sinMix':
					this.carrier.setInGain(0, value);
					break;
                case 'sinDelay':
                    this.oscillators[0].setDelay(value);
                    break;
				case 'sawMix':
					this.carrier.setInGain(1, value);
					break;
                case 'sawDelay':
                    this.oscillators[1].setDelay(value);
                    break;
				case 'sqrMix':
					this.carrier.setInGain(2, value);
					break;
                case 'sqrDelay':
                    this.oscillators[2].setDelay(value);
                    break;
				case 'triMix':
					this.carrier.setInGain(3, value);
					break;
                case 'triDelay':
                    this.oscillators[3].setDelay(value);
                    break;
			}
		});
		this.carrier.setOutGain(
			1 / (params.sinMix + params.sawMix + params.sqrMix + params.triMix)
		);
	}
}

//export class Synth {
    //constructor(note, params = null, ctx = audioCtx) {
        //this.note = note;
        //this.node = new Oscillator('triangle', note, ctx);
        ////this.node = new BitCrusher(this.carrier, 4, 0.5, ctx);
        //if (params) this.set(params);
    //}
    //connect(dest) {
        //this.node.connect(dest);
    //}
    //set(params) {
    //}
	//stop() {
		//this.node.stop();
	//}
//}

export function renderSynthOffline(
    note, params,
    {length = 0.02, sampleRate = 5000, channels = 1} = {}
) {
    var ctx = new OfflineAudioContext(channels, sampleRate * length, sampleRate);
    var synth = new Synth(note, params, ctx);
    synth.connect(ctx.destination);
    return ctx.startRendering();
}

//var real = [0];
//var imaginary = [0];
//for (let i = 0; i < 8; i++) {
//    real.push(Math.cos(i));
//    imaginary.push(Math.random());
//}

//export class Synth {
//    constructor(note, params = null, ctx = audioCtx) {
//        this.note = note;
//        this.modulator1 = new Modulator('sine', undefined, 0, undefined, ctx);
//        this.modulator2 = new Modulator('sine', undefined, 0, undefined, ctx);
//        this.carrier = new Mixer([
//            new Oscillator('sine', note, ctx),
//            new Oscillator('sawtooth', note, ctx),
//            new Oscillator('square', note, ctx),
//            //new CustomOscillator(real, imaginary, note, ctx)
//        ].map(o => {
//                this.modulator1.connect(o.frequency);
//                this.modulator2.connect(o.frequency);
//                return o;
//            }), ctx);
//        this.node = this.carrier;
//        //this.node = new BitCrusher(this.carrier, undefined, undefined, ctx);
//        if (params) this.set(params);
//    }
//    connect(dest) {
//        this.node.connect(dest);
//    }
//    set(params) {
//        Object.keys(params).forEach(key => {
//            let value = params[key];
//            switch (key) {
//                case 'mod1FreqFactor':
//                    this.modulator1.setFreq(value * this.note);
//                    break;
//                case 'mod1Delay':
//                    this.modulator1.setDelay(value);
//                    break;
//                case 'mod1Gain':
//                    this.modulator1.setGain(value);
//                    break;
//
//                case 'mod2FreqFactor':
//                    this.modulator2.setFreq(value * this.note);
//                    break;
//                case 'mod2Delay':
//                    this.modulator2.setDelay(value);
//                    break;
//                case 'mod2Gain':
//                    this.modulator2.setGain(value);
//                    break;
//
//                case 'sinMix':
//                    this.carrier.setInGain(0, value);
//                    break;
//                case 'sawMix':
//                    this.carrier.setInGain(1, value);
//                    break;
//                case 'sqrMix':
//                    this.carrier.setInGain(2, value);
//                    break;
//                //case 'custMix':
//                //    this.carrier.setInGain(3, value);
//                //    break;
//            }
//        });
//        this.carrier.setOutGain(
//            1/(params.sinMix + params.sawMix + params.sqrMix + params.custMix)
//        );
//    }
//}

//export var synthGenome = new Genome({
//    h1Gain: new UniformFloatGene(1.0, 1.0, 0.01),
//    h1Delay: new UniformFloatGene(0, 1.0, 0.01),
//    h2Gain: new UniformFloatGene(0.5, 1.0, 0.01),
//    h2Delay: new UniformFloatGene(0, 1.0, 0.01),
//    h3Gain: new UniformFloatGene(0.25, 1.0, 0.01),
//    h3Delay: new UniformFloatGene(0, 1.0, 0.01),
//    h4Gain: new UniformFloatGene(0.125, 1.0, 0.01),
//    h4Delay: new UniformFloatGene(0, 1.0, 0.01),
//    h5Gain: new UniformFloatGene(0, 1.0, 0.01),
//    h5Delay: new UniformFloatGene(0, 1.0, 0.01),
//    h6Gain: new UniformFloatGene(0, 1.0, 0.01),
//    h6Delay: new UniformFloatGene(0, 1.0, 0.01),
//    h7Gain: new UniformFloatGene(0, 1.0, 0.01),
//    h7Delay: new UniformFloatGene(0, 1.0, 0.01)
//});
//
//export class Synth {
//    constructor(note, params = null, ctx = audioCtx) {
//        this.note = note;
//        this.mods = [
//            new Modulator('sine', note, 0, 0, ctx),
//            new Modulator('sine', note/2, 0, 0, ctx),
//            new Modulator('sine', note/3, 0, 0, ctx),
//            new Modulator('sine', note/4, 0, 0, ctx),
//            new Modulator('sine', note/5, 0, 0, ctx),
//            new Modulator('sine', note/6, 0, 0, ctx),
//            new Modulator('sine', note/7, 0, 0, ctx)
//            ];
//        if (params) this.set(params);
//    }
//    connect(dest) {
//        this.mods.forEach(mod => {
//            console.log(mod, dest);
//            mod.connect(dest);
//        });
//    }
//    set(params) {
//        Object.keys(params).forEach(key => {
//            let value = params[key];
//            switch (key) {
//                case 'h1Gain':
//                    this.mods[0].setGain(value);
//                    break;
//                case 'h1Delay':
//                    this.mods[0].setDelay(value*(this.note));
//                    break;
//                case 'h2Gain':
//                    this.mods[1].setGain(value);
//                    break;
//                case 'h2Delay':
//                    this.mods[1].setDelay(value*(this.note / 2));
//                    break;
//                case 'h3Gain':
//                    this.mods[2].setGain(value);
//                    break;
//                case 'h3Delay':
//                    this.mods[2].setDelay(value*(this.note / 3));
//                    break;
//                case 'h4Gain':
//                    this.mods[3].setGain(value);
//                    break;
//                case 'h4Delay':
//                    this.mods[3].setDelay(value*(this.note / 4));
//                    break;
//                case 'h5Gain':
//                    this.mods[4].setGain(value);
//                    break;
//                case 'h5Delay':
//                    this.mods[4].setDelay(value*(this.note / 5));
//                    break;
//                case 'h6Gain':
//                    this.mods[5].setGain(value);
//                    break;
//                case 'h6Delay':
//                    this.mods[5].setDelay(value*(this.note / 6));
//                    break;
//                case 'h7Gain':
//                    this.mods[6].setGain(value);
//                    break;
//                case 'h7Delay':
//                    this.mods[6].setDelay(value*(this.note / 7));
//                    break;
//            }
//        });
//    }
//}

