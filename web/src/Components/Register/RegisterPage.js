import React from 'react';
import Styles from './RegisterPage.module.css';
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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    signin:{
        background: blue,
        
    },
  }));

function RegisterPage() {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
        role:'Candidate'
      });
    
      const handleRadioChange = (event) => {
        setValues({...values,role:event.target.value});
      };
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
                    placeholder="Email Id"
                    
                    startAdornment= {
                        <InputAdornment position="start">
                        <AccountCircle />
                        </InputAdornment>
                    }
                    
                    />
                    <Input
                    
                    id="input-with-icon-textfield"
                    placeholder="Username"
                    
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
                    <div className={Styles.role}>
                    <RadioGroup row aria-label="gender" name="gender1" value={values.role} onChange={handleRadioChange}>
                            <FormControlLabel value="Candidate" control={<Radio color="primary" />} label="Candidate" />
                            <FormControlLabel value="Company" control={<Radio color="primary" />} label="Company" />
                          </RadioGroup>
                          </div>
                    </div>
                
                <button className={Styles.signin}>Sign Up</button>
                </div>
                
            </form>
        </div>
    )
}

export default RegisterPage