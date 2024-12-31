import React from 'react'
import ResourceModule from './ResourceModule'

const clRescource = () => {
  return (
    <div>
      <ResourceModule
        apiEndpoint="room"
        title="Available Classrooms"
        dialogTitle="Add Classrooms"
      />
    </div>
  )
}

export default clRescource