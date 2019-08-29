import React, {useState, useEffect} from 'react';
import Bases from './Bases';

function StateFilter(){
    return (
        <div>
            <div id="outs-form" className='outs-form'>
                <span><input type="checkbox"/></span>
                <span><input type="checkbox"/></span>
                <span><input type="checkbox"/></span>
            </div>
            <Bases/>
            <div>
                <label htmlFor="batter-name">v.s. Batter</label>
                <input id='batter-name' type='text' placeholder='Choose a batter'></input>
            </div>
        </div>
    )
}

export default StateFilter;