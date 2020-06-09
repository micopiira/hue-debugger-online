import React, {useState, useEffect, useCallback} from 'react';
import {handleJsonResponse} from "../../fetchUtils";
import {AlertTriangle, Moon, Settings, Sun} from "react-feather";
import Nav from "../layout/Nav";
import ThemeContext from "../ThemeContext";
import CustomSwitch from "../bootstrap/CustomSwitch";
import {Link} from "react-router-dom";

const TOTAL_TIME_SECONDS = 30;

function LinkBridge({bridge, setUsername, setBridge}) {

	const [error, setError] = useState(null);
	const [progress, setProgress] = useState(TOTAL_TIME_SECONDS);

	const startInterval = useCallback(() => {
		if (progress > 0) {
			return setTimeout(() => {
				fetch(bridge + '/api', {method: 'POST', body: JSON.stringify({devicetype: 'hueonline'})})
					.then(handleJsonResponse)
					.then(json => json[0])
					.then(json => json.error ? Promise.reject(new Error(json.error.description)) : json)
					.then(json => setUsername(json.success.username))
					.catch(error => {
						if (error.message === 'link button not pressed') {
							setProgress(prevState => prevState - 1);
						} else {
							console.error(error.message);
							setError(error.message);
						}
					});
			}, 1000);
		}
	}, [bridge, setUsername, setProgress, progress]);

	useEffect(() => {
		const timeoutID = startInterval();
		return () => clearTimeout(timeoutID);
	}, [startInterval]);

	const progressPercentage = (progress * (100 / TOTAL_TIME_SECONDS)).toFixed(2);

	return <div className="container pt-2">
		<Nav title="Hue online">
			<Sun size={18}/>
			<ThemeContext.Consumer>
				{({isDark, setDark}) => <CustomSwitch id="themeToggler" checked={isDark} onChange={event => setDark(event.target.checked)}/>}
			</ThemeContext.Consumer>
			<Moon size={20}/>
			<Link to="/settings" style={{color: 'inherit', lineHeight: 1}} className="ml-2"><Settings size={20}/></Link>
		</Nav>
		{error && <div className="alert alert-danger" role="alert">
			<strong>Error!</strong> {error}
			<button type="button" className="close" onClick={() => {setError(null)}} aria-label="Close">
				<span aria-hidden="true">&times;</span>
			</button>
		</div>}
		<div className="text-center">
		<p className="lead">Press the link button on bridge {bridge}... <button className="btn btn-link" onClick={() => setBridge(null)}>Change bridge</button></p>
			{progress === 0 ? <button className="btn btn-primary" onClick={() => setProgress(TOTAL_TIME_SECONDS)}><AlertTriangle/> Retry</button> :
				<div className="progress">
					<div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
						 aria-valuenow={progressPercentage} aria-valuemin="0" aria-valuemax="100" style={{width: progressPercentage + '%'}}/>
				</div>
			}
		</div>
	</div>
}

export default LinkBridge;
