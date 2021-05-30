import React, { useState } from 'react';
import GeneticAlgorithmConstructor from 'geneticalgorithm'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import { subjectLength } from './plan'
import { getGraphData } from './plan'
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// https://stackoverflow.com/a/2450976
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

declare interface Phenotype {
  subjectsOrder: number[],
  difficulty: {[subject: string]: number}
}

function InscriptionRecommendation() {
  const subjectsDifficulty: number = useSelector((state: RootState) => state.subjectsDifficulty);
  const subjectsPerCuatrimestre: number  = useSelector((state: RootState) => state.subjectsPerCuatrimestre);
  const checked = useSelector((state: RootState) => state.subjectsStatus);
  const [subjects, setSubjects] = useState<null | { [k: string]: any; }>(null)
  const [edges, setEdges] = useState<null | { from: number, to: number }[]>(null)
  const [recommendedSubjects, setRecommendedSubjects] = useState<null | [string, number][]>(null)
  useState(() => {
    (async () => {
      const graphData = await getGraphData()
      setSubjects(Object.fromEntries(graphData.nodes.sort((e1, e2) => e1.id - e2.id).map((n) => [n.id, n.label])))
      setEdges(graphData.edges)
    })()
  })
  const isApproved = (subject: number, done: number[], phenotype: Phenotype) => {
    if (checked.has(subject.toString())) return true
    return done.filter((s) => s === subject).length === phenotype.difficulty[subject]
  }
  const canDo = (subject: number, done: number[], phenotype: Phenotype) => {
    if (!edges) return false;
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

  const fitnessFunction = (phenotype: Phenotype) => {
    return -phenotypeToPlan(phenotype).length
  }

  const getRandomPhenotype = (): null | Phenotype => {
    if (subjectsDifficulty < 1 || subjectsDifficulty > 100) return null
    if (!subjects) return null
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
  const populationSize = 10;
  const simulations = 100;
  const estimateSubjectsForNextCuatrimestre = () => {
    if (!subjects) return;
    const subjectsCount = Object.fromEntries(Object.keys(subjects).map((id) => [id, 0]))
    for (let i = 0; i < simulations; i++) {
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
    setRecommendedSubjects(Object.entries(subjectsCount).filter(([id, s]) => s > 0).sort(([_1, e1], [_2, e2]) => - e1 + e2))
  }
  return (
    <div>
      <h2>Inscripciones recomendadas</h2>
      {subjects && <Button onClick={estimateSubjectsForNextCuatrimestre}>Crear plan</Button>}
      {recommendedSubjects && subjects && (
        <List>
          {recommendedSubjects.map(([id, quant]) => (
            <ListItem>
              <ListItemText primary={`${subjects[id]} (${Math.round(10000 * quant / simulations) / 100}%)`} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}
export default InscriptionRecommendation
