import React, { useContext } from 'react';
import ColorWheel from "./ColorWheel";
import {Link, useParams} from 'react-router-dom';
import {cie_to_rgb, rgb_to_cie} from "../cie_rgb_converter";
import CustomSwitch from "./bootstrap/CustomSwitch";
import useLight from "../hooks/useLight";
import CustomRange from "./bootstrap/CustomRange";
import ApiContext from "./ApiContext";
import Octicon, {ChevronLeft} from '@primer/octicons-react';

function LightController() {
	const { api } = useContext(ApiContext);
	const { lightId } = useParams();
	const [light, fetchLight] = useLight();

	const handleColorChange = ({r, g, b}) => {
		const xy = rgb_to_cie(r, g, b);
		return setLightState({xy, on: true});
	};

	const setLightState = newState => api.setLightState({lightId, newState}).then(() => fetchLight());
	const backgroundColor = light ? (() => {
		if (!light.state.on) return 'rgb(90, 90, 90)';
		return light.state.xy ? `rgb(${cie_to_rgb(light.state.xy[0], light.state.xy[1]).join(',')})` : 'rgb(255,255,255)'
	})() : '';
	return (<React.Fragment>
		<div style={{backgroundColor}}>
			<div className="container p-2 mb-4">
				<div className="row mb-1">
					<div className="col-auto">
						<Link to="/"><Octicon icon={ChevronLeft}/></Link>
					</div>
					<div className="col"><strong>{light ? light.name : 'Loading...'}</strong></div>
					<div className="col-auto">
						{light && <CustomSwitch id={`customSwitch${lightId}`} checked={light.state.on}
												onChange={() => setLightState({on: !light.state.on})}/>}
					</div>
				</div>
				<div className="row">
					<div className="col">
						{light ? <CustomRange defaultValue={light.state.bri} min={0} max={254}
											  onChange={e => setLightState({bri: parseInt(e.target.value)})}/> : ''}
					</div>
				</div>
			</div>
		</div>
		<div className="container">
			<ColorWheel onColorClick={handleColorChange}/>
		</div>
	</React.Fragment>);
}

export default LightController;
