import React, { Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import NavBar from "./Component/Nav";
import Provider from "./ApolloProvider";

import "./App.scss";

const Main = lazy(() => import("./Component/Main"));
const Register = lazy(() => import("./Component/Register"));
const Login = lazy(() => import("./Component/Login"));
const NotFound = lazy(() => import("./Component/Error"));

const App = () => {
  return (
    <Provider>
      <BrowserRouter>
        <main className="app">
          <NavBar />
          <Suspense
            fallback={
              <div className="container my-5" align="center">
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              </div>
            }
          >
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
              <Route component={NotFound} />
            </Switch>
          </Suspense>
        </main>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
