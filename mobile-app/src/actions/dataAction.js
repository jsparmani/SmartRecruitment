export const setUser = (
  new_email,
  new_username,
  new_role,
  profile,
  id,
  accessToken,
  refreshToken,
) => {
  return {
    type: 'SET_USER',
    new_email: new_email,
    new_username: new_username,
    new_role: new_role,
    profile: profile,
    id: id,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const UpdateProfile = (profile) => {
  return {
    type: 'SET_USER',
    new_email: new_email,
    new_username: new_username,
    new_role: new_role,
    profile: profile,
    id: id,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

export const setLoginUser = (
  new_email,
  new_username,
  new_role,
  profile,
  accessToken,
  refreshToken,
  id,
  navigation,
) => {
  console.log('Action ', profile);
  if (profile == null) {
    console.log('in');
    navigation.navigate('Profile');
    return {
      type: 'SET_USER',
      new_email: new_email,
      new_username: new_username,
      new_role: new_role,
      profile: profile,
      accessToken: accessToken,
      id: id,
      refreshToken: refreshToken,
    };
  } else {
    return {
      type: 'SET_LOGIN_USER',
      new_email: new_email,
      new_username: new_username,
      new_role: new_role,
      profile: profile,
      accessToken: accessToken,
      refreshToken: refreshToken,
      id: id,
      isSignedIn: 1,
    };
  }
};
