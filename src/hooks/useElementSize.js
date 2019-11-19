import {useState, useEffect} from 'react';

export default function useElementSize(ref) {
	const [dimensions, setDimensions] = useState({width: null, height: null});
	useEffect(() => {
		const element = ref.current;
		const handleResize = () => setDimensions({width: element.offsetWidth, height: element.offsetHeight});
		if (element) {
			handleResize();
		}
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, [ref]);

	return dimensions;
}
