import {combineReducers} from 'redux';
import authreducerVal from './authreducer';

export default combineReducers({
  authRed: authreducerVal,
});