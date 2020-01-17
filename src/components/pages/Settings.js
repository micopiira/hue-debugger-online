import React from 'react';
import Nav from "../layout/Nav";
import {ArrowLeft} from "react-feather";
import {Link} from "react-router-dom";
import useMediaQuery from "react-responsive/src/useMediaQuery";

function Settings({bridge, username}) {
	const isDark = useMediaQuery({query: 'not all and (prefers-color-scheme: light)'});

	const readOnlySettings = [['Bridge', bridge], ['Username', username], ['App theme', isDark ? 'Dark' : 'Light']];

	return <>
			<Nav title={<ArrowLeft/>}/>
			<div className="container">
				{readOnlySettings.map(([setting, value]) =>
					<div className="form-group" key={setting}>
						<label htmlFor={setting}>{setting}</label>
						<input id={setting} type="text" className="form-control" disabled value={value}/>
					</div>
				)}
				<Link to="/debugger">Open debugger</Link>
			</div>
		</>;
}

export default Settings;
