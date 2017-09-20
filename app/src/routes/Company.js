import React from 'react';

import { Tags } from '../components/Tags';
import JobList from '../components/JobList';
import { Loading } from '../components/Loading';
import { RegularHeader } from '../components/SlideHeader';


const CompanyInfo = ({company}) => (
    <div id="home">
        <div>
            <div>{company.title}</div>
        </div>

        <div className="list">
            <p>SmartEtailing provides website, marketing and data solutions
                    to help independent bicycle retailers, cycling suppliers 
                    and cycling brands sell more product in-store and online.</p>
        </div>

    </div>
)

const Company = ({...props}) => (
    <div>
    <RegularHeader {...props}/>

    <CompanyInfo company={props.company}/>
    {!props.jobs ? <Loading/> :
        <div className="list">
            <Tags {...props}
             />
            <JobList
                {...props}
                company={props.company.company}
            />
        </div>
    }
    </div>
)

export { Company }