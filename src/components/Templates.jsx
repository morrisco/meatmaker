import React, {useEffect, useState} from 'react'
import { db, addTemplate, updateTemplate, deleteTemplate } from '../db'

export default function Templates(){
  const [templates, setTemplates] = useState([])
  const [name, setName] = useState('')
  const [exList, setExList] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)

  useEffect(()=> {
    async function load(){
      setTemplates(await db.templates.toArray())
      setExList(await db.exercises.orderBy('name').toArray())
    }
    load()
  },[])

  async function createTemplate(){
    if (!name.trim()) return
    // initial empty items
    await addTemplate({ name: name.trim(), items: [] })
    setTemplates(await db.templates.toArray()); setName('')
  }

  function addItemToTemplate(t){
    const exId = parseInt(selectedExercise,10)
    if (!exId) return alert('Select exercise')
    const reps = parseInt(prompt('reps per set', '8') || '8',10)
    const sets = parseInt(prompt('number of sets','3') || '3',10)
    const weight = parseFloat(prompt('planned weight (lbs)', '135') || '0')
    const item = { exerciseId: exId, sets, reps, weight, perSet: Array(sets).fill(null).map(()=>({ reps, weight })) }
    const newItems = (t.items || []).concat(item)
    updateTemplate(t.id, { items: newItems }).then(async ()=> setTemplates(await db.templates.toArray()))
  }

  async function deleteTemplateById(id){
    if (!confirm('Delete template?')) return
    await deleteTemplate(id)
    setTemplates(await db.templates.toArray())
  }

  return (
    <div>
      <div className="card">
        <h3>Templates</h3>
        <input placeholder="Template name" value={name} onChange={e=>setName(e.target.value)} />
        <button onClick={createTemplate}>Create Template</button>
      </div>

      <div className="card">
        <h4>Add exercise to a template</h4>
        <div className="small">Select an exercise and then choose "Add" on a template</div>
        <select onChange={e=>setSelectedExercise(e.target.value)} value={selectedExercise || ''}>
          <option value="">-- select exercise --</option>
          {exList.map(ex => <option key={ex.id} value={ex.id}>{ex.name} ({ex.muscleGroup})</option>)}
        </select>
      </div>

      <div className="card">
        <h3>Your Templates</h3>
        <ul className="list">
          {templates.map(t => (
            <li key={t.id} className="item">
              <div>
                <strong>{t.name}</strong>
                <div className="small">{(t.items || []).length} exercises</div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <button onClick={()=>addItemToTemplate(t)}>Add</button>
                <button onClick={async ()=>{ const newName = prompt('Rename template', t.name); if (newName) { await updateTemplate(t.id, { name: newName}); setTemplates(await db.templates.toArray()) }}}>Rename</button>
                <button onClick={()=>deleteTemplateById(t.id)} style={{background:'#aa2a2a'}}>Delete</button>
              </div>
              <div style={{marginTop:8}}>
                {(t.items || []).map((it, idx) => (
                  <div key={idx} className="small">• {it.exerciseId ? (db.exercises.get(it.exerciseId).then(ex=>ex?.name).catch(()=>'')) : ''} {it.sets}×{it.reps} @ {it.weight}lbs</div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}