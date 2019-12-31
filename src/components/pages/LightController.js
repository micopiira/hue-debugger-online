import React, { useContext } from 'react';
import ColorWheel from "../ColorWheel";
import {Link, useParams} from 'react-router-dom';
import {rgb_to_cie} from "../../cie_rgb_converter";
import ApiContext from "../ApiContext";
import Octicon, {ChevronLeft} from '@primer/octicons-react';
import LightListItem from "../LightListItem";
import LoadingListItem from "../LoadingListItem";
import {LightsContext} from "../LightsContext";

function LightController() {
	const { api } = useContext(ApiContext);
	const { lightId } = useParams();
	const {lights, fetchLights} = useContext(LightsContext);
	const light = lights[lightId];

	const handleColorChange = ({r, g, b}) => {
		const xy = rgb_to_cie(r, g, b);
		return setLightState({xy, on: true});
	};

	const setLightState = newState => api.setLightState({lightId, newState}).then(() => fetchLights());

	return (<>
		{light ? <LightListItem light={light} lightId={lightId} setLightState={setLightState} icon={
			<Link to="/" style={{color: 'inherit'}}><Octicon icon={ChevronLeft} size='medium' verticalAlign='middle'/></Link>
		}/> : <LoadingListItem/>}
		<div className="container mt-2">
			<ColorWheel onColorClick={handleColorChange}/>
		</div>
	</>);
}

export default LightController;
