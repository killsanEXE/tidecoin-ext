import React, { ReactNode, useState } from 'react'
import Nav from '../components/Nav'
import { useNavigate } from 'react-router-dom'
import { userStore } from '../stores/userStore'

type Props = {
}

export default function Layout({}: Props) {
  const navigate = useNavigate();

  const state = userStore()

  const [username, setUsername] = useState("");

  return (
    <div>
      <Nav/>
    </div>
  )
}

//tsrfc