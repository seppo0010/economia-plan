import React from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { setDifficulty, setSubjectsPerCuatrimestre } from './subjectsDifficulty'
import { RootState } from './store'

import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';

function DifficultyAssessment() {
  const subjectsDifficulty = useSelector((state: RootState) => state.subjectsDifficulty);
  const subjectsPerCuatrimestre = useSelector((state: RootState) => state.subjectsPerCuatrimestre);

  const dispatch = useDispatch()
  const updateDifficulty = (difficulty: number) => {
    dispatch(setDifficulty(difficulty))
  }
  const updateSubjectsPerCuatrimestre = (subjectsPerC: number) => {
    dispatch(setSubjectsPerCuatrimestre(subjectsPerC))
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
          onChange={(e: React.ChangeEvent<{value: unknown}>) => updateSubjectsPerCuatrimestre(e.target.value as number)}
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
