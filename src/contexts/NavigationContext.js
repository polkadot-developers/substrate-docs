import React, { createContext, useContext, useState } from 'react';

const defaultState = {
  data: {},
};
const NavigationContext = createContext(defaultState);

export const NavigationContextProvider = ({ children }) => {
  const [data, setData] = useState(defaultState);
  const updateState = _data => setData(_data);

  const contextValues = {
    data,
    updateState,
  };

  return <NavigationContext.Provider value={contextValues}>{children}</NavigationContext.Provider>;
};

export const useNavigationContext = () => {
  const context = useContext(NavigationContext);
  if (context === undefined || context === null) {
    throw new Error(`useSimpleContext must be called within SimpleContextProvider`);
  }
  return context;
};
