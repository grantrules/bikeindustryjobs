import React from 'react';
//import { Link } from 'react-router-dom';
import JobList from '../components/JobList';
import CompanyList from '../components/CompanyList';

import { Tags } from '../components/Tags';
import { Loading } from '../components/Loading';
import { LoginLink, SlideHeader } from '../components/SlideHeader';
import SVGLogo from '../components/SVGLogo';

import Bloodhound from 'bloodhound-js';


var toggleNav = () => document.getElementById('companyList').classList.toggle('hider');

class Index extends React.Component {

    constructor(props) {
        super(props);
        this.state = { searchValue: '', filterjobs: props.jobs };
        this.onSearchChange = this.onSearchChange.bind(this);
        var engine = new Bloodhound({
            local: props.jobs,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['title','description','location']),
        });
        engine.initialize();
        this.engine = engine;
    }

    onSearchChange(event) {
        const target = event.target;
        const value = target.value;
        if (value === "") {
            this.setState({searchValue: value, filterjobs: this.props.jobs});
        } else {
            if (this.engine) {
                this.engine.search(value, results => {
                    this.setState({
                        searchValue: value,
                        filterjobs: results,
                    });
                })
            } else {
                this.setState({ searchValue: value });
            }
        }
    }

    render() {
        var jobs = this.props.jobs;
        var props = this.props;

        return (
            <div id="home">
                <header>
                    <div className="top">
                        <SVGLogo/>
                        <LoginLink name="home" user={props.user} logout={props.logout}/>
                    </div>
                    <span className="headtext">Find your dream job<br/>in the cycling industry</span>
                </header>
                <SlideHeader {...props}/>
                <div id="companies">
                    <a onClick={toggleNav}>Companies ▼</a>
                        {props.companies &&
                            <CompanyList
                                toggleNav={toggleNav}
                                companies={props.companies}
                            />
                        }
                </div>
                <div className="list">
                <input className="searchInput" placeholder="Search..." type="search" value={this.state.searchValue} onChange={this.onSearchChange}/>

                    {!jobs ? <Loading/> :
                        [
                        <Tags key="tags1"
                            onClick={()=>{}}
                            {...props}
                        />,
                        <JobList key="jobs1"
                            onJobClick={()=>window.scrollTo(0,0)}
                            {...props}
                            jobs={this.state.filterjobs}

                        />]
                    }
                </div>
            </div>
        )
    }
}

export { Index }