import React from 'react';

function Spinner() {
	return <div className="d-flex justify-content-center">
		<div className="spinner-border m-3" role="status">
			<span className="sr-only">Loading...</span>
		</div>
	</div>;
}

export default Spinner;
