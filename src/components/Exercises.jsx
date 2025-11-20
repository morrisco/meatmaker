import React, {useEffect, useState} from 'react'
import { db, addExercise, updateExercise, deleteExercise } from '../db'

export default function Exercises(){
  const [exs, setExs] = useState([])
  const [name, setName] = useState('')
  const [muscle, setMuscle] = useState('')

  useEffect(()=> {
    let mounted = true
    db.exercises.orderBy('name').toArray().then(list => { if (mounted) setExs(list) })
    const sub = db.exercises.hook('creating', ()=>{})
    return ()=>{ mounted=false; db.exercises.hook('creating').unsubscribe && sub && sub.unsubscribe }
  },[])

  async function handleAdd(){
    if (!name.trim()) return
    await addExercise({name: name.trim(), muscleGroup: muscle.trim()})
    const list = await db.exercises.orderBy('name').toArray()
    setExs(list); setName(''); setMuscle('')
  }

  async function handleDelete(id){
    if (!confirm('Delete this exercise?')) return
    await deleteExercise(id)
    const list = await db.exercises.orderBy('name').toArray()
    setExs(list)
  }

  async function toggleRename(ex){
    const newName = prompt('Edit name', ex.name)
    if (!newName) return
    await updateExercise(ex.id, { name: newName })
    setExs(await db.exercises.orderBy('name').toArray())
  }

  return (
    <div>
      <div className="card">
        <h3>Exercises</h3>
        <div className="small">Add new exercise to your database</div>
        <input placeholder="Exercise name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Muscle group (optional)" value={muscle} onChange={e=>setMuscle(e.target.value)} />
        <button onClick={handleAdd}>Add Exercise</button>
      </div>

      <div className="card">
        <h3>Your Exercises</h3>
        <ul className="list">
          {exs.map(e => (
            <li key={e.id} className="item">
              <div>
                <strong>{e.name}</strong>
                <div className="small">{e.muscleGroup}</div>
              </div>
              <div style={{display:'flex', gap:8}}>
                <button onClick={()=>toggleRename(e)}>Rename</button>
                <button onClick={()=>handleDelete(e.id)} style={{background:'#aa2a2a'}}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}