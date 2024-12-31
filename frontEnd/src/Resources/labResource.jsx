import React from 'react'
import ResourceModule from './ResourceModule'

const labResource = () => {
  return (
    <div>
      <ResourceModule
        apiEndpoint="lab"
        title="Available Labs"
        dialogTitle="Add Lab"
      />
    </div>
  )
}

export default labResource