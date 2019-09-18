import React, {useState, useEffect} from 'react';
import XAxis from './xAxis';
import YAxis from './yAxis';

function Timeline(props){
    const group = React.createRef()
    return (
        <svg className="timeline" width="100%" height="100%" ref={group}>
            
        </svg>
    )
}

export default Timeline;