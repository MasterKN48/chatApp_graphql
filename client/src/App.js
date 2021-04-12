import React, { Suspense, lazy } from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import NavBar from "./Component/Nav";
import Provider from "./ApolloProvider";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/messages";
import AuthRoute from "./utils/AuthRoute";

import "./App.scss";

const Main = lazy(() => import("./Component/Main"));
const Register = lazy(() => import("./Component/Register"));
const Login = lazy(() => import("./Component/Login"));
const NotFound = lazy(() => import("./Component/Error"));

const App = () => {
  return (
    <Provider>
      <AuthProvider>
        <MessageProvider>
          <BrowserRouter>
            <main className="app">
              <NavBar />
              <section className="container-md shadow-sm my-4 py-4 bg-white rounded">
                <h2 className="text-center">Simple Chat App</h2>
              </section>
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
                  <AuthRoute exact path="/" component={Main} authenticated />
                  <AuthRoute path="/register" component={Register} guest />
                  <AuthRoute path="/login" component={Login} guest />
                  <AuthRoute component={NotFound} />
                </Switch>
              </Suspense>
            </main>
          </BrowserRouter>
        </MessageProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
