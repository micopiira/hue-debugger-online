import hue from 'hue-api';
import React, { useEffect, useState } from 'react';
const requireIcon = require.context('./HueIconPack2019', true, /\.svg$/);
const allIcons = requireIcon.keys();

const archeTypeAliases = {
    sultanbulb: 'bulbsSultan',
    huelightstrip: 'heroesLightstrip'
};

const HSVtoHSL = HSV => {
    const L = HSV.V - HSV.V * HSV.S / 2;
    const S = (L ===0 || L === 1) ? 0 : (HSV.V - L) / Math.min(L, 1 - L);
    return {H: HSV.H, S, L};
};

const getIcon = light => {
    if (light.type === 'On/Off plug-in unit') {
        return requireIcon('./devicesPlug.svg');
    }
    const iconPath = './' + (archeTypeAliases[light.config.archetype] || light.config.archetype)  + '.svg';
    return allIcons.includes(iconPath) ? requireIcon(iconPath) : requireIcon('./bulbsClassic.svg')
};

function LightController({bridge, username}) {
    const [lights, setLights] = useState({});

    const setLightState = (lightId, newState) => {
        const api = hue(bridge, false).api({username});
        api.setLightState({lightId, newState})
            .then(() => api.getLights().then(lights => setLights(lights)));
    };

    useEffect(() => {
        if (bridge && username) {
            hue(bridge, false).api({username}).getLights().then(res => setLights(res));
        }
      }, [bridge, username]);
    
    return (
        <div>
            {Object.keys(lights).map(lightId => {
                const light = lights[lightId];
                const HSL = HSVtoHSL({H: light.state.hue/(4369/24), S: light.state.sat/254, V: light.state.bri/254});
                return <div key={light.uniqueid}
                            className="card mb-2 text-dark"
                            style={{backgroundColor: `hsl(${HSL.H}, 100%, 50%)`}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-1"><img src={getIcon(light)} alt=""/></div>
                            <div className="col"><strong>{light.name}</strong></div>
                            <div className="col-1">
                                <div className="custom-control custom-switch">
                                <input className="custom-control-input" id={`customSwitch${lightId}`} type="checkbox" checked={light.state.on} onChange={() => setLightState(lightId, {on: !light.state.on})}/>
                                <label className="custom-control-label" htmlFor={`customSwitch${lightId}`}/>
                                </div>
                            </div>
                        </div>
                        {light.state.on && light.state.bri && <div className="row">
                            <div className="col">
                                <input className="custom-range" style={{padding: 0}} type="range" defaultValue={light.state.bri} min={0} max={254} onMouseUp={e => setLightState(lightId, {bri: parseInt(e.target.value)})}/>
                            </div>
                        </div>}
                    </div>
                </div>
            })}
        </div>
    );
}

export default LightController;