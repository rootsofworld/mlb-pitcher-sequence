import React ,{useState, useEffect} from 'react';

function Filter(){
    const [paIndexGroup, setPaIndexGroup] = useState(null)

    return (
        <div className='sidebar'>
            <PitcherFilter/>
            <StateFilter/>
        </div>
    )
}

export default Filter;