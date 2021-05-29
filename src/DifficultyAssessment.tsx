import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getGraphData, subjectLength } from './plan'
import { setDifficulty } from './subjectsDifficulty'
import { RootState } from './store'

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';

function DifficultyAssessment() {
  const subjectsDifficulty = useSelector((state: RootState) => state.subjectsDifficulty);
  const checked = useSelector((state: RootState) => state.subjectsStatus);
  const [subjects, setSubjects] = useState<null | { [k: string]: any; }>(null)
  const [percentaje, setPercentaje] = useState(100)
  useState(() => {
    (async () => {
      const graphData = await getGraphData()
      setSubjects(Object.fromEntries(graphData.nodes.sort((e1, e2) => e1.id - e2.id).map((n) => [n.id, n.label])))
    })()
  })

  const dispatch = useDispatch()
  const updateDifficulty = (id: string, difficulty: number) => {
    dispatch(setDifficulty(id, difficulty))
  }
  const generateCuatrimestres = () => {
    if (percentaje < 1 || percentaje > 100) return
    if (!subjects) return
    const prob = percentaje / 100
    Object.keys(subjects).forEach((id) => {
      let baseDifficulty = subjectLength(id)
      let i
      for (i = 0; i < 3; i++) {
        if (Math.random() < prob) break
      }
      updateDifficulty(id, baseDifficulty + i)
    })
  }
  return (
    <div>
      <h2>Cuatrimestres para aprobar las materias</h2>
      <p>Determinar la dificultad estimada de cada materia para armar un plan. La dificultad se mide en cuatrimestes desde inscripción hasta aprobar el final.</p>
      <Grid container spacing={3}>
        {subjects && Object.entries(subjects).filter(([id]) => !checked.has(id)).map(([id, label]) => (
          <Grid item key={id} xs={4}>
            <Grid>
            {label}
            </Grid>
            <FormControl>
              <Select
                labelId={'label-cuatrimestres-' + id}
                id={'cuatrimestres-' + id}
                value={subjectsDifficulty[id] || subjectLength(id)}
                onChange={(e: React.ChangeEvent<{value: unknown}>) => updateDifficulty(id, e.target.value as number)}
              >
                <MenuItem value={subjectLength(id) + 0}>{subjectLength(id) + 0}</MenuItem>
                <MenuItem value={subjectLength(id) + 1}>{subjectLength(id) + 1}</MenuItem>
                <MenuItem value={subjectLength(id) + 2}>{subjectLength(id) + 2}</MenuItem>
                <MenuItem value={subjectLength(id) + 3}>{subjectLength(id) + 3}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
      <h3>Generar aleatoriamente según probabilidad de aprobar cada cursada</h3>
      <FormControl variant="outlined" style={{marginRight: 8}}>
        <InputLabel htmlFor="porcentaje">Porcentaje</InputLabel>
        <OutlinedInput
          required
          id="porcentaje"
          style={{width: 90}}
          labelWidth={80}
          type="number"
          value={percentaje}
          error={percentaje < 1 || percentaje > 100}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPercentaje(parseInt(e.target.value, 10))}
          />
      </FormControl>
      <Button variant="contained" color="primary" onClick={generateCuatrimestres}>Generar</Button>
    </div>
  )
}

export default DifficultyAssessment
