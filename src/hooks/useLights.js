import {useEffect, useState, useCallback, useContext} from 'react';
import ApiContext from "../components/ApiContext";

export default function useLights() {
	const [lights, setLights] = useState({});
	const {api} = useContext(ApiContext);

	const fetchLights = useCallback(() => {
		api.getLights()
			.then(lights => setLights(lights))
			.catch(error => {
				console.error(error);
				alert(error);
			});
	}, [api]);

	useEffect(() => {
		fetchLights();
		const interval = setInterval(fetchLights, 5000);
		return () => clearInterval(interval);
	}, [fetchLights]);

	return [lights, fetchLights];
}
