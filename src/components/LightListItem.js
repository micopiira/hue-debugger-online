import CustomSwitch from "./bootstrap/CustomSwitch";
import CustomRange from "./bootstrap/CustomRange";
import {Link} from "react-router-dom";
import React from "react";
import {cie_to_rgb} from "../cie_rgb_converter";

function LightListItem({lightId, light, setLightState, icon, stretchedLink}) {
	const backgroundColor = (() => {
		if (!light.state.on) return 'rgb(90, 90, 90)';
		return light.state.xy ? `rgb(${cie_to_rgb(light.state.xy[0], light.state.xy[1]).join(',')})` : 'rgb(255,255,255)'
	})();
	return <div className={['card mb-2'].concat(light.state.on ? 'text-dark' : 'text-light').join(' ')}
				style={{backgroundColor}}>
		<div className="card-body"
			 style={light.state.on && light.state.bri ? {paddingBottom: 0} : {}}>
			<div className="row align-items-center mb-1">
				<div className="col-auto">{icon}</div>
				<div className="col">
					<strong>{light.name}</strong>
				</div>
				<div className="col-3" style={{zIndex: 2}}>
					<div className="float-right">
						<CustomSwitch id={`customSwitch${lightId}`} checked={light.state.on} onChange={() => setLightState({on: !light.state.on})}/>
					</div>
				</div>
			</div>
			{light.state.on && light.state.bri && <div className="row">
				<div className="col" style={{zIndex: 2}}>
					<CustomRange defaultValue={light.state.bri} min={0} max={254} onChange={e => setLightState({bri: parseInt(e.target.value)})}/>
				</div>
			</div>}
			{light.capabilities.control.colorgamuttype && stretchedLink && <Link to={stretchedLink} className="stretched-link"/>}
		</div>
	</div>;
}

export default LightListItem;
