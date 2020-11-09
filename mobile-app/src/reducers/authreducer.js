const Initial_State = {
  isSignedIn: 0,
  isLoading: false,
  refreshToken: '',
  accessToken: '',
  username: '',
  email: '',
  role: '',
  profile: null,
  id: null,
};

export default (state = Initial_State, action) => {
  console.log('in reducer ', action);
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        email: action.new_email,
        username: action.new_username,
        role: action.new_role,
        profile: action.profile,
        accessToken: action.accessToken,
        id: action.id,
        refreshToken: action.refreshToken,
      };
    case 'SET_LOGIN_USER':
      return {
        ...state,
        email: action.new_email,
        username: action.new_username,
        role: action.new_role,
        profile: action.profile,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
        id: action.id,
        isSignedIn: action.isSignedIn,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        profile: action.profile,
      };
    case 'UPDATE_TOKEN':
      return {
        ...state,
        accessToken: action.accessToken,
        refreshToken: action.refreshToken,
      };
    case 'Loading':
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case 'Sign_In':
      return {
        ...state,
        username: action.username,
        email: action.email,
        uid: action.uid,
        isSignedIn: action.isSignIn,
        MedList: action.myList,
        isLoading: action.isLoading,
      };
    case 'Log_Out':
      return {
        MedList: null,
        MemberList: null,
        isSignedIn: 1,
        uid: '',
        username: '',
      };

    default:
      return state;
  }
};