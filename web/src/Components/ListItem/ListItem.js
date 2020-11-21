import React from 'react'
import Styles from './ListItem.module.css';
import avatar from '../../Images/avatar.png';
function ListItem({job}) {
    return (
        
            <div className={Styles.child}>
                <img className={Styles.img} src={avatar} alt="Avatar"/>
                <h1>{job.name}</h1>
                <h2>{job.jobdesc}</h2>
                <button>Apply Now</button>
                <button>More</button>
            </div>
        
    )
}

export default ListItem
