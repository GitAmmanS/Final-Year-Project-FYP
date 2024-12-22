import React from 'react';
import SideMenu from './SideMenu/SideMenu';
import ShowSomeTimes from './ShowSomeTimes';
const Layout = ({children}) => {
  return (
    <div className='flex flex-col h-screen bg-white '>
      <div className='flex flex-1  overflow-y-hidden '>
      <ShowSomeTimes>
        <SideMenu />
        </ShowSomeTimes>
        <main className='flex-1  overflow-y-auto '>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout