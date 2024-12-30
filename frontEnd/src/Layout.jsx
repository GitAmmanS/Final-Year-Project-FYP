import React, { useState, useEffect } from 'react';
import SideMenu from './SideMenu/SideMenu';
import ShowSomeTimes from './ShowSomeTimes';
import Loading from './Loading/loading';

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="loading-container flex justify-center items-center h-screen w-screen">
          <Loading type="balls" color="#3498db" />
        </div>
      ) : (
        <div className="flex flex-col h-screen bg-white">
          <div className="flex flex-0 overflow-y-hidden">
            <ShowSomeTimes>
              <SideMenu />
            </ShowSomeTimes>
            <main className="flex-1 overflow-y-auto">{children}</main>
          </div>
        </div>
      )}
    </>
  );
};

export default Layout;
