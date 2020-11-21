import React from 'react'
import Styles from './SearchPage.module.css';
import SearchBar from '../../Containers/SearchBar/SearchBar'
import SideBar from '../../Containers/SideBar/SideBar'
import Jobs from '../Jobs/Jobs'
function SearchPage() {
    return (
        <div className={Styles.body} >
            <SearchBar/>
            <div className={Styles.container}>
                
            <SideBar/>
            <Jobs/>
            </div>
        </div>
    )
}

export default SearchPage
