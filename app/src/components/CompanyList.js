import React from 'react';
import { Link } from 'react-router-dom';

class CompanyList extends React.Component {
	
	render() {
		var companies = this.props.companies.map(company=>(
				<Link key={company._id} onClick={this.props.toggleNav} to={`/company/${company.company}`}><div className="logo"><img alt={company.title} src={company.logo}/></div></Link>
			)
		);
		
		return (
			<div id="companyList" className="companyList hider">
				{companies}
			</div>
		);
	}
}

export default CompanyList