# Goals

# HBGA

## Selection

* Fitness function performed entirely by user
    - Persist choices as elites and replace others with new generation (positive, checkbox)
    - Rate choices
        - Persist all selected to next generation (sort list)
        - Persist some or none to next generation (rating)
    - Prune choices (opposite of persist, negative)

* Pairs can be selected by user or AI
* Pairs are selected entirely by user


## Mutation

* Mutation randomly performed entirely by AI
    - Static randomness over time
    - Decreasing randomness over time (simulated annealing)
* Mutation performed by AI but manual tweaks by user allowed
    - Tweak in-place
    - Generate copy with tweaks

## Crossover

Crossover is performed entirely by the AI.

## Termination

Decided by user.
