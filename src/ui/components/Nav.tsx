import React from 'react'
import './Nav.scss';
import { useNavigate } from 'react-router-dom';
import WalletIcon from '@/ui/components/icons/WalletIcon';
import SettingsIcon from '@/ui/components/icons/SettingsIcon';

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