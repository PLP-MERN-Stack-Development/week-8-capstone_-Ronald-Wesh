//A simple custom React hook that allows components to access your AuthContext.
import { useContext } from 'react';
import {AuthContext} from '../context/AuthContext';

export default function useAuth() {
  return useContext(AuthContext);
}