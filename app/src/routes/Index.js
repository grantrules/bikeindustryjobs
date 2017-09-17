import React from 'react';
import { Link } from 'react-router-dom';
import JobList from '../components/JobList';
import { Tags } from '../components/Tags';
import { Loading } from '../components/Loading';
import { SlideHeader } from '../components/SlideHeader';


const Index = ({jobs, ...props}) => (
    <div id="home">
        <div id="homeheader">
            <div className="top"><span>careers.bike</span><Link to="/login">Log in / Register</Link></div>
            <span className="headtext">Find your dream job<br/>in the cycling industry</span>
            <div className="bottom">careers.bike</div>
        </div>
        <SlideHeader/>
        <div className="list">
            <h1>Jobs</h1>
            {!jobs ? <Loading/> :
                [
                <Tags
                    onClick={()=>{}}
                    {...props}
                />,
                <JobList
                    jobs={jobs}
                    {...props}
                />]
            }
        </div>
    </div>
)

export { Index }