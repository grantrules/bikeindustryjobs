import React from 'react';

import { Tags } from '../components/Tags';
import JobList from '../components/JobList';
import { Loading } from '../components/Loading';

const CompanyInfo = ({company}) => (
    <div id="home">
        <div id="homeheader">
            <div>{company.title}</div>
        </div>

        <div className="list">
            <p>SmartEtailing provides website, marketing and data solutions
                    to help independent bicycle retailers, cycling suppliers 
                    and cycling brands sell more product in-store and online.</p>
        </div>

    </div>
)

const Company = ({company, onClick, tags, tagsEnabled, user, jobs, companies, engine, search}) => (
    <div>
    <CompanyInfo company={company}/>
    {!jobs ? <Loading/> :
        <div className="list">
            <Tags
                onClick={onClick}
                tags={tags}
                tagsEnabled={tagsEnabled}
             />
            <JobList
                user={user}
                jobs={jobs}
                companies={companies}
                engine={engine}
                company={company.company}
                tags={tagsEnabled}
                search={search}
            />
        </div>
    }
    </div>
)

export { Company }