import React                                        from 'react';
import { hot }                                      from 'react-hot-loader'
import { render }                                   from "react-dom";
import { Provider }                                 from "react-redux";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import configureStore                               from "./Redux/configureStore";

import Home                                         from "./Scenes/Home";
import Login                                        from "./Scenes/Login";
import NotFound                                     from "./Scenes/NotFound";


const App = () => (
    <Router>
        <Header/>
            <Switch>
                <Route path="/" exact component={Home} />
                <Redirect from="/old" to="/"/>
                <Route path="/" exact component={Login} />
                <Route component={NotFound} />
            </Switch>
        <Footer/>
    </Router>
);

const HotApp = hot(module)(App);
const store = configureStore();

render(
    <Provider store={store}>
        <HotApp/>
    </Provider>,

    document.getElementById("app")
);

