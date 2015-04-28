import Vue from 'vue';
import {OUT} from 'lib/audio/context';
import {Oscillator, Mixer, Modulator, StereoPanner} from 'lib/audio/components';
import {KeyboardPiano} from 'lib/audio/interfaces';

var keys;
var notes = [];
var modulators = [];
var carriers = [];

var vm = new Vue({
    el: '#main',
    data: {
        params: {
            modFreqFactor: 1 / Math.floor(Math.random() * 2 + 1),
            modGainFactor: 1 / Math.floor(Math.random() * 2 + 1),
            modDelayFactor: Math.random(),
            //sinMix: Math.random(),
            //sawMix: Math.random(),
            //sqrMix: Math.random()
            sinMix: 1,
            sawMix: 0,
            sqrMix: 0
        }
    },
    ready() {
        let params = this.params;

        keys = new KeyboardPiano((note) => {
            let modulator = new Modulator('sine');
            modulators.push({
                setFreqFactor(f) {
                    modulator.setFreq(note * f);
                },
                setGainFactor(f) {
                    modulator.setGain(5000 * f);
                },
                setDelayFactor(f) {
                    modulator.setDelay(note * 0.0001 * f);
                },
            });

            let carrier = new Mixer([
                new Oscillator('sine', note / 2),
                new Oscillator('sawtooth', note / 2),
                new Oscillator('square', note / 2)
            ].map(o => {
                    modulator.connect(o.frequency);
                    return o;
                }));
            carriers.push(carrier);

            return carrier;
        }, true, OUT);

        document.onkeydown = (e) => keys.keyDown(e);
        document.onkeyup   = (e) => keys.keyUp(e);

        this.$watch('params', this.updateSynth, true, true);
    },
    methods: {
        updateSynth(params) {
            console.log('updating');
            modulators.forEach(m => {
                m.setFreqFactor(params.modFreqFactor);
                m.setGainFactor(params.modGainFactor);
                m.setDelayFactor(params.modDelayFactor);
            });
            carriers.forEach(c => {
                c.setInGain(0, params.sinMix);
                c.setInGain(1, params.sawMix);
                c.setInGain(2, params.sqrMix);
            });
        }
    }
});
