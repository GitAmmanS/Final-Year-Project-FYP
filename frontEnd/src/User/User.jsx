import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BaseUrl } from '../utils/BaseUrl'
import { axiosInstance } from '../utils/AxiosInstance'
const User = () => {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        axiosInstance.get((`${BaseUrl}/users`)).then((response) => {
            setUsers(response.data.data)
            console.log(response.data.data)
        })
    }, [])
    return (
        <div className="p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">User List</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gray-300 ">
                        <tr>
                            <th className="py-2 px-4 border-b text-left">#</th>
                            <th className="py-2 px-4 border-b text-left">Name</th>
                            <th className="py-2 px-4 border-b text-left">Email</th>
                            <th className="py-2 px-4 border-b text-left">Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                <tr key={user.id} className="border-b hover:bg-gray-200 text-sm">
                                    <td className="py-2 px-4">{index + 1}</td>
                                    <td className="py-2 px-4">{user.name}</td>
                                    <td className="py-2 px-4">{user.email}</td>
                                    <td className="py-2 px-4">{user.role}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-4 text-center text-gray-500">No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default User