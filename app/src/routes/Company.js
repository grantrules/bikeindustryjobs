import React from 'react';

import { Tags } from '../components/Tags';
import JobList from '../components/JobList';
import { Loading } from '../components/Loading';
import { RegularHeader } from '../components/SlideHeader';


const CompanyInfo = ({company}) => (
    <div id="home">
        <div>
            <h2>{company.title}</h2>
        </div>
        <section className="companydata">
            {company.logo ?
                <img alt={`${company.title} logo`} className="company-logo" src={company.logo}/>
                :
                <h2>{company.title}</h2>
            }
            {company.details &&
                <ul>
                    {company.details.numEmployees && <li><span role="img" aria-label="Number of employees">👨‍💼</span> {company.details.numEmployees} Employees</li>}
                    {company.details.founded && <li><span role="img" aria-label="Founded">📅</span> Founded {company.details.founded}</li>}
                    {company.details.headquarters && <li><span role="img" aria-label="Headquarters">🏢</span> Headquarters: {company.details.headquarters}</li>}
                    {company.details.industry && <li><span role="img" aria-label="Industry">🏭</span> {company.details.industry}</li>}
                </ul>
            }
        </section>
        {company.about &&
            <section dangerouslySetInnerHTML={{__html: company.about}} />
        }

    </div>
)

const Company = ({...props}) => (
    <div>
    <RegularHeader {...props}/>
    <section className="company main">
    <CompanyInfo company={props.company}/>
    {!props.jobs ? <Loading/> :
        <div>
            <Tags {...props}
             />
            <JobList
                {...props}
                company={props.company.company}
            />
        </div>
    }
    </section>
    </div>
)

export { Company }