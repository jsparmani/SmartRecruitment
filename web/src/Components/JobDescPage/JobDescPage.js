import React from 'react'
import Styles from './JobDescPage.module.css';
import SearchBar from '../../Containers/SearchBar/SearchBar'
import SideBar from '../../Containers/SideBar/SideBar'
import JobDesc from '../JobDesc/JobDesc'
function JobDescPAge() {
    return (
        <div className={Styles.body} >
            <SearchBar/>
            <div className={Styles.container}>
                
            <SideBar/>
            <JobDesc/>
            </div>
        </div>
    )
}

export default JobDescPAge
