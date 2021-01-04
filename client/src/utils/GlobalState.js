import React, { createContext, useContext } from "react";
import { useProductReducer } from './reducers';

const StoreContext = createContext();
const { Provider } = StoreContext;

// state is the most up-to-date version of our global state
// dispatch is the method we execute to update our state.
// It is specifically going to look for an action object passed in as its argument
const StoreProvider = ({ value = [], ...props }) => {
    const [state, dispatch] = useProductReducer({
      products: [],
      categories: [],
      currentCategory: '',
    });
    // use this to confirm it works!
    console.log(state);
    return <Provider value={[state, dispatch]} {...props} />;
  };

// creating own custom React Hook
const useStoreContext = () => {
    return useContext(StoreContext);
  };

export { StoreProvider, useStoreContext }