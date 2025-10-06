import React, {useEffect, useState} from 'react'

export default function App(){
  const [msg, setMsg] = useState('loading...')
  useEffect(()=>{
    fetch('/api/hello').then(r=>r.json()).then(d=>setMsg(d.message)).catch(e=>setMsg('backend unreachable'))
  },[])
  return (
    <main style={{fontFamily: 'system-ui, sans-serif', padding: 24}}>
      <h1>Full Stack App — Deployed on AWS (ECS + ALB)</h1>
      <p>Backend says: <code>{msg}</code></p>
    </main>
  )
}
