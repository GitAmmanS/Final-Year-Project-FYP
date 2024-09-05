import React from 'react';
import Header from './Header/Header'
import SideMenu from './SideMenu/SideMenu';
import ShowSomeTimes from './ShowSomeTimes';
const Layout = ({children}) => {
  return (
    <div className='flex flex-col h-screen bg-amber-50 '>
        <ShowSomeTimes>
      <Header />
      </ShowSomeTimes>
      <div className='flex flex-1  overflow-y-hidden '>
      <ShowSomeTimes>
        <SideMenu />
        </ShowSomeTimes>
        <main className='flex-1  overflow-y-auto '>
          {children}
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  )
}

export default Layout