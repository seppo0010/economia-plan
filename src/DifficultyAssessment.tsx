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
  const [subjectsPerCuatrimestre, setSubjectsPerCuatrimestre] = useState(3)
  useState(() => {
    (async () => {
      const graphData = await getGraphData()
      setSubjects(Object.fromEntries(graphData.nodes.sort((e1, e2) => e1.id - e2.id).map((n) => [n.id, n.label])))
    })()
  })

  const dispatch = useDispatch()
  const updateDifficulty = (difficulty: number) => {
    dispatch(setDifficulty(difficulty))
  }
  return (
    <div>
      <h2>Cuatrimestres para aprobar las materias</h2>
      <p>Estimar la dificultad de los finales. Aproximá qué porcentaje de finales pensás aprobar. Si pensás aprobar todos sería "100", si aprobás 4 de cada 5, "80".</p>
      <FormControl variant="outlined" style={{marginRight: 8}}>
        <InputLabel htmlFor="porcentaje">Porcentaje</InputLabel>
        <OutlinedInput
          required
          id="porcentaje"
          style={{width: 90}}
          labelWidth={80}
          type="number"
          value={subjectsDifficulty}
          error={subjectsDifficulty < 1 || subjectsDifficulty > 100}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDifficulty(parseInt(e.target.value, 10))}
          />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel htmlFor="materias-por-cuatrimestre">Finales por cuatrimestre</InputLabel>
        <Select
          labelId="label-materias-por-cuatrimestre"
          id="materias-por-cuatrimestre"
          value={subjectsPerCuatrimestre}
          onChange={(e: React.ChangeEvent<{value: unknown}>) => setSubjectsPerCuatrimestre(e.target.value as number)}
          labelWidth={180}
          style={{width: 200}}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default DifficultyAssessment
