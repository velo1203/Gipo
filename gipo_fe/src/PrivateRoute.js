// PrivateRoute.js

import React from 'react';
import { Route } from 'react-router-dom';
import useAuthStore from './store';  // Zustand store
import { useNavigate } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const navigate = useNavigate()

  return (
    <Route 
      {...rest} 
      render={props => 
        isLoggedIn ? (
          <Component {...props} />
        ) : (
          navigate('/login')
        )
      }
    />
  );
};

export default PrivateRoute;
