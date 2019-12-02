import React from 'react';
import useLights from "../hooks/useLights";

const LightsContext = React.createContext({});

const LightsProvider = ({children}) => {
	const [lights, fetchLights] = useLights();
	return <LightsContext.Provider value={{lights, fetchLights}}>{children}</LightsContext.Provider>
};

export { LightsContext, LightsProvider };
