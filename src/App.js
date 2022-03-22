import React, { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import WelcomePage from './pages/WelcomePage';
import AuthContext from './store/authContext';

function App() {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn;
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          {isLoggedIn ? <HomePage /> : <WelcomePage />}
        </Route>
        {!isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        <Route path="/profile">
          {isLoggedIn ? <UserProfile /> : <Redirect to="/auth" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
