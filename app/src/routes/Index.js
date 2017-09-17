import React from 'react';
import { Link } from 'react-router-dom';
import JobList from '../components/JobList';
import { Tags } from '../components/Tags';
import { Loading } from '../components/Loading';
import { SlideHeader } from '../components/SlideHeader';
import SVGLogo from '../components/SVGLogo';


const Index = ({jobs, ...props}) => (
    <div id="home">
        <div id="homeheader">
            <div className="top"><SVGLogo/><Link className="loginlink" style={{position:'absolute','padding-right': '12.5%',top: '25px', color:'white', right:0}} to="/login">Log in / Register</Link></div>
            <span className="headtext">Find your dream job<br/>in the cycling industry</span>
        </div>
        <SlideHeader {...props}/>
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