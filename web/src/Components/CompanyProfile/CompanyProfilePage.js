import React from 'react'
import Styles from './CompanyProfilePage.module.css';


import { makeStyles } from '@material-ui/core/styles';

import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { blue } from '@material-ui/core/colors';


import avatar from '../../Images/avatar.png';

const useStyles = makeStyles((theme) => ({
    margin: {
      margin: theme.spacing(1),
    },
    signin:{
        background: blue,
        
    },formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
      },
  }));
function CompanyProfilePage() {

    const classes = useStyles();
    const [values, setValues] = React.useState({
        password: '',
        weight: '',
        weightRange: '',
        showPassword: false,
        role:'Candidate',
        gender:'Male'
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
                <h1>Profile</h1>
                <img className={Styles.img} src={avatar} alt="Avatar"/>
                <div className={Styles.input}>
                <FormControl className={classes.formControl}>
                <TextField id="standard-basic" label="First Name" />
                <TextField id="standard-basic" label="Last Name" />
                
                <TextField id="standard-basic" label="Age" />
                <br></br>
                <Select
          labelId="demo-simple-select-label" label="Gender"
          id="demo-simple-select"
          value={values.gender}
          onChange={handleChange}
        >
          <MenuItem value={'Male'}>Male</MenuItem>
          <MenuItem value={'Female'}>Female</MenuItem>
          <MenuItem value={'Others'}>Others</MenuItem>
        </Select>
        </FormControl>
                    </div>
                <button className={Styles.upload}>Upload Resume</button>
                <a href='/lmao' className={Styles.resume}>Check resume format</a>
                <button className={Styles.signin}>Save</button>
                </div>
                
            </form>

            
        </div>
    )
}

export default CompanyProfilePage
