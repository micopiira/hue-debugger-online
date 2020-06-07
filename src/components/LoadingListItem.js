import React from 'react';
import CustomSwitch from "./bootstrap/CustomSwitch";

function LoadingListItem() {
	return (
		<div className="card mb-2 text-light flex-fill">
			<div className="card-body">
				<div className="row align-items-center mb-1">
					<div className="col-auto">...</div>
					<div className="col">
						<strong>...</strong>
					</div>
					<div className="col-3" style={{zIndex: 2}}>
						<div className="float-right">
							<CustomSwitch id="customSwitch" checked={false} onChange={() => {}}/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default LoadingListItem;
