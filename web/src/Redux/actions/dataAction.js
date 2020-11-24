import axios from 'axios';

// axios = this.props.token;

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
export const updateToken = (refreshToken) => {
  return async (dispatch) => {
    console.log('In UpdateToken ', refreshToken);
    axios
      .post('http://192.168.137.1:5000/refresh_token', null, {
        headers: {
          refreshToken: refreshToken,
        },
      })
      .then((res) => {
        console.log('Updating Token : ', res.data);
        res.data.ok
          ? dispatch({
              type: 'UPDATE_TOKEN',
              accessToken: res.data.accessToken,
            })
          : null;
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

export const UpdateProfile = (profile) => {
  return {
    type: 'UPDATE_PROFILE',
    profile: profile,
  };
};
export const UpdateJobProfile = (profile, company) => {
  return {
    type: 'UPDATE_JOB_PROFILE',
    profile: profile,
    companyName: company.name,
    companyLocation: company.location,
  };
};

export const CompanyDetail = (company) => {
  return {
    type: 'UPDATE_COMP_PROFILE',
    companyName: company.name,
    companyLocation: company.location,
    jobs: company.jobs,
  };
};

export const JobDetails = (jobs) => {
  return {
    type: 'UPDATE_JOBS',
    jobs: jobs,
  };
};

export const LogOut = () => {
  return {
    type: 'Log_Out',
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
    new_role == 'CANDIDATE'
      ? navigation.navigate('Profile')
      : navigation.navigate('JobProfile');
    return {
      type: 'SET_USER',
      new_email: new_email,
      new_username: new_username,
      new_role: new_role,
      profile: profile,
      accessToken: accessToken,
      refreshToken: refreshToken,
      id: id,
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
