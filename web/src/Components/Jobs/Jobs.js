import React from 'react'
import Styles from './Jobs.module.css';
import avatar from '../../Images/avatar.png';
import ListItem from '../ListItem/ListItem'
function Jobs() {

   let jobs = [
        {
            name : "Google",
            jobdesc: "SDE",
            avatar : "../../Images/avatar.png"
        },
        {
            name : "Google",
            jobdesc: "SDE",
            avatar : "../../Images/avatar.png"
        },
        {
            name : "Google",
            jobdesc: "SDE",
            avatar : "../../Images/avatar.png"
        },
        {
            name : "Google",
            jobdesc: "SDE",
            avatar : "../../Images/avatar.png"
        },
    ]
    return (
        <div className={Styles.container}>
            <h1 >Popular Jobs</h1>
            <div className={Styles.child}>
                <img className={Styles.img} src={avatar} alt="Avatar"/>
                <h1>Google</h1>
                <button>Apply Now</button>
                <button>More</button>
            </div>
            {jobs.map((job) =>  <ListItem job={job} />)}
        </div>
    )
}

export default Jobs
