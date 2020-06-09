import React, {useEffect, useState} from 'react';
import hue from 'hue-api';
import ReactJsonView from 'react-json-view';

const pages = ['lights', 'sensors', 'groups', 'schedules', 'scenes', 'rules', 'resourcelinks', 'capabilities'];

function Lights({bridge, username}) {
	const [data, setData] = useState({});

	const [currentPage, setCurrentPage] = useState(window.location.hash.substr(1) || pages[0]);

	window.addEventListener("hashchange", () => {
		setCurrentPage(window.location.hash.substr(1));
	}, false);

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
		hue(bridge, false).api({username}).setLightState({
			lightId: edit.namespace[0],
			newState: {[edit.name]: edit.new_value}
		});
	};

	return (
		<div className="row h-100">
			<div className="col-auto">
				<nav className="nav nav-pills flex-column">
					{pages.map(page =>
						// eslint-disable-next-line jsx-a11y/anchor-is-valid
						<a key={page} href={'#' + page} style={{textTransform: 'capitalize'}}
						   className={['nav-link'].concat(currentPage === page ? 'active' : []).join(' ')}>
							{page}
						</a>
					)}
				</nav>
			</div>
			<div className="col h-100">
				<div className="mh-100" style={{backgroundColor: 'white', overflowX: 'scroll'}}>
				<ReactJsonView src={data}
							   name={currentPage}
							   theme="rjv-default"
							   onEdit={currentPage === 'lights' ? handleEdit : undefined}
							   shouldCollapse={field => Object.keys(data).length > 20 ? field.namespace.length > 1 : field.namespace.length > 3}/>
				</div>
			</div>
		</div>
	);
}

export default Lights;
