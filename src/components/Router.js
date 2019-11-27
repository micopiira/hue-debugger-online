import React, {Suspense} from 'react';
import useLights from "../hooks/useLights";
import Spinner from "./bootstrap/Spinner";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import LinkBridge from "./LinkBridge";
import BridgeSetup from "./BridgeSetup";
const [LightList, LightController] = ['./LightList', './LightController'].map(path => import(`${path}`)).map(promise => React.lazy(() => promise));
const Debugger = React.lazy(() => import('./Debugger'));

function Router({bridge, username, setUsername, setBridge}) {
	const [lights, fetchLights] = useLights();

	return (
		<BrowserRouter>
			<div className="App text-light" style={{height: '100%', backgroundColor: 'hsl(210, 10%, 25%)'}}>
				<Suspense fallback={<Spinner/>}>
					<Switch>
						<Route path="/debugger" render={() => <Debugger bridge={bridge} username={username}/>}/>
						<Route path="/:lightId" render={(props) => <LightController light={lights[props.match.params.lightId]} fetchLight={fetchLights}/>}/>
						<Route path="/" render={() => bridge ? (username ? <LightList lights={lights} fetchLights={fetchLights}/> : <LinkBridge bridge={bridge} setUsername={setUsername}/>) : <BridgeSetup setBridge={setBridge}/>}/>
					</Switch>
				</Suspense>
			</div>
		</BrowserRouter>
	);
}

export default Router;
