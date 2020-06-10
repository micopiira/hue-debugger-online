import React from 'react';
import CustomSwitch from "./bootstrap/CustomSwitch";

function LoadingListItem() {
	return (
		<div className="card mb-2 text-light flex-fill" style={{backgroundColor: 'rgb(90, 90, 90)'}}>
			<div className="card-body">
				<div className="row align-items-center mb-1">
					<div className="col-auto"/>
					<div className="col">
						<div className="progress">
							<div className="progress-bar progress-bar-striped progress-bar-animated"
								 role="progressbar"
								 aria-valuenow={100}
								 aria-valuemin="0"
								 aria-valuemax="100"
								 style={{width: 100 + '%', backgroundColor: '#6a6a6a'}}/>
						</div>
					</div>
					<div className="col-3" style={{zIndex: 2}}>
						<div className="float-right">
							<CustomSwitch id="customSwitch" checked={false} onChange={() => {}} disabled/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoadingListItem;
