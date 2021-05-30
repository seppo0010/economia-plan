import React, { useState } from 'react';
import GeneticAlgorithmConstructor from 'geneticalgorithm'
import { useSelector } from 'react-redux'
import { RootState } from './store'
import { getGraphData } from './plan'
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

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

function InscriptionRecommendation() {
  const subjectsDifficulty = useSelector((state: RootState) => state.subjectsDifficulty);
  const checked = useSelector((state: RootState) => state.subjectsStatus);
  const [subjects, setSubjects] = useState<null | { [k: string]: any; }>(null)
  const [edges, setEdges] = useState<null | { from: number, to: number }[]>(null)
  useState(() => {
    (async () => {
      const graphData = await getGraphData()
      setSubjects(Object.fromEntries(graphData.nodes.sort((e1, e2) => e1.id - e2.id).map((n) => [n.id, n.label])))
      setEdges(graphData.edges)
    })()
  })
  const [subjectsPerCuatrimestre, setSubjectsPerCuatrimestre] = useState(3)
  const [plan, setPlan] = useState<null | number[][]>(null)
  const isApproved = (subject: number, done: number[]) => {
    if (checked.has(subject.toString())) return true
    return done.filter((s) => s === subject).length === subjectsDifficulty[subject]
  }
  const canDo = (subject: number, done: number[]) => {
    if (!edges) return false;
    if (isApproved(subject, done)) return false;
    const requirements = edges.filter((e) => e.to === subject).map((e) => e.from)
    return requirements.every((requisito) => isApproved(requisito, done))
  }
  const phenotypeToPlan = (phenotype: number[]) => {
    const myPlan: number[][] = []
    while (!phenotype.every((s) => isApproved(s, myPlan.flat().flat()))) {
      const cuatri = []
      for (let i = 0; i < phenotype.length; i++) {
        const subject = phenotype[i]
        if (canDo(subject, myPlan.flat().flat())) {
          cuatri.push(subject)
          if (cuatri.length === subjectsPerCuatrimestre) break
        }
      }
      myPlan.push(cuatri)
    }
    return myPlan
  }

  const arePhenotypeEqual = (ph1: number[], ph2: number[]) => {
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
  const mutationFunction = (oldPhenotype: number[]) => {
    const phenotype = oldPhenotype.slice()
    while (arePhenotypeEqual(phenotype, oldPhenotype)) {
      const pos = Math.floor(Math.random() * (phenotype.length - 1));
      [phenotype[pos], phenotype[pos + 1]] = [phenotype[pos + 1], phenotype[pos]];
    }
    return phenotype
  }

  const fitnessFunction = (phenotype: number[]) => {
    return -phenotypeToPlan(phenotype).length
  }

  const getRandomPhenotype = () => {
    if (!subjects) return [];
    return shuffle(Object.keys(subjects).map((s) => parseInt(s, 10)).filter((s) => !checked.has(s.toString())))
  }
  const populationSize = 10;
  const defaultPopulations = Array.from({length: populationSize}).map(() => getRandomPhenotype())
  const createRandomPlan = () => {
    setPlan(phenotypeToPlan(getRandomPhenotype()))
  }
  const createGoodPlan = () => {
    let ga = GeneticAlgorithmConstructor({
      mutationFunction,
      fitnessFunction,
      population: defaultPopulations,
      populationSize,
    })
    setPlan(phenotypeToPlan(ga.evolve().evolve().evolve().evolve().evolve().evolve().best()))
  }
  return (
    <div>
      <h2>Plan de inscripciones</h2>
      <FormControl>
        <Select
          labelId="label-materias-por-cuatrimestre"
          id="materias-por-cuatrimestre"
          value={subjectsPerCuatrimestre}
          onChange={(e: React.ChangeEvent<{value: unknown}>) => setSubjectsPerCuatrimestre(e.target.value as number)}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </FormControl>
      {subjects && <Button onClick={createRandomPlan}>Crear plan aleatorio</Button>}
      {subjects && <Button onClick={createGoodPlan}>Crear plan piola</Button>}
      {plan && subjects && (
        plan.map((cuat, i) => (
          <>
            <h3>Cuatrimestre {i+1}</h3>
            <List>
            {cuat.map((subject) => (
                  <ListItem>
                    <ListItemText primary={subjects[subject]} />
                  </ListItem>
                ))}
            </List>
          </>
        ))
      )}
    </div>
  )
}
export default InscriptionRecommendation
