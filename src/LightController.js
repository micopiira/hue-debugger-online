import hue from 'hue-api';
import React, { useEffect, useState, Suspense } from 'react';
import BulbIcon from './BulbIcon';

const archeTypeAliases = {
    sultanbulb: 'BulbsSultan',
    huelightstrip: 'HeroesLightstrip'
};

/**
 * @see https://en.wikipedia.org/wiki/HSL_and_HSV#Interconversion
 */
const HSVtoHSL = HSV => {
    const L = HSV.V - HSV.V * HSV.S / 2;
    const S = (L ===0 || L === 1) ? 0 : (HSV.V - L) / Math.min(L, 1 - L);
    return {H: HSV.H, S, L};
};

function LightController({bridge, username}) {
    const [lights, setLights] = useState([]);

    const setLightState = (lightId, newState) => {
        const api = hue(bridge, false).api({username});
        api.setLightState({lightId, newState})
            .then(() => api.getLights().then(lights => setLights(Object.keys(lights).map(key => ({...lights[key], id: key})))))
            .catch(error => {
                console.error(error);
                alert(error);
            });
    };

    useEffect(() => {
        if (bridge && username) {
            const fetchLights = () => {
                hue(bridge, false).api({username}).getLights()
                    .then(lights => Object.keys(lights).map(key => ({...lights[key], id: key})))
                    .then(lights => setLights(lights))
                    .catch(error => {
                        console.error(error);
                        alert(error);
                    });
            };
            fetchLights();
            const interval = setInterval(fetchLights, 5000);
            return () => clearInterval(interval);
        }
      }, [bridge, username]);
    
    return (
        <div>
            {lights.map(light => {
                const lightId = light.id;
                const HSV = {H: light.state.hue/65535*360, S: light.state.sat/254, V: 1};//(light.state.bri-1)/253};
                const HSL = HSVtoHSL(HSV);
                const hslCss = `hsl(${parseInt(HSL.H)}, ${parseInt(HSL.S*100)}%, ${parseInt(HSL.L*100)}%)`;
                return <Suspense fallback={''} key={light.uniqueid}><div
                            className={['card mb-2'].concat(light.state.on ? 'text-dark' : 'text-light').join(' ')}
                            style={{backgroundColor: light.state.on ?  hslCss : 'rgb(90, 90, 90)'}}>
                    <div className="card-body" style={light.state.on && light.state.bri ? {paddingBottom: 0} : {}}>
                        <div className="row">
                            <div className="col-1"><BulbIcon icon={archeTypeAliases[light.config.archetype]}/></div>
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