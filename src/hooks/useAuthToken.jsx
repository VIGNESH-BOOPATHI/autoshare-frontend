import axios from 'axios';
import { useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext'; // Ensure correct import

const useAuthToken = () => {
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [authToken]);
};

export default useAuthToken;
