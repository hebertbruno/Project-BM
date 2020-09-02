import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Home from './examples/components/home.react';
import MainLayout from './default/components/main-layout.react';
import Collapsible from './examples/components/collapsible.react';


class AppRouter extends React.Component {
    constructor (props) {
        super(props);
    }

    render () {
        return (
            <BrowserRouter>
              <div>
                <Route path="/">
                  <MainLayout>
                    <Switch>
                      <Route path="/collapsible" component={Collapsible} />
                      <Route component={Home} />
                    </Switch>
                  </MainLayout>
                </Route>
              </div>
              {/* fallback only works for the 1st /, so /tasks/bad/uri still
              gives error */}
              {/* <Redirect from="*" to="/"></Redirect> */}
            </BrowserRouter>
        );
    }
}

export default AppRouter;
