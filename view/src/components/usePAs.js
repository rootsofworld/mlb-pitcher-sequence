import {useState, useEffect} from 'react';
import { prependOnceListener } from 'cluster';

function usePAs(indexes, allPA){
    const [state, setState] = useState([])

    useEffect(() => {
        const PAs = []
        for (let i of indexes){
            PAs.push(allPA[i])
        }
        setState(PAs)
    })

    return state;
}

export default usePAs;