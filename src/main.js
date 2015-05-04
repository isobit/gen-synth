import 'lib/util';
import Vue from 'vue';
import {OUT} from 'lib/audio/context';
import {synthGenome, Synth} from 'synth';
import {KeyboardPiano} from 'lib/audio/interfaces';

import 'components/synth-view';

var keySynths = [];

export function setKeySynth(entity) {
    keySynths.forEach(s => s.set(entity));
}

var vm = new Vue({
    el: '#main',
    data: {
        graphLength: 0.02,
        entities: Array.apply(null, new Array(6)).map(() => {
            return {entity: synthGenome.generate(), persist: false};
        })
    },
    ready() {
        let keys = new KeyboardPiano(note => {
            let s = new Synth(note);
            keySynths.push(s);
            return s;
        }, 0, true);
        keys.connect(OUT);
        document.onkeydown = (e) => keys.keyDown(e);
        document.onkeyup   = (e) => keys.keyUp(e);
    },
    methods: {
        nextGeneration() {
            let survivors = this.entities.reduce((prev, cur) => {
                if (cur.persist) prev.push(cur.entity);
                return prev;
            }, []);
            let newGeneration = [];
            survivors.forEach(s => newGeneration.push(s));
            while (newGeneration.length < 6)
                newGeneration.push(synthGenome.mutate(survivors.random(), Math.randomIntInRange(1, 4)));
            this.entities = newGeneration.map(e => {
                return {entity: e, persist: false}
            });
        }
    }
});
