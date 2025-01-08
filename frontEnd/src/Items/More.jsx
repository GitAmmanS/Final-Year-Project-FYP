// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { BaseUrl } from '../BaseUrl';
// import axios from 'axios';

// const More = () => {
//     const { _id } = useParams();
//     const [item, setItem] = useState(null);

//     useEffect(() => {
//         axios.get(`${BaseUrl}/items/item/${_id}`)
//             .then((res) => {
//                 setItem(res.data.data);
//             })
//             .catch((err) => {
//                 console.log(err.message);
//             });
//     }, [_id]);

//     console.log(item);

//     if (!item) {
//         return <p className="text-center text-gray-500">Loading...</p>;
//     }

//     return (
//         <div className="container mx-auto p-4">
//             <div className="itemData mb-6">
//                 <img 
//                     src={`${BaseUrl}/${item.picture}`} 
//                     alt="Item" 
//                     className="  w-96 h-64  rounded-md"
//                 />
//             </div>
            
//             <div className="itemDetails">
//                 <h2 className="text-2xl font-bold mb-4">Details:</h2>
//                 <table className="table-auto w-full mb-6 text-left">
//                     <tbody>
//                         <tr>
//                             <td className="font-semibold">ID</td>
//                             <td>{item.serialNumber}</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Name</td>
//                             <td>{item.name}</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Category</td>
//                             <td>{item.category_ID?.name}</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Company</td>
//                             <td>{item.company_ID?.name}</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Status</td>
//                             <td>{item.status_ID?.name}</td>
//                         </tr>
//                         <tr>
//                             <td className="font-semibold">Install Date</td>
//                             <td>{new Date(item.installDate).toLocaleDateString()}</td>
//                         </tr>
//                     </tbody>
//                 </table>

//                 {item.specs && (
//                     <>
//                         <h2 className="text-2xl font-bold mb-4">Specifications:</h2>
//                         <table className="table-auto w-full mb-6 text-left">
//                             <tbody>
//                                 <tr>
//                                     <td className="font-semibold">Operating System</td>
//                                     <td>{item.specs.os?.name || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-semibold">CPU</td>
//                                     <td>{item.specs.cpu?.name || 'N/A'}</td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-semibold">RAM</td>
//                                     <td>
//                                         <ul className="list-disc list-inside">
//                                             {item.specs.ram && item.specs.ram.length > 0
//                                                 ? item.specs.ram.map((ramItem, index) => (
//                                                     <li key={index} className="mb-2">
//                                                         Capacity: {ramItem.capacity?.size || 'N/A'}, 
//                                                         Type: {ramItem.type?.name || 'N/A'},
//                                                         Status: {ramItem.status?.name || 'N/A'}
//                                                     </li>
//                                                 ))
//                                                 : 'N/A'}
//                                         </ul>
//                                     </td>
//                                 </tr>
//                                 <tr>
//                                     <td className="font-semibold">HDD</td>
//                                     <td>
//                                         <ul className="list-disc list-inside">
//                                             {item.specs.hdd && item.specs.hdd.length > 0
//                                                 ? item.specs.hdd.map((hddItem, index) => (
//                                                     <li key={index} className="mb-2">
//                                                         Capacity: {hddItem.capacity?.size || 'N/A'}, 
//                                                         Type: {hddItem.type?.name || 'N/A'},
//                                                         Status: {hddItem.status?.name || 'N/A'}
//                                                     </li>
//                                                 ))
//                                                 : 'N/A'}
//                                         </ul>
//                                     </td>
//                                 </tr>
//                             </tbody>
//                         </table>
//                     </>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default More;
