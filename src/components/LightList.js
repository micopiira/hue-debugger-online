import React, {useContext} from 'react';
import BulbIcon from './BulbIcon';
import {cie_to_rgb} from "../cie_rgb_converter";
import {Link} from "react-router-dom";
import Nav from "./layout/Nav";
import CustomSwitch from "./bootstrap/CustomSwitch";
import useLights from "../hooks/useLights";
import CustomRange from "./bootstrap/CustomRange";
import ApiContext from "./ApiContext";

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
					const backgroundColor = (() => {
						if (!light.state.on) return 'rgb(90, 90, 90)';
						return light.state.xy ? `rgb(${cie_to_rgb(light.state.xy[0], light.state.xy[1]).join(',')})` : 'rgb(255,255,255)'
					})();
					return <React.Suspense fallback={''} key={light.uniqueid}>
						<div className={['card mb-2'].concat(light.state.on ? 'text-dark' : 'text-light').join(' ')}
							 style={{backgroundColor}}>
							<div className="card-body"
								 style={light.state.on && light.state.bri ? {paddingBottom: 0} : {}}>
								<div className="row justify-content-center">
									<div className="col-auto">
										<BulbIcon width="1.5rem" height="1.5rem"
												  icon={archeTypeAliases[light.config.archetype]}/>
									</div>
									<div className="col">
										<strong>{light.name}</strong>
									</div>
									<div className="col-3" style={{zIndex: 2}}>
										<div className="float-right">
											<CustomSwitch id={`customSwitch${lightId}`} checked={light.state.on}
														  onChange={() => setLightState(lightId, {on: !light.state.on})}/>
										</div>
									</div>
								</div>
								{light.state.on && light.state.bri && <div className="row">
									<div className="col" style={{zIndex: 2}}>
										<CustomRange defaultValue={light.state.bri} min={0} max={254}
													 onChange={e => setLightState(lightId, {bri: parseInt(e.target.value)})}/>
									</div>
								</div>}
								{light.capabilities.control.colorgamuttype &&
								<Link to={`/${lightId}`} className="stretched-link"/>}
							</div>
						</div>
					</React.Suspense>
				})}
			</div>
		</React.Fragment>
	);
}

export default LightList;
