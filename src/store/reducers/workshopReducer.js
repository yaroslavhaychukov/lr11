const initialState = {
    workshop: null,
  };
  
  const workshopReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_WORKSHOP':
        return { ...state, workshop: action.payload };
      case 'CLEAR_WORKSHOP':
        return { ...state, workshop: null };
      default:
        return state;
    }
  };
  
  export default workshopReducer;