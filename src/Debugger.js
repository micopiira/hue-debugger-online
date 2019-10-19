import React, { useEffect, useState } from 'react';
import hue from 'hue-api';
import ReactJsonView from 'react-json-view';

function Lights({bridge, username}) {
    const [data, setData] = useState({});
    const [currentPage, setCurrentPage] = useState('lights');

    const pages = ['lights', 'sensors', 'groups', 'schedules', 'scenes', 'rules', 'resourcelinks', 'capabilities'];
  
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
      <div className="row">
      <div className="col-2">
        <nav className="nav nav-pills flex-column">
          {pages.map(page => 
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a key={page} href="#" style={{textTransform: 'capitalize'}} className={['nav-link'].concat(currentPage === page ? 'active' : []).join(' ')} onClick={() => setCurrentPage(page)}>
              {page}
            </a>
          )}
        </nav>
      </div>
      <div className="col">
      <ReactJsonView src={data}
        name={currentPage}
        theme="rjv-default"
        onEdit={currentPage === 'lights' ? handleEdit : undefined}
        shouldCollapse={field => Object.keys(data).length > 20 ? field.namespace.length > 1 : field.namespace.length > 3}/>      </div>
    </div>

    );
  }

  export default Lights;