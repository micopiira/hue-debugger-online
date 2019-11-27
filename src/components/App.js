import React, {useEffect, useState} from 'react';
import './App.css';
import hue from 'hue-api';
import ApiContext from "./ApiContext";
import ErrorBoundary from "./ErrorBoundary";
import Router from "./Router";

function App() {
	const [bridge, setBridge] = useState(localStorage.getItem('bridge'));
	const [username, setUsername] = useState(localStorage.getItem('username'));

	useEffect(() => {
		if (bridge) {
			localStorage.setItem('bridge', bridge);
		}
		if (username) {
			localStorage.setItem('username', username);
		}
	}, [bridge, username]);

	const hueApi = hue(bridge, false);
	const bridgeApi = hueApi.api({username});

	return (
		<ErrorBoundary>
			<ApiContext.Provider value={{hue: hueApi, api: bridgeApi}}>
				<Router bridge={bridge} setBridge={setBridge} setUsername={setUsername} username={username}/>
			</ApiContext.Provider>
		</ErrorBoundary>
	);
}

export default App;
