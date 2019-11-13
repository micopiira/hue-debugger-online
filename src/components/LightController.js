import React, { useState } from 'react';
import ColorWheel from "./ColorWheel";
import hue from "hue-api";
import { useParams } from 'react-router-dom';
import {cie_to_rgb, rgb_to_cie} from "../cie_rgb_converter";
import Nav from "./layout/Nav";
import CustomSwitch from "./bootstrap/CustomSwitch";
import useLight from "../hooks/useLight";
import CustomRange from "./bootstrap/CustomRange";

function LightController({bridge, username}) {
    const [api, ] = useState(hue(bridge, false).api({username}));
    const { lightId } = useParams();
    const [light, fetchLight] = useLight({bridge, username});

    const handleColorChange = ({r,g,b}) => {
        const xy = rgb_to_cie(r, g, b);
        return setLightState({xy, on: true});
    };

    const setLightState = newState => api.setLightState({lightId, newState}).then(() => fetchLight());
    const backgroundColor = light ? (() => {
        if (!light.state.on) return 'rgb(90, 90, 90)';
        return light.state.xy ? `rgb(${cie_to_rgb(light.state.xy[0], light.state.xy[1]).join(',')})` : 'rgb(255,255,255)'
    })() : '';
    return (<React.Fragment>
        <Nav title={light ? light.name : 'Loading...'} className='navbar navbar-expand-lg navbar-light mb-2' style={{backgroundColor}}>
            {light && <CustomSwitch id={`customSwitch${lightId}`} checked={light.state.on} onChange={() => setLightState({on: !light.state.on})}/>}
            {light ?  <CustomRange defaultValue={light.state.bri} min={0} max={254} onChange={e => setLightState({bri: parseInt(e.target.value)})}/> : ''}
        </Nav>


        <div className="container">
        <ColorWheel onColorClick={handleColorChange}/></div>
    </React.Fragment>);
}

export default LightController;