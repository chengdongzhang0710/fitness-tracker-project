import * as AuthActions from './auth.actions';

export interface State {
  isAuthenticated: boolean;
}

const initialState: State = {
  isAuthenticated: false
};

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
  switch (action.type) {
    case AuthActions.SET_AUTHENTICATED:
      return {
        isAuthenticated: true
      };
    case AuthActions.SET_UNAUTHENTICATED:
      return {
        isAuthenticated: false
      };
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
