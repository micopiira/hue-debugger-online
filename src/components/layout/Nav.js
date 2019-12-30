import {Link} from "react-router-dom";
import React from "react";
import useMediaQuery from "react-responsive/src/useMediaQuery";

function Nav({title, children, ...props}) {
	const isDark = useMediaQuery({query: '(prefers-color-scheme: dark)'});

	return <nav className={['navbar navbar-expand-lg mb-2'].concat(isDark ? ['navbar-dark bg-dark'] : ['navbar-light bg-light']).join(' ')} {...props}>
		<div className="container">
			<Link to="/" className="navbar-brand mr-auto"><strong>{title}</strong></Link>
			{children}
		</div>
	</nav>;
}

export default Nav;
