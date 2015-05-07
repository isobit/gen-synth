import Vue from 'vue';
import {OUT} from 'lib/audio/context';
import {synthGenome, Synth} from 'synth';
import {KeyboardPiano} from 'lib/audio/interfaces';
import 'lib/util';

import 'components/synth-view';

const Settings = {
    ENTITY_COUNT: 8,
    KEEP_FITTEST: true,
    RANDOM_COUNT: 2,
    MUTATION_AMOUNT: 7
};

var keySynths = [];

var vm = new Vue({
    el: '#main',
    data: {
        graphLength: 0.01,
        graphNote: 440,
		count: 0,
        activeEntity: 0,
        entities: Array.apply(null, new Array(Settings.ENTITY_COUNT)).map(() => {
            return {
                genotype: synthGenome.generate(),
                fitness: 0
            };
        })
    },
    methods: {
        nextGeneration() {
            let prev = this.entities;
            prev.sort((a, b) =>
                Number.parseInt(a.fitness) < Number.parseInt(b.fitness)
            );

            let next = [];
            let mutationPool = prev
				.filter(e => e.fitness > 0)
				.map(e => e.genotype);

            // Keep fittest
            if (Settings.KEEP_FITTEST && prev[0].fitness > 0) {
                next.push(prev[0].genotype);
            }

            // Crossover (breed the top two)
			if (prev[0].fitness > 0 && prev[1].fitness > 0) {
				let children = synthGenome.crossover([
					prev[0].genotype,
					prev[1].genotype
				]);
				next = next.concat(children);
				mutationPool = mutationPool.concat(children);
			}

            // Mutation
            while (next.length < Settings.ENTITY_COUNT - Settings.RANDOM_COUNT 
				   && mutationPool.length > 0) {
                let choice = Math.randomIntInRange(0, mutationPool.length);
                next.push(synthGenome.mutate(
                    mutationPool[choice],
                    Settings.MUTATION_AMOUNT
                ));
            }

            // Random Seeding
            while (next.length < Settings.ENTITY_COUNT) {
                next.push(synthGenome.generate());
            }

            this.entities = next.map(genotype => {
                return {
                    genotype: genotype,
                    fitness: 0
                };
            });

			this.count++;
            this.selectEntity(0);
        },
        selectEntity(i) {
            this.activeEntity = i;
            keySynths.forEach(s => s.set(this.entities[i].genotype));
        }
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
	beforeDestroy() {
		keySynths.forEach(s => s.stop());
	}
});
