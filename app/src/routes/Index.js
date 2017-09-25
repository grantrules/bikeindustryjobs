import React from 'react';
import { Link } from 'react-router-dom';
import JobList from '../components/JobList';
import { Tags } from '../components/Tags';
import { Loading } from '../components/Loading';
import { LoginLink, SlideHeader } from '../components/SlideHeader';
import SVGLogo from '../components/SVGLogo';


const Index = ({jobs, ...props}) => (
    <div id="home">
        <div id="homeheader">
            <div className="top">
                <SVGLogo/>
                <LoginLink user={props.user} logout={props.logout}/>
            </div>
            <span className="headtext">Find your dream job<br/>in the cycling industry</span>
        </div>
        <SlideHeader {...props}/>
        <div className="list">
            <h1>Jobs</h1>
            {!jobs ? <Loading/> :
                [
                <Tags key="tags1"
                    onClick={()=>{}}
                    {...props}
                />,
                <JobList key="jobs1"
                    jobs={jobs}
                    {...props}
                />]
            }
        </div>
    </div>
)

export { Index }