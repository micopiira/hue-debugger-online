import React from 'react';

function CustomSwitch(props) {
    return <div className="custom-control custom-switch">
        <input className="custom-control-input" type="checkbox" {...props}/>
        <label className="custom-control-label" htmlFor={props.id}/>
    </div>;
}

export default CustomSwitch;