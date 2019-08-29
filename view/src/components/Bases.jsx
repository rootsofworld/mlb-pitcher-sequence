import React from 'react';

function Bases(){
    const containerStyle = {
        'display': 'flex',
        'justify-content': 'space-evenly',
        'width': '35%'
    }
    const baseStyle = document.createElement('style');
    baseStyle.type = 'text/css';
    baseStyle.innerHTML = `.base { 
        width:50px;
        height:50px;
        border: 5px solid khaki;
        transform: rotate(45deg);
      }`
    document.getElementsByTagName('head')[0].appendChild(baseStyle);

    return (
        <div id="bases">
            <div style={containerStyle}>
                <div id='second-base' className='base'></div>
            </div>
            <div style={containerStyle}>
                <div id='third-base' className='base'></div>
                <div id='first-base' className='base'></div>
            </div>
        </div>
    )
}

export default Bases;