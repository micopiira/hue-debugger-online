import React, {useContext} from 'react';
import BulbIcon from './BulbIcon';
import Nav from "./layout/Nav";
import useLights from "../hooks/useLights";
import ApiContext from "./ApiContext";
import Spinner from "./bootstrap/Spinner";
import LightListItem from "./LightListItem";

const archeTypeAliases = {
	sultanbulb: 'BulbsSultan',
	huelightstrip: 'HeroesLightstrip'
};

function LightList() {
	const [lights, fetchLights] = useLights();
	const {api} = useContext(ApiContext);

	const setLightState = (lightId, newState) => {
		api.setLightState({lightId, newState})
			.then(() => fetchLights())
			.catch(error => {
				console.error(error);
				alert(error);
			});
	};

	return (
		<React.Fragment>
			<Nav title="Hue online"/>
			<div className="container">
				{Object.entries(lights).map(([lightId, light]) => {
					return <React.Suspense fallback={<Spinner/>} key={light.uniqueid}>
						<LightListItem light={light}
									   lightId={lightId}
									   setLightState={newState => setLightState(lightId, newState)}
									   stretchedLink={`/${lightId}`}
									   icon={<BulbIcon width="1.5rem" height="1.5rem" icon={archeTypeAliases[light.config.archetype]}/>}/>
					</React.Suspense>
				})}
			</div>
		</React.Fragment>
	);
}

export default LightList;
