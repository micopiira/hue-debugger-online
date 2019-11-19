import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import useLights from "./useLights";

export default function useLight() {
	const {lightId} = useParams();
	const [light, setLight] = useState();
	const [lights, fetchLights] = useLights();

	useEffect(() => {
		setLight(lights[lightId])
	}, [lightId, lights]);

	return [light, fetchLights];
}
