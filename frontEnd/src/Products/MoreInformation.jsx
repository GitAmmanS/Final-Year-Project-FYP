import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCircleArrowLeft } from "react-icons/fa6";
import { BaseUrl } from '../utils/BaseUrl';

let locales;
const language = localStorage.getItem("language");
if (language === "english") {
  import("../locales/en.json").then((module) => {
    locales = module.default;
  });
} else {
  import("../locales/ur.json").then((module) => {
    locales = module.default;
  });
}

const MoreInformation = () => {
  const location = useLocation();
  const { item } = location.state;
  const navigate = useNavigate();

  return (
    <>
      <div className="text-xl font-semibold mt-5 ml-2 flex gap-2 items-center">
        <p
          onClick={() => navigate(-1)}
          className="cursor-pointer hover:text-green-700 transition text-black"
        >
          <FaCircleArrowLeft />
        </p>
        <h1 className="uppercase text-gray-800">{item.name} Detail</h1>
      </div>
      <div className="flex items-center justify-center mt-8">
        <div className="w-full max-w-4xl border-[2px] border-gray-300 shadow-lg bg-white rounded-lg overflow-hidden">
          <div className="flex justify-center bg-gray-100 p-5">
            <img
              src={`${BaseUrl}/${item.picture}`}
              alt="No Image Inserted"
              className="w-1/3 h-auto object-cover rounded-md shadow-md"
            />
          </div>

          <div className="p-5 space-y-4 text-gray-700">
            <p>
              <span className="font-bold">Category:</span> {item.category_ID.name || 'N/A'}
            </p>
            <p>
              <span className="font-bold">Company:</span> {item.company_ID.name || 'N/A'}
            </p>
            <p>
              <span className="font-bold">Model:</span> {item.model || 'N/A'}
            </p>

            <h2 className="text-lg font-bold mt-4">Specifications:</h2>
            <div className="ml-4 space-y-2">
              <p>
                <span className="font-medium">CPU:</span> {item.specs?.cpu?.name || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Operating System:</span> {item.specs?.os?.name || 'N/A'}
              </p>
              <p>
                <span className="font-medium">Other Specs:</span> {item.specs?.otherspecs || 'N/A'}
              </p>

              <h3 className="text-md font-semibold mt-2">RAM Details:</h3>
              <ul className="ml-4 list-disc">
                <li>
                  <span className="font-medium">Capacity:</span>{' '}
                  {item.specs?.ram?.[0]?.capacity?.size || 'N/A'}
                </li>
                <li>
                  <span className="font-medium">Type:</span> {item.specs?.ram?.[0]?.type?.name || 'N/A'}
                </li>
              </ul>

              <h3 className="text-md font-semibold mt-2">HDD Details:</h3>
              <ul className="ml-4 list-disc">
                <li>
                  <span className="font-medium">Capacity:</span>{' '}
                  {item.specs?.hdd?.[0]?.capacity?.size || 'N/A'}
                </li>
                <li>
                  <span className="font-medium">Type:</span> {item.specs?.hdd?.[0]?.type?.name || 'N/A'}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MoreInformation;
