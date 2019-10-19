import hue from 'hue-api';
import React, { useEffect, useState, Suspense } from 'react';

const archeTypeAliases = {
    sultanbulb: 'BulbsSultan',
    huelightstrip: 'HeroesLightstrip'
};

const HSVtoHSL = HSV => {
    const L = HSV.V - HSV.V * HSV.S / 2;
    const S = (L ===0 || L === 1) ? 0 : (HSV.V - L) / Math.min(L, 1 - L);
    return {H: HSV.H, S, L};
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
                const Image = React.lazy(() => import(`./HueIconPack2019/${archeTypeAliases[light.config.archetype]}`).catch(() => import('./HueIconPack2019/BulbsClassic')));
                return <Suspense fallback={''} key={light.uniqueid}><div
                            className={['card mb-2'].concat(light.state.on ? 'text-dark' : 'text-light').join(' ')}
                            style={{backgroundColor: light.state.on ? `hsl(${HSL.H}, 100%, 50%)` : 'rgb(90 ,90 ,90)'}}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-1"><Image width="24px" height="24px"/></div>
                            <div className="col">
                                <strong>{light.name}</strong>
                            </div>
                            <div className="col-3">
                                <div className="custom-control custom-switch float-right">
                                <input className="custom-control-input" id={`customSwitch${lightId}`} type="checkbox" checked={light.state.on} onChange={() => setLightState(lightId, {on: !light.state.on})}/>
                                <label className="custom-control-label" htmlFor={`customSwitch${lightId}`}/>
                                </div>
                            </div>
                        </div>
                        {light.state.on && light.state.bri && <div className="row">
                            <div className="col">
                                <input className="custom-range" type="range" defaultValue={light.state.bri} min={0} max={254} onMouseUp={e => setLightState(lightId, {bri: parseInt(e.target.value)})}/>
                            </div>
                        </div>}
                    </div>
                </div></Suspense>
            })}
        </div>
    );
}

export default LightController;