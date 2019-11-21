import React, {useEffect, useState, Suspense, StrictMode} from 'react';
import './App.css';
import hue from 'hue-api';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import ApiContext from "./ApiContext";
import Spinner from "./bootstrap/Spinner";
import ErrorBoundary from "./ErrorBoundary";
import BridgeSetup from "./BridgeSetup";
import LinkBridge from "./LinkBridge";

const [LightList, LightController] = ['./LightList', './LightController'].map(path => import(`${path}`)).map(promise => React.lazy(() => promise));
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
		<StrictMode>
			<ErrorBoundary>
				<Router>
					<ApiContext.Provider value={{hue: hueApi, api: bridgeApi}}>
						<div className="App text-light" style={{height: '100%', backgroundColor: 'hsl(210, 10%, 25%)'}}>
							<Suspense fallback={<Spinner/>}>
								<Switch>
									<Route path="/debugger" render={() => <Debugger bridge={bridge} username={username}/>}/>
									<Route path="/:lightId" render={() => <LightController/>}/>
									<Route path="/" render={() => bridge ? (username ? <LightList/> : <LinkBridge bridge={bridge} setUsername={setUsername}/>) : <BridgeSetup setBridge={setBridge}/>}/>
								</Switch>
							</Suspense>
						</div>
					</ApiContext.Provider>
				</Router>
			</ErrorBoundary>
		</StrictMode>
	);
}

export default App;
