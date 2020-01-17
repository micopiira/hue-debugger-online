import React from 'react';
import useLights from "../hooks/useLights";

const LightsContext = React.createContext({});

const LightsProvider = ({children}) => {
	const {lights, groups, refetch} = useLights();
	return <LightsContext.Provider value={{lights, groups, refetch}}>{children}</LightsContext.Provider>
};

export { LightsContext, LightsProvider };
