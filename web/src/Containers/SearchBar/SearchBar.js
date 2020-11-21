import React from 'react'
import Styles from './SearchBar.module.css';
import logo from '../../Images/logo.png';
function SearchBar() {
    return (
        <div className={Styles.container}>
            <img className={Styles.img} src={logo} alt='logo'></img>
            <div>
            <input className={Styles.left} type='text'  placeholder='Search for jobs...'></input>
            <button className={Styles.right}>Search</button>
            </div>
            <button className={Styles.logout}>Log Out</button>
        </div>
    )
}

export default SearchBar
