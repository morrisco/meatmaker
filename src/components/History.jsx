import React, {useEffect, useState} from 'react'
import { db } from '../db'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function History(){
  const [exList, setExList] = useState([])
  const [selectedEx, setSelectedEx] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(()=> {
    async function load(){
      const ex = await db.exercises.orderBy('name').toArray()
      setExList(ex)
    }
    load()
  },[])

  useEffect(()=> {
    async function loadHist(){
      if (!selectedEx) { setHistory([]); return }
      // for MVP: scan history table for entries for this exercise and collect weight/time
      const all = await db.history.where('exerciseId').equals(Number(selectedEx)).toArray()
      // simplistic: assume each history entry has actualWeight and date
      const points = all.sort((a,b)=>new Date(a.date)-new Date(b.date)).map(h => ({ date: h.date, weight: h.actualWeight || 0 }))
      setHistory(points)
    }
    loadHist()
  },[selectedEx])

  const data = {
    labels: history.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (lbs)',
        data: history.map(p => p.weight),
        borderColor: '#1fa64a',
        backgroundColor: 'rgba(31,166,74,0.2)'
      }
    ]
  }

  return (
    <div>
      <div className="card">
        <h3>Progress</h3>
        <div className="small">Pick an exercise to see weight-over-time</div>
        <select onChange={e=>setSelectedEx(e.target.value)} value={selectedEx||''}>
          <option value=''>-- select exercise --</option>
          {exList.map(ex => <option key={ex.id} value={ex.id}>{ex.name}</option>)}
        </select>
      </div>

      <div className="card">
        <h4>Chart</h4>
        {history.length === 0 ? <div className="small">No data yet</div> : <Line data={data} />}
      </div>
    </div>
  )
}