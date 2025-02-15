import React from 'react';
export function HeaderSkeleton() {
  return (
    <div className="h-[80px] z-[50] sticky top-0 right-0 pt-[10px] bg-white shadow-lg animate-pulse">
      <div className="flex justify-between mt-3 px-3">
        
        <div className="">
          <div className="flex gap-3">
            <div className="h-6 w-24 bg-gray-300 rounded"></div>
            <div className="h-6 w-6 bg-gray-300 rounded-full"></div>
          </div>
          <div className="mt-1">
            <div className="h-4 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="">
          <div className="flex gap-2 border w-96  rounded-md p-2">
            <div className="h-6 w-6 bg-gray-300 rounded"></div>
            <div className="h-6 w-full bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="flex mr-3 justify-normal">
          
          <div>
            <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
          </div>

          <div className="ml-2">
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
          </div>

          <div className="flex flex-col mt-2 ml-2">
            <div className="h-4 w-20 bg-gray-300 rounded"></div>
            <div className="h-3 w-14 bg-gray-300 rounded mt-1"></div>
          </div>

          <div className="ml-3 mt-3">
            <div className="h-4 w-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SideMenuSkeleton() {
  return (
    <aside className="h-screen flex flex-col items-center overflow-y-auto overflow-x-hidden w-16 animate-pulse bg-gray-300">
      
      {/* Toggle Button Skeleton */}
      <div className="w-full flex justify-end p-2 mr-2">
        <div className="h-8 w-8 bg-gray-400 "></div>
      </div>

      {/* Menu Items Skeleton */}
      <ul className="mt-6 w-full">
        {[...Array(7)].map((_, index) => (
          <li key={index} className="mt-2 px-4">
            <div className="w-full flex flex-col items-center gap-3 p-3 rounded-md">
              <div className="h-6 w-6 bg-gray-400 rounded"></div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function HomeSkeleton() {
  return (
    <div className="animate-pulse">

      <div className="flex flex-wrap justify-between gap-2 mt-9 px-5">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-60 h-40 rounded-md bg-gray-200">
            <div className="h-4 w-1/2 bg-gray-300 rounded m-1"></div>
            <div className="flex flex-row mt-3">
              <div className="m-2 w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col ml-5">
                <div className="h-6 w-12 bg-gray-300 rounded mt-9"></div>
                <div className="h-3 w-20 bg-gray-300 rounded mt-2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6 px-5">
    
        <div className="flex-1 mr-4">
          <div className="h-6 w-1/4 bg-gray-200 rounded mb-4"></div>
          <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="w-1/4">
          <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center mt-6">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="ml-4">
                <div className="h-4 w-16 bg-gray-300 rounded"></div>
                <div className="h-3 w-24 bg-gray-300 rounded mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-20 h-20"></div>
    </div>
  )
}
