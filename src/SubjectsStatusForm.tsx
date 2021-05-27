import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { getGraphData } from './plan'
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { toggleSubject } from './subjectsStatus'
import { RootState } from './store'
import './SubjectsStatusForm.css'

function SubjectsStatusForm() {
  const checked = useSelector((state: RootState) => state.subjectsStatus);
  const dispatch = useDispatch()
  const [nodes, setNodes] = useState<null | {id: string | number, label: string}[]>(null)
  const handleChange = (ev: any) => {
    const id = ev.target.name
    dispatch(toggleSubject(id))
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
