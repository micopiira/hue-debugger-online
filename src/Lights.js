import React, { useEffect, useState } from 'react';
import hue from 'hue-api';
import ReactJsonView from 'react-json-view';

function Lights({bridge, username, currentPage}) {
    const [data, setData] = useState({});

    useEffect(() => {
      if (bridge && username) {
        setData({});
        hue(bridge, false).getJson({username, path: '/' + currentPage}).then(res => {
            setData(res);
        });
      }
    }, [bridge, username, currentPage]);
  
    const handleEdit = edit => {
      if (edit.namespace[1] !== 'state') {
        return false;
      }
      hue(bridge, false).api({username}).setLightState({lightId: edit.namespace[0], newState: {[edit.name]: edit.new_value}});
    }
  
    return (
      <ReactJsonView src={data}
        name={currentPage}
        theme="rjv-default"
        onEdit={currentPage === 'lights' ? handleEdit : undefined}
        shouldCollapse={field => Object.keys(data).length > 20 ? field.namespace.length > 1 : field.namespace.length > 3}/>
    );
  }

  export default Lights;