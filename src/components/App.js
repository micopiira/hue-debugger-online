import React, {Suspense, useEffect, useState} from 'react';
import './App.css';
import hue from 'hue-api';
import ApiContext from "./ApiContext";
import ErrorBoundary from "./ErrorBoundary";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {LightsProvider} from "./LightsContext";
import Spinner from "./bootstrap/Spinner";
import LinkBridge from "./LinkBridge";
import BridgeSetup from "./BridgeSetup";
const [LightList, LightController] = ['./LightList', './LightController'].map(path => import(`${path}`))
	.map(promise => React.lazy(() => promise));
const Debugger = React.lazy(() => import('./Debugger'));

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
				<BrowserRouter>
					<div className="App text-light" style={{height: '100%', backgroundColor: 'hsl(210, 10%, 25%)'}}>

							<Suspense fallback={<Spinner/>}>
								<Switch>
									<Route path="/debugger" render={() => <Debugger bridge={bridge} username={username}/>}/>
									<Route path="/:lightId" render={() => <LightsProvider><LightController/></LightsProvider>}/>
									<Route path="/" render={() => bridge ? (username ? <LightsProvider><LightList/></LightsProvider> : <LinkBridge bridge={bridge} setUsername={setUsername}/>) : <BridgeSetup setBridge={setBridge}/>}/>
								</Switch>
							</Suspense>
					</div>
				</BrowserRouter>
			</ApiContext.Provider>
		</ErrorBoundary>
	);
}

export default App;
