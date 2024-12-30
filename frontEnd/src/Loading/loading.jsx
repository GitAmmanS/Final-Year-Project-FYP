import React from 'react';
import ReactLoading from 'react-loading';
 
const loading = ({ type, color }) => (
    <ReactLoading type={type} color={color} height={'10%'} width={'9%'} />
);
 
export default loading;