import React from 'react'
import './Nav.scss';
import WalletIcon from './icons/WalletIcon';
import SettingsIcon from './icons/SettingsIcon';

type Props = {}

export default function Nav({}: Props) {
  return (
    <div className='main-nav'>
        <button className='nav-btn'><WalletIcon /></button>
        <button className='nav-btn'><SettingsIcon /></button>
    </div>
  )
}