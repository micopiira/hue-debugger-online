import React from 'react';

export default function CustomRange({onChange, ...props}) {
    return <input className="custom-range" type="range" onTouchEnd={onChange} onMouseUp={onChange} {...props}/>
}