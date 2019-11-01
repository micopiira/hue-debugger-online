import {Link} from "react-router-dom";
import React from "react";

function Nav({children}) {
    return <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
        <Link to="/" className="navbar-brand mr-auto"><strong>Hue online</strong></Link>
        {children}
    </nav>;
}

export default Nav;