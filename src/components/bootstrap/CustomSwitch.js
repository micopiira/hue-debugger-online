import React, {useState, unstable_useTransition as useTransition} from 'react';
import {wrapPromise} from "../../wrapPromise";

function CustomSwitch({onChange, ...props}) {

	const [resource, setResource] = useState();
	const [startTransition, isPending] = useTransition({timeoutMs: 1000});

	const suspense = (e) => {
		startTransition(() => {
			setResource(wrapPromise(Promise.resolve(onChange(e))));
		});
	}

	if (resource) {
		resource.read();
	}

	return <div className="custom-control custom-switch">
		<input className="custom-control-input" disabled={isPending} type="checkbox" onChange={suspense} {...props}/>
		<label className="custom-control-label" htmlFor={props.id}/>
	</div>;
}

export default CustomSwitch;
