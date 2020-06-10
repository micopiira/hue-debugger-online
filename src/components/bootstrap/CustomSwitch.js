import React, {useState} from 'react';
import {wrapPromise} from "../../wrapPromise";

function CustomSwitch({onChange, ...props}) {

	const [resource, setResource] = useState();

	const suspense = (e) => {
		setResource(wrapPromise(Promise.resolve(onChange(e))));
	}

	if (resource) {
		resource.read();
	}

	return <div className="custom-control custom-switch">
		<input className="custom-control-input" type="checkbox" onChange={suspense} {...props}/>
		<label className="custom-control-label" htmlFor={props.id}/>
	</div>;
}

export default CustomSwitch;
