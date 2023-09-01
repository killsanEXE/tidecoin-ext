import React, { ReactNode, useState } from 'react'
import Nav from '../components/Nav'
import { useNavigate } from 'react-router-dom'
import { userStore } from '../stores/userState'

type Props = {
}

export default function Layout({}: Props) {
  // const navigate = useNavigate();

  const state = userStore()

  const [username, setUsername] = useState("");

  return (
    <div>
      <input type="text" value={username} onChange={(e) => {setUsername(e.target.value)}}/>
      <button onClick={() => {state.update({username})}}>UPDATE</button>
      <p>{state.user.username}</p>
      <Nav/>
    </div>
  )
}

//tsrfc