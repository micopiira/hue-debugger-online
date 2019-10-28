import React from 'react';

function BulbIcon({icon}) {
    const Svg = React.lazy(() => import(`./HueIconPack2019/${icon}`).catch(() => import('./HueIconPack2019/BulbsClassic')));
    return <Svg/>;
}

export default React.memo(BulbIcon);