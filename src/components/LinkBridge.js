import React, {useState} from 'react';
import {handleJsonResponse} from "../fetchUtils";

function LinkBridge({bridge, setUsername}) {

	const [error, setError] = useState(null);

	const link = () => fetch(bridge + '/api', {method: 'POST', body: JSON.stringify({devicetype: 'hueonline'})})
		.then(handleJsonResponse)
		.then(json => json[0])
		.then(json => json.error ? Promise.reject(new Error(json.error.description)) : json)
		.then(json => setUsername(json.success.username))
		.catch(error => {
			console.error(error);
			setError(error.message);
		});

	return <div className="container pt-2">
		{error && <div className="alert alert-danger" role="alert">
			<strong>Error!</strong> {error}
			<button type="button" className="close" onClick={() => {setError(null)}} aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>}
		<div className="text-center">
		<p className="lead">Press the button on bridge {bridge}, then click "Link" button below.</p>
		<button onClick={() => link()} type="button" className="btn btn-primary btn-lg">Link</button>
		</div>
	</div>
}

export default LinkBridge;
