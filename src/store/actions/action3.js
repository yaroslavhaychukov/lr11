export const saveWorkshop = (value) => {
    return {
      type: 'SAVE_WORKSHOP',
      payload: value,
    };
  };
  
  export const clearWorkshop = () => {
    return {
      type: 'CLEAR_WORKSHOP',
    };
  };