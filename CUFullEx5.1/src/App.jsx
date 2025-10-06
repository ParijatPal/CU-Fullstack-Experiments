import React from 'react'

export default function App(){
  return (
    <main style={{fontFamily: 'system-ui, sans-serif', padding: 24}}>
      <h1>React (Vite) — Dockerized</h1>
      <p>This is a minimal React app served by nginx after a multi-stage Docker build.</p>
      <p>Build locally: <code>npm run build</code>. Docker build will perform the same.</p>
    </main>
  )
}
