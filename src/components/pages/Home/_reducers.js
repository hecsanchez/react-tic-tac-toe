import * as t from './_types';

const defaultState = {}
export const winner = ( state = defaultState, { type, payload }) => {

  switch( type ){
    case t.UPDATE: 
        return {...state, ...payload}
    case t.RESET: 
        return {...defaultState}
    default: 
        return state;
  }
}