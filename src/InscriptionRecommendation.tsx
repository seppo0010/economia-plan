import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store'
import { getGraphData } from './plan'
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
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
  const createPlan = () => {
    if (!subjects) return;
    const availableSubjects = shuffle(Object.keys(subjects).map((s) => parseInt(s, 10)).filter((s) => !checked.has(s.toString())))
    const isApproved = (subject: number, done: number[]) => {
      return done.filter((s) => s === subject).length === subjectsDifficulty[subject]
    }
    const canDo = (subject: number, done: number[]) => {
      if (!edges) return false;
      if (isApproved(subject, done)) return false;
      const requirements = edges.filter((e) => e.to === subject).map((e) => e.from)
      return requirements.every((requisito) => isApproved(requisito, done))
    }
    const myPlan: number[][] = []
    while (!availableSubjects.every((s) => isApproved(s, myPlan.flat().flat()))) {
      const cuatri = []
      for (let i = 0; i < availableSubjects.length; i++) {
        const subject = availableSubjects[i]
        if (canDo(subject, myPlan.flat().flat())) {
          cuatri.push(subject)
          if (cuatri.length === subjectsPerCuatrimestre) break
        }
      }
      myPlan.push(cuatri)
    }
    setPlan(myPlan)
  }
  return (
    <div>
      <h2>Plan de inscripciones</h2>
      {subjects && <Button onClick={createPlan}>Crear plan aleatorio</Button>}
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
