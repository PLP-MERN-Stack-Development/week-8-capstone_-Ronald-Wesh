// Utility functions for authentication and role management

//Decpde JWT Token to get payload
export const decodeToken = (token) => {
    try {
     // JWT tokens have 3 parts: header.payload.signature
    // We want the payload (middle part)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };
  
  //// Get user data from stored token
  export const getUserFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    return decodeToken(token);
  };
  // Check if token is expired
export const isTokenExpired = (token = null) => {
  const tokenToCheck = token || localStorage.getItem('token');
  if (!tokenToCheck) return true;
  
  const decoded = decodeToken(tokenToCheck);
  if (!decoded || !decoded.exp) return true;
  
  // Check if current time is past expiration time
  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

// Get user role from token or localStorage
export const getUserRole = () => {
  // First try to get from localStorage user object
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.role;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Fallback to token
  const tokenUser = getUserFromToken();
  return tokenUser?.role || null;
};

// Role checking functions
export const isAdmin = () => {
  return getUserRole() === 'admin';
};

export const isLandlord = () => {
  return getUserRole() === 'landlord';
};

export const isTenant = () => {
  return getUserRole() === 'tenant';
};

// Get username/name from stored data
export const getUsername = () => {
  // First try from localStorage user object
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.name || user.username || user.email;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  // Fallback to token
  const tokenUser = getUserFromToken();
  return tokenUser?.username || tokenUser?.name || tokenUser?.email || null;
};

// Get user ID
export const getUserId = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.id || user._id;
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  
  const tokenUser = getUserFromToken();
  return tokenUser?.id || tokenUser?._id || null;
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  return token && user && !isTokenExpired(token);
};

// Get authorization header for API calls
export const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Format user display name
export const getUserDisplayName = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const user = JSON.parse(userData);
      return user.name || user.username || user.email.split('@')[0];
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }
  return 'User';
};

// Role-based route permissions
export const canAccessRoute = (route, userRole = null) => {
  const role = userRole || getUserRole();
  
  const permissions = {
    '/dashboard/admin': ['admin'],
    '/dashboard/landlord': ['landlord'],
    '/dashboard/tenant': ['tenant'],
    '/verification': ['admin'],
    '/buildings/create': ['landlord'],
    '/listings/create': ['landlord'],
  };
  
  const allowedRoles = permissions[route];
  if (!allowedRoles) return true; // Public route
  
  return allowedRoles.includes(role);
}; 