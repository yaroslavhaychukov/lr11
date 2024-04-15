import { combineReducers } from 'redux';
import codeReducer from './codeReducer';
import roleReducer from './roleReducer';
import workshopReducer from './workshopReducer'

const rootReducer = combineReducers({
  code: codeReducer,
  role: roleReducer,
  workshop: workshopReducer,
});

export default rootReducer;


