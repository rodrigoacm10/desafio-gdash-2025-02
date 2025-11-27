import React from 'react'
import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div>
      <main>
        <Outlet /> {/* aqui entram Home/Login/Dashboard/etc */}
      </main>
    </div>
  )
}

export default App
