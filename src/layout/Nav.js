import {Link} from "react-router-dom";
import React from "react";

function Nav({title, children}) {
    return <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-2">
        <div className="container">
            <Link to="/" className="navbar-brand mr-auto"><strong>{title}</strong></Link>
            {children}
        </div>
    </nav>;
}

export default Nav;