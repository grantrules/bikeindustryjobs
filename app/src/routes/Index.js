import React from 'react';
import JobList from '../components/JobList';
import { Tags } from '../components/Tags';
import { Loading } from '../components/Loading';


const Index = ({jobs, companies, engine, tags, tagsEnabled, search, user}) => (
    <div id="home">
        <div id="homeheader">
            <div>careers.bike</div>
        </div>
        <div className="list">
            <h1>Jobs</h1>
            <p>Welcome to the best resource for bike indusry jobs. Register to get personalized job alerts to your email.</p>
            {!jobs ? <Loading/> :
                [
                <Tags
                    onClick={()=>{}}
                    tags={tags}
                    tagsEnabled={tagsEnabled}
                />,
                <JobList
                    jobs={jobs}
                    companies={companies}
                    engine={engine}
                    tags={tagsEnabled}
                    search={search}
                    user={user}
                />]
            }
        </div>
    </div>
)

export { Index }