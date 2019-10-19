import React, {useEffect, useState, Suspense} from 'react';
import './App.css';
import hue from 'hue-api';
import {handleJsonResponse} from './fetchUtils';
import LightController from "./LightController";

const Debugger = React.lazy(() => import('./Debugger'));

const getBridge = () => hue().bridgeDiscovery.nupnpScan()
    .then(result => result[0].internalipaddress ? result[0].internalipaddress : prompt('Could not find any bridges using N-UPnP scan. Give bridge IP Address manually:'))
    .then(ip => ip.startsWith('http') ? ip : 'http://' + ip);

function App() {
    const [bridge, setBridge] = useState(localStorage.getItem('bridge'));
    const [username, setUsername] = useState(localStorage.getItem('username'));

    useEffect(() => {
        if (bridge) {
            localStorage.setItem('bridge', bridge);
        } else {
            getBridge().then(bridge => setBridge(bridge));
        }

        if (username) {
            localStorage.setItem('username', username);
        } else if (bridge) {
            alert(`Press the link button on bridge ${bridge}, THEN click ok.`);
            fetch(bridge + '/api', {method: 'POST', body: JSON.stringify({devicetype: 'testing#testing'})})
                .then(handleJsonResponse)
                .then(json =>
                    json[0].error ? Promise.reject(new Error(json[0].error.description)) : json
                )
                .then(json => {
                    console.log(json);
                    setUsername(json[0].success.username);
                }).catch(error => {
                console.error(error);
                alert(error);
            });
        }
    }, [username, bridge]);

    return (
        <div className="App bg-dark text-light" style={{height: '100%'}}>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a className="navbar-brand mr-auto" href="#"><strong>Hue online</strong></a>
                {bridge ?
                    <span
                        className={["badge badge-pill"].concat(username ? 'badge-success' : 'badge-warning').join(' ')}
                        title={username ? 'Connected' : 'Not linked'}
                    >{bridge}</span>
                    : <span className="badge badge-pill badge-danger">No bridges found</span>
                }
            </nav>
            <div className="container-fluid">
                <LightController bridge={bridge} username={username}/>
                <Suspense fallback={''}>
                    {process.env.NODE_ENV === 'development' && <Debugger bridge={bridge} username={username}/>}
                </Suspense>
            </div>
        </div>
    );
}

export default App;
