import React, {useEffect, useState} from 'react'
import { db, addPlan, updatePlan, deletePlan, addWorkout, updateWorkout } from '../db'

const weekdays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']

export default function PlanBuilder(){
  const [templates, setTemplates] = useState([])
  const [plans, setPlans] = useState([])
  const [name, setName] = useState('')
  const [weeks, setWeeks] = useState(4)
  const [schedule, setSchedule] = useState({}) // weekday index -> templateId
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [generatedDays, setGeneratedDays] = useState([])

  useEffect(()=> {
    async function load(){
      setTemplates(await db.templates.toArray())
      setPlans(await db.plans.toArray())
    }
    load()
  },[])

  async function createPlan(){
    if (!name.trim()) return
    const p = { name: name.trim(), weeks: Number(weeks), schedule }
    await addPlan(p)
    setPlans(await db.plans.toArray()); setName('')
  }

  async function selectPlan(p){
    setSelectedPlan(p)
    // compute generated day list for UI: expand schedule across weeks
    const days=[]
    const wk = p.weeks || 4
    for(let w=0; w<wk; w++){
      for(let d=0; d<7; d++){
        days.push({ week: w+1, dayIndex: d, templateId: p.schedule?.[d] || null, completed:false })
      }
    }
    setGeneratedDays(days)
  }

  function setScheduleForDay(d, templateId){
    setSchedule(prev => ({...prev,[d]: templateId}))
  }

  async function saveScheduleToSelectedPlan(){
    if (!selectedPlan) return
    await updatePlan(selectedPlan.id, { schedule, weeks })
    const updated = await db.plans.toArray()
    setPlans(updated)
    alert('Plan saved')
  }

  async function markDayCompleted(idx){
    // mark generatedDays[idx] completed and optionally persist a workout instance
    const day = generatedDays[idx]
    if (!day) return
    const dateStr = new Date().toISOString()
    await addWorkout({ date: dateStr, planId: selectedPlan.id, completed: true, snapshot: day })
    const newGen = [...generatedDays]; newGen[idx].completed = true; setGeneratedDays(newGen)
    alert('Day marked completed and workout recorded')
  }

  return (
    <div>
      <div className="card">
        <h3>Create Plan</h3>
        <input placeholder="Plan name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Weeks" value={weeks} onChange={e=>setWeeks(e.target.value)} />
        <div className="small">Assign templates to weekdays</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:8,marginTop:8}}>
          {weekdays.map((wd, idx) => (
            <div key={idx}>
              <div className="small">{wd}</div>
              <select onChange={e=>setScheduleForDay(idx, e.target.value)} value={schedule[idx] || ''}>
                <option value=''>-- none --</option>
                {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={createPlan}>Create Plan</button>
      </div>

      <div className="card">
        <h3>Your Plans</h3>
        <ul className="list">
          {plans.map(p => (
            <li key={p.id} className="item">
              <div>
                <strong>{p.name}</strong>
                <div className="small">{p.weeks || 4} week(s)</div>
              </div>
              <div style={{display:'flex',gap:8}}>
                <button onClick={()=>selectPlan(p)}>Open</button>
                <button onClick={async ()=>{ if (confirm('Delete plan?')) { await deletePlan(p.id); setPlans(await db.plans.toArray()) } }} style={{background:'#aa2a2a'}}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {selectedPlan && (
        <div className="card">
          <h3>Editing: {selectedPlan.name}</h3>
          <div className="small">Weeks:
            <input style={{width:80,display:'inline-block',marginLeft:8}} type="number" value={weeks} onChange={e=>setWeeks(Number(e.target.value))} />
          </div>
          <div style={{marginTop:8}}>
            <div className="small">Change schedule (then Save)</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:8}}>
              {weekdays.map((wd, idx) => (
                <div key={idx}>
                  <div className="small">{wd}</div>
                  <select onChange={e=>setScheduleForDay(idx, e.target.value)} value={schedule[idx] || selectedPlan.schedule?.[idx] || ''}>
                    <option value=''>-- none --</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
            <div style={{marginTop:8}}>
              <button onClick={saveScheduleToSelectedPlan}>Save Plan</button>
            </div>
          </div>

          <div style={{marginTop:10}}>
            <h4>Generated days preview</h4>
            <ol>
              {generatedDays.map((d, idx) => (
                <li key={idx} className="small">
                  Week {d.week} - {weekdays[d.dayIndex]} - Template: {d.templateId ? `#${d.templateId}` : 'rest'} {' '}
                  <button onClick={()=>markDayCompleted(idx)} style={{marginLeft:8}}>Mark day complete</button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}