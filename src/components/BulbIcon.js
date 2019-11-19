import React from 'react';

function BulbIcon({icon, ...props}) {
	const Svg = React.lazy(() => import(`./HueIconPack2019/${icon}`).catch(() => import('./HueIconPack2019/BulbsClassic')));
	return <Svg {...props}/>;
}

export default React.memo(BulbIcon);
