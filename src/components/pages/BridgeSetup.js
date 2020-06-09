import React, {useCallback, useEffect, useState} from 'react';
import hue from 'hue-api';
import {wrapPromise} from "../../wrapPromise";
import Nav from "../layout/Nav";
import {Moon, Settings, Sun} from "react-feather";
import ThemeContext from "../ThemeContext";
import CustomSwitch from "../bootstrap/CustomSwitch";
import {Link} from "react-router-dom";

function BridgeSetup({setBridge}) {

	const [resource, setResource] = useState(null);

	const fetchBridges = useCallback(() => {
		setResource(wrapPromise(() => hue().bridgeDiscovery.nupnpScan()
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
		<Nav title="Hue online">
			<Sun size={18}/>
			<ThemeContext.Consumer>
				{({isDark, setDark}) => <CustomSwitch id="themeToggler" checked={isDark} onChange={event => setDark(event.target.checked)}/>}
			</ThemeContext.Consumer>
			<Moon size={20}/>
			<Link to="/settings" style={{color: 'inherit', lineHeight: 1}} className="ml-2"><Settings size={20}/></Link>
		</Nav>
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
