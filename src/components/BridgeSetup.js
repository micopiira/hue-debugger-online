import React, {useEffect, useState} from 'react';
import hue from 'hue-api';

function BridgeSetup({setBridge}) {
	const [bridges, setBridges] = useState([]);

	useEffect(() => {
		hue().bridgeDiscovery.nupnpScan()
			.then(results =>
				setBridges(results
					.map(result => result.internalipaddress)
					.map(ip => ip.startsWith('http') ? ip : window.location.protocol + '//' + ip))
			)
	}, []);

	return bridges ? <div className="container">
		<h1>Select bridge:</h1>
		<div className="list-group">
		{bridges.map(bridge =>
			<button className="list-group-item list-group-item-action" key={bridge} onClick={() => setBridge(bridge)}>{bridge}</button>
		)}
		</div>
	</div> : <p>Could not find any bridges from your local network using N-UPnP scan. Give bridge IP Address manually:</p>;

}

export default BridgeSetup;
