// Dexie DB schema and helpers
import Dexie from 'dexie'
import { sampleExercises } from './seed'

export const db = new Dexie('meatmaker_db')
db.version(1).stores({
  exercises: '++id,name,muscleGroup,createdAt',
  templates: '++id,name,createdAt',
  plans: '++id,name,createdAt',
  workouts: '++id,date,planId,completed,createdAt',
  history: '++id,workoutId,exerciseId,date'
})

// on first run, populate some exercises
async function populateIfEmpty(){
  const count = await db.exercises.count()
  if (count === 0) {
    await db.exercises.bulkAdd(sampleExercises.map(e => ({ ...e, createdAt: new Date().toISOString() })))
  }
}

populateIfEmpty()

// helpers
export const addExercise = (data) => db.exercises.add({...data, createdAt: new Date().toISOString()})
export const updateExercise = (id, changes) => db.exercises.update(id, changes)
export const deleteExercise = (id) => db.exercises.delete(id)

export const addTemplate = (data) => db.templates.add({...data, createdAt: new Date().toISOString()})
export const updateTemplate = (id, changes) => db.templates.update(id, changes)
export const deleteTemplate = (id) => db.templates.delete(id)

export const addPlan = (data) => db.plans.add({...data, createdAt: new Date().toISOString()})
export const updatePlan = (id, changes) => db.plans.update(id, changes)
export const deletePlan = (id) => db.plans.delete(id)

export const addWorkout = (data) => db.workouts.add({...data, createdAt: new Date().toISOString()})
export const updateWorkout = (id, changes) => db.workouts.update(id, changes)
export const deleteWorkout = (id) => db.workouts.delete(id)

export const resetAll = async () => {
  await db.exercises.clear()
  await db.templates.clear()
  await db.plans.clear()
  await db.workouts.clear()
  await db.history.clear()
  await populateIfEmpty()
}