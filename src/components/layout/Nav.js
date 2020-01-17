import {Link} from "react-router-dom";
import React from "react";
import ThemeContext from "../ThemeContext";

function Nav({title, children, ...props}) {

	return <ThemeContext.Consumer>{({isDark}) => <nav className={['navbar navbar-expand-lg mb-2'].concat(isDark ? ['navbar-dark bg-dark'] : ['navbar-light bg-light']).join(' ')} {...props}>
		<div className="container">
			<Link to="/" className="navbar-brand mr-auto"><strong>{title}</strong></Link>
			{children}
		</div>
	</nav>}</ThemeContext.Consumer>;
}

export default Nav;
