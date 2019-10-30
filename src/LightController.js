import React from 'react';
import ColorWheel from "./ColorWheel";
import hue from "hue-api";
import {objectToArray} from "./utils";
import { useParams } from 'react-router-dom';
import {rgb_to_cie} from "./cie_rgb_converter";

function LightController({bridge, username}) {
    const { lightId } = useParams();

    const handleColorChange = ({r,g,b}) => {
        const xy = rgb_to_cie(r, g, b);
        console.log({xy});
        setLightState({xy});
    };

    const setLightState = newState => {
        const api = hue(bridge, false).api({username});
        api.setLightState({lightId, newState})
            .catch(error => {
                console.error(error);
                alert(error);
            });
    };

    return (<div><ColorWheel onColorClick={handleColorChange}/></div>);
}

export default LightController;