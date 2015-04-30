import 'lib/util';

export class Gene {
    constructor(
        generator,
        drifter
    ) {
        this.generator = generator;
        this.drifter = drifter;
    }
}

export class UniformFloatGene extends Gene {
    constructor(min, max, step) {
        super(
            () => Math.randomFloatInRange(min, max),
            (n) => (n + [-step, step].random()).clamp(min, max)
        );
        this.min = min;
        this.max = max;
        this.step = step;
    }
}
export class UniformIntGene extends Gene {
    constructor(min, max, step) {
        super(
            () => Math.randomIntInRange(min, max+1),
            (n) => (n + [-step, step].random()).clamp(min, max)
        );
        this.min = min;
        this.max = max;
        this.step = step;
    }
}
export class SelectorGene extends Gene {
    constructor(selections, step) {
        super(
            () => selections.random(),
            (n) => selections[(selections.indexOf(n) + [-step, step].random()).clamp(0, selections.length-1)]
        );
        this.selections = selections;
        this.step = step;
    }
}

export class Genome {
    constructor(
        genes = {}
    ) {
        this.genes = genes;
    }
    generate() {
        let params = {};
        Object.keys(this.genes)
            .forEach(key => params[key] = this.genes[key].generator());
        return params;
    }
    mutate(entity, n) {
		console.log(`Mutating ${n}`);
        let e = Object.clone(entity);
        let keys = Object.keys(e);
        while (n > 0 && keys.length > 0) {
            let key = keys.splice(Math.floor(Math.random() * keys.length), 1)[0];
            e[key] = this.genes[key].drifter(e[key]);
        }
        return e;
    }
    crossover(parents) {
        let e = Object.clone(parents[0]);
        let keys = Object.keys(e);
        Object.keys(this.genes).forEach(key => {
            e[key] = parents[Math.floor(Math.random() * parents.length)][key];
        });
        return e;
    }
}

