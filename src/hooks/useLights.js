import { useEffect, useState, useCallback } from 'react';
import hue from "hue-api";

export default function useLights({bridge, username}) {
    const [lights, setLights] = useState({});

    const fetchLights = useCallback(() => {
        hue(bridge, false).api({username}).getLights()
            .then(lights => setLights(lights))
            .catch(error => {
                console.error(error);
                alert(error);
            });
    }, [bridge, username]);

    useEffect(() => {
        fetchLights();
        const interval = setInterval(fetchLights, 5000);
        return () => clearInterval(interval);
    }, [fetchLights]);

    return [lights, fetchLights];
}