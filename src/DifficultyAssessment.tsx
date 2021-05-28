import React, { useState } from 'react';
import { getGraphData, subjectLength } from './plan'

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

function DifficultyAssessment() {
  const [subjects, setSubjects] = useState<null | { [k: string]: any; }>(null)
  useState(() => {
    (async () => {
      const graphData = await getGraphData()
      setSubjects(Object.fromEntries(graphData.nodes.sort((e1, e2) => e1.id - e2.id).map((n) => [n.id, n.label])))
    })()
  })

  return (
    <div>
      <h2>Cuatrimestres para aprobar las materias</h2>
      <p>Determinar la dificultad estimada de cada materia para armar un plan</p>
      <Grid container spacing={3}>
        {subjects && Object.entries(subjects).map(([id, label]) => (
          <Grid item key={id} xs={4}>
            <Grid>
            {label}
            </Grid>
            <FormControl>
              <Select
                labelId={'label-cuatrimestres-' + id}
                id={'cuatrimestres-' + id}
                value={subjectLength(id).toString()}
                onChange={() => {}}
              >
                <MenuItem value={subjectLength(id) * 1}>{subjectLength(id) * 1}</MenuItem>
                <MenuItem value={subjectLength(id) * 2}>{subjectLength(id) * 2}</MenuItem>
                <MenuItem value={subjectLength(id) * 3}>{subjectLength(id) * 3}</MenuItem>
                <MenuItem value={subjectLength(id) * 4}>{subjectLength(id) * 4}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}

export default DifficultyAssessment
