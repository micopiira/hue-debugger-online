import React, { useEffect, useState } from 'react';
import './App.css';
import hue from 'hue-api';
import Lights from './Lights';

const getBridge = () => hue().bridgeDiscovery.nupnpScan()
  .then(result => result[0].internalipaddress ? result[0].internalipaddress : prompt('Could not find any bridges using N-UPnP scan. Give bridge IP Address manually:'))
  .then(ip => 'http://' + ip);

function App() {
  const [bridge, setBridge] = useState(localStorage.getItem('bridge'));
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    if (!bridge) {
      getBridge().then(bridge => setBridge(bridge));
    }
    if (!username) {
      setUsername(prompt('Username: '));
    }
  }, [bridge, username]);

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
    if (bridge) {
      localStorage.setItem('bridge', bridge);
    }
  }, [username, bridge]);

  return (
    <div className="App">
      <Lights bridge={bridge} username={username}/>
    </div>
  );
}

export default App;
