import {useEffect, useState, useCallback, useContext} from 'react';
import ApiContext from "../components/ApiContext";

export default function useLights() {
	const [lights, setLights] = useState({});
	const [groups, setGroups] = useState({});
	const {api} = useContext(ApiContext);

	const refetch = useCallback(() => {
		Promise.all([api.getLights(), api.getGroups()])
			.then(([lights, groups]) => {
				setLights(lights);
				setGroups(groups);
		}).catch(error => {
			console.error(error);
			alert(error);
		});
	}, [api]);

	useEffect(() => {
		refetch();
		const interval = setInterval(refetch, 15000);
		return () => clearInterval(interval);
	}, [refetch]);

	return {lights, groups, refetch};
}
