import hue from 'hue-api';
import React, { useEffect, useState } from 'react';
import BulbIcon from './BulbIcon';
import {objectToArray} from "./utils";
import {cie_to_rgb} from "./cie_rgb_converter";
import {Link} from "react-router-dom";

const archeTypeAliases = {
    sultanbulb: 'BulbsSultan',
    huelightstrip: 'HeroesLightstrip'
};

function LightList({bridge, username}) {
    const [lights, setLights] = useState([]);

    const setLightState = (lightId, newState) => {
        const api = hue(bridge, false).api({username});
        api.setLightState({lightId, newState})
            .then(() => api.getLights().then(lights => setLights(objectToArray(lights))))
            .catch(error => {
                console.error(error);
                alert(error);
            });
    };

    useEffect(() => {
        if (bridge && username) {
            const fetchLights = () => {
                hue(bridge, false).api({username}).getLights()
                    .then(lights => objectToArray(lights))
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
                const backgroundColor = (() => {
                    if (!light.state.on) return 'rgb(90, 90, 90)';
                    return light.state.xy ? `rgb(${cie_to_rgb(light.state.xy[0], light.state.xy[1]).join(',')})` : 'rgb(255,255,255)'
                })();
                return <div key={light.uniqueid}
                            className={['card mb-2'].concat(light.state.on ? 'text-dark' : 'text-light').join(' ')}
                            style={{backgroundColor}}>

                    <div className="card-body" style={light.state.on && light.state.bri ? {paddingBottom: 0} : {}}>
                        <div className="row">
                            <div className="col-1"><BulbIcon icon={archeTypeAliases[light.config.archetype]}/></div>
                            <div className="col">
                                <strong>{light.name}</strong>
                            </div>
                            <div className="col-3" style={{zIndex: 2}}>
                                <div className="custom-control custom-switch float-right">
                                <input className="custom-control-input" id={`customSwitch${lightId}`} type="checkbox" checked={light.state.on} onChange={() => setLightState(lightId, {on: !light.state.on})}/>
                                <label className="custom-control-label" htmlFor={`customSwitch${lightId}`}/>
                                </div>
                            </div>
                        </div>
                        {light.state.on && light.state.bri && <div className="row">
                            <div className="col" style={{zIndex: 2}}>
                                <input className="custom-range" type="range" defaultValue={light.state.bri} min={0} max={254} onMouseUp={e => setLightState(lightId, {bri: parseInt(e.target.value)})}/>
                            </div>
                        </div>}
                        {light.capabilities.control.colorgamuttype && <Link to={`/${lightId}`} className="stretched-link"/>}
                    </div>

                </div>
            })}
        </div>
    );
}

export default LightList;