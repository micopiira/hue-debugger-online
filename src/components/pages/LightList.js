import React, {useContext} from 'react';
import BulbIcon from '../BulbIcon';
import Nav from "../layout/Nav";
import ApiContext from "../ApiContext";
import LightListItem from "../LightListItem";
import LoadingListItem from "../LoadingListItem";
import {LightsContext} from "../LightsContext";
import {resolveIcon} from "../../lightIconResolver";
import Octicon, {Gear} from "@primer/octicons-react";
import {Link} from "react-router-dom";

function LightList() {
	const {api} = useContext(ApiContext);
	const {lights, fetchLights} = useContext(LightsContext);

	const setLightState = (lightId, newState) => {
		api.setLightState({lightId, newState})
			.then(() => fetchLights())
			.catch(error => {
				console.error(error);
				alert(error);
			});
	};

	return (
		<>
			<Nav title="Hue online">
				<Link to="/settings" style={{color: 'inherit'}}><Octicon icon={Gear} size='medium' verticalAlign='middle'/></Link>
			</Nav>
			<div className="container">
				<div className="row row-cols-1 row-cols-md-2">
				{Object.entries(lights).map(([lightId, light]) => {
					return <div className="col d-flex p-1" key={light.uniqueid}><React.Suspense fallback={<LoadingListItem/>}>
						<LightListItem light={light}
									   lightId={lightId}
									   setLightState={newState => setLightState(lightId, newState)}
									   stretchedLink={`/${lightId}`}
									   icon={<BulbIcon width="1.5rem" height="1.5rem" icon={resolveIcon(light)}/>}/>
					</React.Suspense></div>
				})}
				</div>
			</div>
		</>
	);
}

export default LightList;
