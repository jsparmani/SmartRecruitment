import React from 'react';
import Styles from './LoginPage.module.css';
import IconButton from '@material-ui/core/IconButton';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { makeStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Lock from '@material-ui/icons/Lock';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { blue } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    signin:{
        background: blue,
        
    },
  }));

function LoginPage() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
      });
    
      const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
    
      const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };
    return (
        <div className={Styles.body}>
            <form className={Styles.form}>
                
                <div className={Styles.input}>
                <h1>AI Recruiter</h1>
                <div className={Styles.input}>
                    <Input
                    
                    id="input-with-icon-textfield"
                    placeholder="Email Id or Username"
                    
                    startAdornment= {
                        <InputAdornment position="start">
                        <AccountCircle />
                        </InputAdornment>
                    }
                    
                    />
                
                    <Input
                    placeholder='Password'
                    id="standard-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    startAdornment={
                        <InputAdornment position="start">
                        <Lock />
                        </InputAdornment>
                    }
                    endAdornment={
                <InputAdornment position="end">
                    <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                </InputAdornment>
                        }
                    />
                    </div>
                
                <button className={Styles.signin}>Sign In</button>
                </div>
                <div className={Styles.foot}>
                <h3 className={Styles.forgotpassword} >forgot password?</h3>
                
                
                <span className={Styles.last}><span >Not Registered ? Click Here to </span><span className={Styles.link}>Sign Up</span></span>
                </div>
            </form>
        </div>
    )
}

export default LoginPage
