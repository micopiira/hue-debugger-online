import React, {useContext, useState} from 'react';
import ColorWheel from "../ColorWheel";
import {Link, useParams} from 'react-router-dom';
import {rgb_to_cie} from "../../cie_rgb_converter";
import ApiContext from "../ApiContext";
import LightListItem from "../LightListItem";
import LoadingListItem from "../LoadingListItem";
import {ArrowLeft} from "react-feather";
import {wrapPromise} from "../../wrapPromise";

const initialResource = wrapPromise(api => api.getLights());

function LightController() {
	const { api } = useContext(ApiContext);
	const { lightId } = useParams();
	const [LightsResource, setLightsResource] = useState(initialResource);

	const light = LightsResource.read(api)[lightId];

	const handleColorChange = ({r, g, b}) => {
		const xy = rgb_to_cie(r, g, b);
		return setLightState({xy, on: true});
	};

	const setLightState = newState => api.setLightState({lightId, newState}).then(() => {
		setLightsResource(wrapPromise(api => api.getLights()));
	});

	return (<>
		{light ? <LightListItem light={light} lightId={lightId} setLightState={setLightState} icon={
			<Link to="/" style={{color: 'inherit'}}><ArrowLeft/></Link>
		}/> : <LoadingListItem/>}
		<div className="container mt-2">
			<ColorWheel onColorClick={handleColorChange}/>
		</div>
	</>);
}

export default LightController;
