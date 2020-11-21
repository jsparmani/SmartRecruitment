import React from 'react'
import Styles from './SideBar.module.css';

import avatar from '../../Images/avatar.png';
import { Style } from '@material-ui/icons';
function Sidebar() {
    return (
        <div  className={Styles.container}>
           <div className={Styles.container1}>
            <img className={Styles.img} src={avatar} alt="Avatar"/>
            
            <div className={Styles.container2}>
                <button className={Styles.button}>Jobs</button>
                <button className={Styles.button}>Jobs</button>
                <button className={Styles.button}>Jobs</button>
                <button className={Styles.button}>Jobs</button>
                </div>
                </div>
        </div>
    )
}

export default Sidebar
