import React from 'react';
import JobList from '../components/JobList';


const Index = ({jobs, companies, engine, tagsEnabled, search, user}) => (
    <div id="home">
        <div id="homeheader">
            <div>careers.bike</div>
        </div>
        <div className="list">
            <h1>Jobs</h1>
            <p>Welcome to the best resource for bike indusry jobs. Register to get personalized job alerts to your email.</p>
            <span className="tagblap">Bike Mechanic</span>
            <span className="tagblap">Customer Service</span>
            <span className="tagblap">Marketing</span>
            <span className="tagblap">Design</span>
            <span className="tagblap">Labor</span>
            <span className="tagblap">Outside Rep</span>
            <JobList
                jobs={jobs}
                companies={companies}
                engine={engine}
                tags={tagsEnabled}
                search={search}
                user={user}
            />
        </div>
    </div>
)

export { Index }