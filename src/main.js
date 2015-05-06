import 'lib/util';
import Vue from 'vue';
import {OUT} from 'lib/audio/context';
import {synthGenome, Synth} from 'synth';
import {BitCrusher} from 'lib/audio/components';
import {KeyboardPiano} from 'lib/audio/interfaces';

import 'components/synth-view';

const Settings = {
    ENTITY_COUNT: 6,
    KEEP_FITTEST: true,
    MUTATION_COUNT: 2,
    MUTATION_AMOUNT: 5
};

var keySynths = [];

var vm = new Vue({
    el: '#main',
    data: {
        graphLength: 0.1,
        graphNote: 440,
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

            // Keep fittest
            if (Settings.KEEP_FITTEST && prev[0].fitness > 0) {
                next.push(prev[0].genotype);
            }

            // Crossover
            //let crossoverPool = prev;
            //crossoverPool.splice(0, 1);
            //for (let i = 0; i < Settings.CROSSOVER_COUNT && crossoverPool.length > 0; i++) {
                //let choice1 = Math.randomIntInRange(0, 2);
                //let choice2 = Math.randomIntInRange(0, Math.ceil(crossoverPool.length/2));
                //next = next.concat(synthGenome.crossover([
                    //[prev[0], prev[1]][choice1],
                    //crossoverPool.splice(choice2, 1)[0]
                //]));
            //}
			if (prev[0].fitness > 0 && prev[1].fitness > 0) {
				next = next.concat(synthGenome.crossover([
					prev[0].genotype,
					prev[1].genotype
				]));
			}

            // Mutation
            let mutationPool = prev;
            for (let i = 0; i < Settings.MUTATION_COUNT && mutationPool.length > 0; i++) {
                let choice = Math.randomIntInRange(0, mutationPool.length);
                next.push(synthGenome.mutate(
                    mutationPool.splice(choice, 1)[0].genotype,
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

            //this.entities = Array.apply(null, new Array(Settings.ENTITY_COUNT)).map(() => {
            //    return {
            //        genotype: synthGenome.generate(),
            //        fitness: 0
            //    };
            //});

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
