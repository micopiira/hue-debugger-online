import React, {useCallback, useEffect, useState} from 'react';
import hue from 'hue-api';
import {wrapPromise} from "../../wrapPromise";

function BridgeSetup({setBridge}) {

	const [resource, setResource] = useState(null);

	const fetchBridges = useCallback(() => {
		setResource(wrapPromise(hue().bridgeDiscovery.nupnpScan()
			.then(results =>
				results
					.map(result => result.internalipaddress)
					.map(ip => ip.startsWith('http') ? ip : window.location.protocol + '//' + ip)
			)));
	}, []);

	useEffect(() => {
		fetchBridges();
	}, [fetchBridges]);

	if (!resource) return null;

	const bridges = resource.read();

	return <div className="container">
		{bridges.length > 0 ? <><h1>Select bridge:</h1>
		<div className="list-group">
		{bridges.map(bridge =>
			<button className="list-group-item list-group-item-action" key={bridge} onClick={() => setBridge(bridge)}>{bridge}</button>
		)}
		</div></>
			: <p>No bridges found <button className="btn btn-primary" onClick={fetchBridges}>Re-fetch</button></p>}
	</div>;
}

export default BridgeSetup;
