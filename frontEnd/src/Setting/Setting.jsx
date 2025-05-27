import React, { useEffect, useState } from 'react'
import { CgProfile } from 'react-icons/cg';
import { IoNotificationsOutline } from 'react-icons/io5';
let locales;
const language = sessionStorage.getItem("language");
if (language === "english" || language==null) {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}


const Setting = () => {
    const [isChecked, setIsChecked] = useState(language === "english"  || language ==null ? false : true);
    console.log(language==null);
    console.log(isChecked);
    const handleToggle = () => {
        setIsChecked(!isChecked);
        window.location.reload();
      };
      useEffect(() => {
        sessionStorage.setItem("language", isChecked ? "urdu" : "english");
      }, [isChecked]);
  return (
    <div className='w-full  bg-white shadow-sm flex'>
    <div className='mt-5 m-2 p-2 h-[25%] bg-gray-100 w-full flex justify-between '>
        <p className='p-2 text-base font-semibold '>{locales.labels.convert}</p>
            <label className="inline-flex items-center me-5 cursor-pointer  ">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isChecked}
                onChange={handleToggle}
              />
              <div className={`relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 ${isChecked ? "peer-checked:bg-green-600" : ""} peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600`}></div>
              <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-500">
                {isChecked ? locales.header.urdu: locales.header.english}
              </span>
            </label>
          </div>
          </div>
  )
}

export default Setting