import React from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Exercises from './components/Exercises'
import Templates from './components/Templates'
import PlanBuilder from './components/PlanBuilder'
import History from './components/History'
import Admin from './components/Admin'

export default function App(){
  return (
    <div className="app">
      <header className="header">
        <h2>Meatmaker</h2>
        <div className="small">Personal PWA</div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<PlanBuilder/>} />
          <Route path="/exercises" element={<Exercises/>} />
          <Route path="/templates" element={<Templates/>} />
          <Route path="/history" element={<History/>} />
          <Route path="/admin" element={<Admin/>} />
        </Routes>
      </main>

      <nav className="bottom-nav">
        <Link to="/" className="small">Plan</Link>
        <Link to="/templates" className="small">Templates</Link>
        <Link to="/exercises" className="small">Exercises</Link>
        <Link to="/history" className="small">History</Link>
        <Link to="/admin" className="small">Admin</Link>
      </nav>
    </div>
  )
}