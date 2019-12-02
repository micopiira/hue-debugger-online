import React from 'react';

const req = require.context('../components/HueIconPack2019', true, /.js$/);
const modules = req.keys().map(req);

// noinspection JSUnusedGlobalSymbols
export default {
  title: 'HueIcons',
};

// noinspection JSUnusedGlobalSymbols
export const icons = () => (
	<>
	{modules.map(({default: Icon}) =>
		<span title={Icon.__docgenInfo.displayName} key={Icon}>
			<Icon width={50} height={50} title={"test"}/>
		</span>
	)}
	</>
);
