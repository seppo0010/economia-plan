import GeneticAlgorithmConstructor from 'geneticalgorithm'
import { subjectLength } from './plan'

declare interface Phenotype {
  subjectsOrder: number[],
  difficulty: {[subject: string]: number}
}


function estimateSubjectsForNextCuatrimestre(
  setProgress: (p: number) => void,
  subjects: {[subject: string]: string},
  subjectsDifficulty: number,
  checked: Set<string>,
  edges: { from: number, to: number }[],
  subjectsPerCuatrimestre: number,
  populationSize: number,
  simulations: number,
) {
  setProgress(0)
  function shuffle(array: any[]): any[] {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }
  const getRandomPhenotype = (): null | Phenotype => {
    const getDifficulty = () => {
      const prob = subjectsDifficulty / 100
      return Object.fromEntries(Object.keys(subjects).map((id) => {
        let baseDifficulty = subjectLength(id)
        let i
        for (i = 0; i < 3; i++) {
          if (Math.random() < prob) break
        }
        return [id, baseDifficulty + i]
      }))
    }

    return {
      subjectsOrder: shuffle(Object.keys(subjects).map((s) => parseInt(s, 10)).filter((s) => !checked.has(s.toString()))),
      difficulty: getDifficulty(),
    }
  }
  const isApproved = (subject: number, done: number[], phenotype: Phenotype) => {
    if (checked.has(subject.toString())) return true
    return done.filter((s) => s === subject).length === phenotype.difficulty[subject]
  }
  const canDo = (subject: number, done: number[], phenotype: Phenotype) => {
    if (isApproved(subject, done, phenotype)) return false;
    const requirements = edges.filter((e) => e.to === subject).map((e) => e.from)
    return requirements.every((requisito) => isApproved(requisito, done, phenotype))
  }
  const phenotypeToPlan = (phenotype: Phenotype): number[][] => {
    const myPlan: number[][] = []
    while (!phenotype.subjectsOrder.every((s) => isApproved(s, myPlan.flat().flat(), phenotype))) {
      const cuatri = []
      for (let i = 0; i < phenotype.subjectsOrder.length; i++) {
        const subject = phenotype.subjectsOrder[i]
        if (canDo(subject, myPlan.flat().flat(), phenotype)) {
          cuatri.push(subject)
          if (cuatri.length === subjectsPerCuatrimestre) break
        }
      }
      myPlan.push(cuatri)
    }
    return myPlan
  }

  const arePhenotypeEqual = (ph1: Phenotype, ph2: Phenotype) => {
    const cs1 = phenotypeToPlan(ph1)
    const cs2 = phenotypeToPlan(ph2)
    if (cs1.length !== cs2.length) return false
    for (let i = 0; i < cs1.length; i++) {
      if (JSON.stringify(cs1[i].sort()) !== JSON.stringify(cs2[i].sort())) {
        return false
      }
    }
    return true
  }

  const fitnessFunction = (phenotype: Phenotype) => {
    return -phenotypeToPlan(phenotype).length
  }

  const mutationFunction = (oldPhenotype: Phenotype) => {
    const {difficulty} = oldPhenotype
    const subjectsOrder = oldPhenotype.subjectsOrder.slice()
    while (arePhenotypeEqual({
      subjectsOrder,
      difficulty,
    }, oldPhenotype)) {
      const pos = Math.floor(Math.random() * (subjectsOrder.length - 1));
      [subjectsOrder[pos], subjectsOrder[pos + 1]] = [subjectsOrder[pos + 1], subjectsOrder[pos]];
    }
    return {
      subjectsOrder,
      difficulty,
    }
  }
  const subjectsCount = Object.fromEntries(Object.keys(subjects).map((id) => [id, 0]))
  for (let i = 0; i < simulations; i++) {
    setProgress(i / simulations)
    const defaultPopulations = Array.from({length: populationSize}).map(() => getRandomPhenotype())
    let ga = GeneticAlgorithmConstructor({
      mutationFunction,
      fitnessFunction,
      population: defaultPopulations,
      populationSize,
    })
    phenotypeToPlan(ga.evolve().evolve().evolve().evolve().evolve().evolve().best())[0].forEach((s) => {
      subjectsCount[s.toString()] += 1
    })
  }
  return Object.entries(subjectsCount).filter(([id, s]) => s > 0).sort(([_1, e1], [_2, e2]) => - e1 + e2)
}

/* eslint-disable no-restricted-globals */
const ctx: Worker = self as any;

ctx.onmessage = (event) => {
  const id = event.data[0]
  const method = event.data[1]
  const params = event.data.slice(2)
  const exposed = {
    estimateSubjectsForNextCuatrimestre,
  } as any
  ctx.postMessage([`return_${id}`, exposed[method].apply(null, [(progress: number) => {
    ctx.postMessage([`progress_${id}`, progress])
  }].concat(params))])
};
export default null as any;
