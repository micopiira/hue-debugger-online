import React, { useContext } from 'react';
import ColorWheel from "./ColorWheel";
import {Link, useParams} from 'react-router-dom';
import {rgb_to_cie} from "../cie_rgb_converter";
import useLight from "../hooks/useLight";
import ApiContext from "./ApiContext";
import Octicon, {ChevronLeft} from '@primer/octicons-react';
import LightListItem from "./LightListItem";

function LightController() {
	const { api } = useContext(ApiContext);
	const { lightId } = useParams();
	const [light, fetchLight] = useLight();

	const handleColorChange = ({r, g, b}) => {
		const xy = rgb_to_cie(r, g, b);
		return setLightState({xy, on: true});
	};

	const setLightState = newState => api.setLightState({lightId, newState}).then(() => fetchLight());

	return (<React.Fragment>
		{light && <LightListItem light={light} lightId={lightId} setLightState={setLightState} icon={
			<Link to="/" className="text-dark"><Octicon icon={ChevronLeft} size='medium' verticalAlign='middle'/></Link>
		}/>}
		<div className="container">
			<ColorWheel onColorClick={handleColorChange}/>
		</div>
	</React.Fragment>);
}

export default LightController;
