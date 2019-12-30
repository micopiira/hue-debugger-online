import React, {Suspense, useEffect, useState} from 'react';
import './App.css';
import hue from 'hue-api';
import ApiContext from "./ApiContext";
import ErrorBoundary from "./ErrorBoundary";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Spinner from "./bootstrap/Spinner";
import {LightsProvider} from "./LightsContext";
import useMediaQuery from "react-responsive/src/useMediaQuery";

const LinkBridge = React.lazy(() => import('./LinkBridge'));
const BridgeSetup = React.lazy(() => import('./BridgeSetup'));
const Debugger = React.lazy(() => import('./Debugger'));
const LightList = React.lazy(() => import(/* webpackPreload: true */ './LightList'));
const LightController = React.lazy(() => import(/* webpackPrefetch: true */ './LightController'));

function App() {
	const [bridge, setBridge] = useState(localStorage.getItem('bridge'));
	const [username, setUsername] = useState(localStorage.getItem('username'));
	const isDark = useMediaQuery({query: '(prefers-color-scheme: dark)'});

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
					<div className={['App h-100'].concat(isDark ? ['text-light bg-dark'] : ['text-dark bg-light']).join(' ')}>
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
