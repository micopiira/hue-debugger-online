import React, {useContext} from 'react';
import BulbIcon from './BulbIcon';
import Nav from "./layout/Nav";
import ApiContext from "./ApiContext";
import LightListItem from "./LightListItem";
import LoadingListItem from "./LoadingListItem";

const archeTypeAliases = {
	sultanbulb: 'BulbsSultan',
	huelightstrip: 'HeroesLightstrip'
};

function LightList({lights, fetchLights}) {
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
					return <React.Suspense fallback={<LoadingListItem/>} key={light.uniqueid}>
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
