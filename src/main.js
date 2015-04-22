import Vue from 'vue';
import {OUT} from 'lib/audio/context';
import {Oscillator} from 'lib/audio/components';
import {KeyboardPiano} from 'lib/audio/interfaces';

var keys = new KeyboardPiano((note) => {
    return new Oscillator('sawtooth', note);
}, OUT);

var vm = new Vue({
    el: '#main',
    data: {
    },
    ready: function() {
        document.onkeydown = (e) => keys.keyDown(e);
        document.onkeyup = (e) => keys.keyUp(e);
    }
});
