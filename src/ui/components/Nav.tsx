import React from 'react'
import './Nav.scss';
import WalletIcon from './icons/WalletIcon';
import SettingsIcon from './icons/SettingsIcon';
import { useNavigate } from 'react-router-dom';

type Props = {}

export default function Nav({ }: Props) {

  const navigate = useNavigate();

  return (
    <div className='main-nav'>
      <button className='nav-btn' onClick={() => { navigate("/home/wallet") }}><WalletIcon /></button>
      <button className='nav-btn' onClick={() => { navigate("/home/settings") }}><SettingsIcon /></button>
    </div>
  )
}