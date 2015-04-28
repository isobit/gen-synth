import Vue from 'vue';
import {OUT} from 'lib/audio/context';
import {Oscillator, Mixer, LFO, StereoPanner} from 'lib/audio/components';
import {KeyboardPiano} from 'lib/audio/interfaces';

//var lfo = new LFO('sine', 5, 5);
//var lfo2 = new LFO('sine', 5, 0.5);
//var keys = new KeyboardPiano((note) => {
//    let o = new Oscillator('sawtooth', note / 2);
//    lfo.connect(o.frequency);
//    let p = new StereoPanner(o);
//    lfo2.connect(p.pan);
//    return p;
//}, true, OUT);

var params = [0, 0];
//while (params.length < 2)
//    params.push(Math.round(Math.random() * 100));
while (params.length < 5)
    params.push(Math.random());
while (params.length < 7)
    params.push(6/Math.round(Math.random() * 11 + 1));

var keys = new KeyboardPiano((note) => {
    let modulator = new LFO('sine', params[0] + note * params[5], params[1] + note * params[6]);
    let m = new Mixer([
        new Oscillator('sine', note / 2),
        new Oscillator('sawtooth', note / 2),
        new Oscillator('square', note / 2)]
        .map(o => {
            modulator.connect(o.frequency);
            return o;
        }));https://i.imgur.com/KWZXnwo.jpg
    m.setInGain(0, params[2]);
    m.setInGain(1, params[3]);
    m.setInGain(2, params[4]);
    return m;
}, true, OUT);

console.log(params);

//var keys = new KeyboardPiano((note) => {
//    let modulator = new LFO('sine', 5, 5);
//    let m = new Mixer([
//            new Oscillator('sine', note / 2),
//            new Oscillator('sawtooth', note / 2),
//            new Oscillator('square', note / 2)]
//            .map(o => {
//                modulator.connect(o.frequency);
//                return o;
//            }));
//    m.setInGain(0, 0);
//    m.setInGain(1, 1);
//    m.setInGain(2, 0);
//    return m;
//}, true, OUT);

var vm = new Vue({
    el: '#main',
    data: {
    },
    ready: function() {
        document.onkeydown = (e) => keys.keyDown(e);
        document.onkeyup   = (e) => keys.keyUp(e);
    }
});
