import React from 'react';
import PropTypes from 'prop-types';

import Header from './header.react';


class MainLayout extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <div className="main-layout container">
              <Header />

              <main className="main-content">
                {this.props.children}
              </main>
            </div>
        );
    }
}

MainLayout.propTypes = {
    children: PropTypes.object,
};

export default MainLayout;
