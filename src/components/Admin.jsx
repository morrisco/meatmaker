import React from 'react'
import { resetAll } from '../db'

export default function Admin(){
  return (
    <div>
      <div className="card">
        <h3>Admin / Data</h3>
        <div className="small">Reset all local data (includes exercises, templates, plans, history)</div>
        <button onClick={async ()=>{ if (confirm('Delete all local data and reset to starter exercises?')) { await resetAll(); alert('Reset complete — reload the page.'); window.location.reload(); } }} style={{background:'#aa2a2a'}}>Reset All Data</button>
      </div>

      <div className="card">
        <h3>Notes</h3>
        <ul>
          <li className="small">Data is stored locally in your browser (IndexedDB). No account required.</li>
          <li className="small">To move data between devices you can add export/import in a future version.</li>
        </ul>
      </div>
    </div>
  )
}