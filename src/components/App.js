import React, {Suspense, useEffect, useState} from 'react';
import './App.css';
import hue from 'hue-api';
import ApiContext from "./ApiContext";
import ErrorBoundary from "./ErrorBoundary";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Spinner from "./bootstrap/Spinner";
import {LightsProvider} from "./LightsContext";
import useMediaQuery from "react-responsive/src/useMediaQuery";
import Settings from "./pages/Settings";
import ThemeContext from "./ThemeContext";

const LinkBridge = React.lazy(() => import('./pages/LinkBridge'));
const BridgeSetup = React.lazy(() => import('./pages/BridgeSetup'));
const Debugger = React.lazy(() => import('./pages/Debugger'));
const LightList = React.lazy(() => import(/* webpackPreload: true */ './pages/LightList'));
const LightController = React.lazy(() => import(/* webpackPrefetch: true */ './pages/LightController'));

function App() {
	const [bridge, setBridge] = useState(localStorage.getItem('bridge'));
	const [username, setUsername] = useState(localStorage.getItem('username'));
	const [isDark, setDark] = useState(false);
	const darkMediaQuery = useMediaQuery({query: 'not all and (prefers-color-scheme: light)'});

	useEffect(() => {
		setDark(darkMediaQuery);
	}, [darkMediaQuery]);

	useEffect(() => {
		bridge ? localStorage.setItem('bridge', bridge) : localStorage.removeItem('bridge');
		if (username) {
			localStorage.setItem('username', username);
		}
	}, [bridge, username]);

	const hueApi = hue(bridge, false);
	const bridgeApi = hueApi.api({username});

	return (
		<ErrorBoundary>
			<ApiContext.Provider value={{hue: hueApi, api: bridgeApi}}>
				<ThemeContext.Provider value={{isDark, setDark}}>
					<BrowserRouter>
						<div className={['App'].concat(isDark ? ['text-light bg-dark'] : ['text-dark bg-light']).join(' ')} style={{minHeight: '100%'}}>
								<Suspense fallback={<Spinner/>}>
									<Switch>
										<Route path="/debugger" render={() => <Debugger bridge={bridge} username={username}/>}/>
										<Route path="/settings" render={() => <Settings bridge={bridge} username={username}/>}/>
										<Route path="/:lightId" render={() => <LightsProvider><LightController/></LightsProvider>}/>
										<Route path="/" render={() => bridge ? (username ? <LightsProvider><LightList/></LightsProvider> : <LinkBridge bridge={bridge} setUsername={setUsername} setBridge={setBridge}/>) : <BridgeSetup setBridge={setBridge}/>}/>
									</Switch>
								</Suspense>
						</div>
					</BrowserRouter>
				</ThemeContext.Provider>
			</ApiContext.Provider>
		</ErrorBoundary>
	);
}

export default App;
