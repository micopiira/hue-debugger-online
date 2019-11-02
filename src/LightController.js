import React, { useState, useEffect, useCallback } from 'react';
import ColorWheel from "./ColorWheel";
import hue from "hue-api";
import { useParams } from 'react-router-dom';
import {rgb_to_cie} from "./cie_rgb_converter";
import Nav from "./layout/Nav";
import CustomSwitch from "./bootstrap/CustomSwitch";

function LightController({bridge, username}) {
    const { lightId } = useParams();
    const [light, setLight] = useState();
    const [api, ] = useState(hue(bridge, false).api({username}));

    const fetchLight = useCallback(() => api.getLights()
        .then(lights => setLight(lights[lightId]))
        .catch(error => {
            console.error(error);
            alert(error);
        }), [api, lightId]);

    useEffect(() => {
        fetchLight();
    }, [fetchLight, bridge, username, lightId]);

    const handleColorChange = ({r,g,b}) => {
        const xy = rgb_to_cie(r, g, b);
        return setLightState({xy, on: true});
    };

    const setLightState = newState => api.setLightState({lightId, newState}).then(() => fetchLight());
    return (<React.Fragment>
        <Nav title={light ? light.name : 'Loading...'}>
            {light && <CustomSwitch id={`customSwitch${lightId}`} checked={light.state.on} onChange={() => setLightState({on: !light.state.on})}/>}
        </Nav>
        <div className="container">
        <ColorWheel onColorClick={handleColorChange}/></div>
    </React.Fragment>);
}

export default LightController;