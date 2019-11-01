import React, {useEffect, useState, Suspense, StrictMode} from 'react';
import './App.css';
import hue from 'hue-api';
import {handleJsonResponse} from './fetchUtils';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Nav from "./layout/Nav";

const LightList = React.lazy(() => import('./LightList'));
const LightController = React.lazy(() => import('./LightController'));
const Debugger = React.lazy(() => import('./Debugger'));

const getBridge = () => hue().bridgeDiscovery.nupnpScan()
    .then(result => result[0].internalipaddress ? result[0].internalipaddress : prompt('Could not find any bridges from your local network using N-UPnP scan. Give bridge IP Address manually:'))
    .then(ip => ip.startsWith('http') ? ip : window.location.protocol + '//' + ip)
    .then(ip => {
        if (window.location.protocol === 'https:') {
            alert(`To use HTTPS you need to visit your bridge IP address (${ip}) and accept the self-signed certificate.`);
        }
        return ip;
    });

function App() {
    const [bridge, setBridge] = useState(localStorage.getItem('bridge'));
    const [username, setUsername] = useState(localStorage.getItem('username'));

    useEffect(() => {
        if (bridge) {
            localStorage.setItem('bridge', bridge);
        } else {
            getBridge().then(bridge => setBridge(bridge)).catch(error => {
                console.error(error);
                alert(error);
            });
        }

        if (username) {
            localStorage.setItem('username', username);
        } else if (bridge) {
            alert(`Press the link button on bridge ${bridge}, THEN click ok.`);
            fetch(bridge + '/api', {method: 'POST', body: JSON.stringify({devicetype: 'hueonline'})})
                .then(handleJsonResponse)
                .then(json => json[0])
                .then(json => json.error ? Promise.reject(new Error(json.error.description)) : json)
                .then(json => setUsername(json.success.username))
                .catch(error => {
                    console.error(error);
                    alert(error);
                });
        }
    }, [username, bridge]);

    return (
        <StrictMode>
            <Router>
                <div className="App text-light" style={{height: '100%', backgroundColor: 'hsl(210, 10%, 25%)'}}>
                    <Nav/>
                    <div className="container">
                        <Suspense fallback={'Loading...'}>
                            <Switch>
                                <Route path="/debugger">
                                    <Debugger bridge={bridge} username={username}/>
                                </Route>
                                <Route path="/:lightId">
                                    <LightController bridge={bridge} username={username}/>
                                </Route>
                                <Route path="/">
                                    <LightList bridge={bridge} username={username}/>
                                </Route>
                            </Switch>
                        </Suspense>
                    </div>
                </div>
            </Router>
        </StrictMode>
    );
}

export default App;
