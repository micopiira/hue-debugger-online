import React, { useEffect, useState } from 'react';
import './App.css';
import hue from 'hue-api';
import Lights from './Lights';

const checkStatus = res => {
  if (res.status >= 200 && res.status < 300) {
    return res
  } else {
    let err = new Error(res.statusText)
    err.response = res
    throw err
  }
}

const getBridge = () => hue().bridgeDiscovery.nupnpScan()
  .then(result => result[0].internalipaddress ? result[0].internalipaddress : prompt('Could not find any bridges using N-UPnP scan. Give bridge IP Address manually:'))
  .then(ip => ip.startsWith('http') ? ip : 'http://' + ip);

function App() {
  const [bridge, setBridge] = useState(localStorage.getItem('bridge'));
  const [username, setUsername] = useState(localStorage.getItem('username'));
  const [currentPage, setCurrentPage] = useState('lights');

  const pages = ['lights', 'sensors', 'groups', 'schedules', 'scenes', 'rules', 'resourcelinks', 'capabilities'];

  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    } else {
      alert('Press the link button on the bridge, THEN click ok.');
      fetch(bridge + '/api', {method: 'POST', body: JSON.stringify({devicetype: 'testing#testing'})})
        .then(checkStatus)
        .then(res => res.json())
        .then(json => {
          if (json[0].error) throw new Error(json[0].error.description);
        })
        .then(json => {
          setUsername(json[0].success.username);
        }).catch(error => alert(error));
    }
    if (bridge) {
      localStorage.setItem('bridge', bridge);
    } else {
      getBridge().then(bridge => setBridge(bridge));
    }
  }, [username, bridge]);

  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a className="navbar-brand mr-auto" href="#">Hue debugger online</a>
        <span className="badge badge-pill badge-light">{bridge}</span>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <div className="col-2">
            <nav className="nav nav-pills flex-column">
              {pages.map(page => 
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <a key={page} href="#" style={{textTransform: 'capitalize'}} className={['nav-link'].concat(currentPage === page ? 'active' : []).join(' ')} onClick={() => setCurrentPage(page)}>
                  {page}
                </a>
              )}
            </nav>
          </div>
          <div className="col">
            <Lights bridge={bridge} username={username} currentPage={currentPage}/>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
