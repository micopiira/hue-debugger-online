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
				<div className="row row-cols-1 row-cols-md-2">
				{Object.entries(lights).map(([lightId, light]) => {
					return <div className="col d-flex" key={light.uniqueid}><React.Suspense fallback={<LoadingListItem/>}>
						<LightListItem light={light}
									   lightId={lightId}
									   setLightState={newState => setLightState(lightId, newState)}
									   stretchedLink={`/${lightId}`}
									   icon={<BulbIcon width="1.5rem" height="1.5rem" icon={archeTypeAliases[light.config.archetype]}/>}/>
					</React.Suspense></div>
				})}
				</div>
			</div>
		</React.Fragment>
	);
}

export default LightList;
