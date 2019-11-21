import React from 'react';
import {handleJsonResponse} from "../fetchUtils";

function LinkBridge({bridge, setUsername}) {

	const link = () => fetch(bridge + '/api', {method: 'POST', body: JSON.stringify({devicetype: 'hueonline'})})
		.then(handleJsonResponse)
		.then(json => json[0])
		.then(json => json.error ? Promise.reject(new Error(json.error.description)) : json)
		.then(json => setUsername(json.success.username))
		.catch(error => {
			console.error(error);
			alert(error);
		});

	return <div>

		<p>Press the link button on bridge {bridge}, THEN click ok.</p>

		<button onClick={() => link()}>link</button>

	</div>
}

export default LinkBridge;
