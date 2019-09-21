import React, { useEffect, useState } from 'react';
import hue from 'hue-api';
import ReactJsonView from 'react-json-view';

function Lights({bridge, username}) {
    const [lights, setLights] = useState();
      
    useEffect(() => {
      if (bridge && username) {
        hue(bridge, false).api({username}).getLights().then(lights => setLights(lights));
      }
    }, [bridge, username]);
  
    const handleEdit = edit => {
      if (edit.namespace[1] !== 'state') {
        return false;
      }
      hue(bridge, false).api({username}).setLightState({lightId: edit.namespace[0], newState: {[edit.name]: edit.new_value}})
        .then(res => console.log(res));
    }
  
    return (
      <ReactJsonView src={lights}
        name="Lights"
        theme="monokai"
        onEdit={handleEdit}
        shouldCollapse={field => ['capabilities', 'config', 'swupdate'].includes(field.name)}/>
    );
  }

  export default Lights;