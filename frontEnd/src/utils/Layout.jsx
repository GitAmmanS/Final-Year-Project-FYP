import React, { useState, useEffect } from 'react';
import SideMenu from '../SideMenu/SideMenu';
import ShowSomeTimes from './ShowSomeTimes';
import { HeaderSkeleton, SideMenuSkeleton, HomeSkeleton, LoginSkeleton } from './Skeleton'
const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const user = JSON.parse(sessionStorage.getItem('user'));
  console.log(user);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>

      {isLoading ? (
        <ShowSomeTimes>
          <div className="flex flex-col h-screen bg-white">
            <div className="flex flex-0 overflow-y-hidden">
              {
                user? <>
                  <SideMenuSkeleton />
                  <main className="flex-1 overflow-y-auto"> <HeaderSkeleton />
                    <HomeSkeleton /></main>
                </>
                  : <LoginSkeleton />
              }

            </div>
          </div>
        </ShowSomeTimes>
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
