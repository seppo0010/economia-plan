import React, { useState } from 'react';
import { getGraphData } from './plan'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import './SubjectsStatusForm.css'

function SubjectsStatusForm() {
  const [nodes, setNodes] = useState<null | {id: string | number, label: string}[]>(null)
  const [checked, setChecked] = useState(new Set())
  const handleChange = (ev: any) => {
    const id = ev.target.name
    const newChecked = new Set()
    checked.forEach((c) => newChecked.add(c))
    if (checked.has(id)) {
      newChecked.delete(id)
    } else {
      newChecked.add(id)
    }
    setChecked(newChecked)
  }
  useState(() => {
    (async () => {
      setNodes((await getGraphData()).nodes)
    })()
  })
  return (
    <div id="subjects-status-form">
      {nodes && <div>
        <h2>¿Qué materias del C.P.C. aprobaste?</h2>
        <FormGroup row>
          {(nodes || []).map((node) => (
            <FormControlLabel
              key={node.id}
              control={<Checkbox checked={checked.has(node.id.toString())} onChange={handleChange} name={node.id.toString()} />}
              label={node.label}
            />
          ))}
        </FormGroup>
      </div>}
    </div>
  )
}

export default SubjectsStatusForm;
