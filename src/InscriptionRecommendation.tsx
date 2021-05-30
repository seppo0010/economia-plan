import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'
import { RootState } from './store'
import { getGraphData } from './plan'
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import LinearProgress from '@material-ui/core/LinearProgress';
/* eslint-disable import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./estimateSubjects.worker';
import { Link } from "react-router-dom";

const populationSize = 10;
const simulations = 100;

function InscriptionRecommendation() {
  const subjectsDifficulty: number = useSelector((state: RootState) => state.subjectsDifficulty);
  const subjectsPerCuatrimestre: number  = useSelector((state: RootState) => state.subjectsPerCuatrimestre);
  const checked = useSelector((state: RootState) => state.subjectsStatus);
  const [subjects, setSubjects] = useState<null | { [k: string]: any; }>(null)
  const [edges, setEdges] = useState<null | { from: number, to: number }[]>(null)
  const [recommendedSubjects, setRecommendedSubjects] = useState<null | [string, number][]>(null)
  const [progress, setProgress] = useState<null | number>(null)
  const [processing, setProcessing] = useState(false)

  const updatePlan = async (subjects: { [k: string]: any; }, edges: { from: number, to: number }[]) => {
    setProcessing(true)
    const worker = new Worker();
    const id = new Date()
    worker.onmessage = (event) => {
      if (event.data[0] === `progress_${id}`) {
        setProgress(event.data[1] * 100)
      }
      if (event.data[0] === `return_${id}`) {
        setRecommendedSubjects(event.data[1])
        setProcessing(false)
      }
    }
    worker.postMessage([
      id,
      'estimateSubjectsForNextCuatrimestre',
      subjects,
      subjectsDifficulty,
      checked,
      edges,
      subjectsPerCuatrimestre,
      populationSize,
      simulations,
    ])
  }
  useState(() => {
    (async () => {
      const graphData = await getGraphData()
      const s = Object.fromEntries(graphData.nodes.sort((e1, e2) => e1.id - e2.id).map((n) => [n.id, n.label]))
      setSubjects(s)
      setEdges(graphData.edges)
      updatePlan(s, graphData.edges)
    })()
  })
  return (
    <div>
      <h2>Inscripciones recomendadas</h2>
      {subjects && edges && !processing && (<div>
        <Button onClick={() => updatePlan(subjects, edges)}>Probar de nuevo</Button>
        <Link component={Button} to="/">Volver a empezar</Link>
      </div>)}
      {progress !== null && processing && <LinearProgress variant="determinate" value={progress} />}
      {!processing && recommendedSubjects && subjects && (
        <List>
          {recommendedSubjects.map(([id, quant]) => (
            <ListItem key={id}>
              <ListItemText primary={`${subjects[id]} (${Math.round(10000 * quant / simulations) / 100}%)`} />
            </ListItem>
          ))}
        </List>
      )}
    </div>
  )
}
export default InscriptionRecommendation
