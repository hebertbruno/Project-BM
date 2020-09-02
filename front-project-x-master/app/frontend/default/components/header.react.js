import React from 'react';
import {NavLink as Link} from 'react-router-dom';

class Header extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <nav className="navbar navbar-default navbar-fixed-top">
              <div className="container">
                <ul className="nav nav-tabs">
                  <li role="presentation">
                    <Link to="/" activeClassName="active">
                      Home
                    </Link>
                  </li>

                  <li role="presentation">
                    <Link to="/collapsible" activeClassName="active">
                      Collapsible
                    </Link>
                  </li>

                </ul>
              </div>
            </nav>
        );
    }
}

export default Header;
