import Service from './service';
import { Tags, hasTag, getTags } from '../Tags';

class JobService extends Service {

    getCompanies(callback) {
        this.client({
            method: 'GET',
            path: `${this.testinghost}/api/companies`
        }).then(callback);
    }

    getJobs(callback) {
        this.client({
            method: 'GET',
            path: `${this.testinghost}/api/jobs`
        }).then(callback);
    }

    callback(func) {
        return {
            receiveJobs: (response) => {
                var jobs = response.entity;
                var tags = getTags(jobs);
                var tagsEnabled = tags.map(e=>e.name);
                var engine = null;//this.startEngine(jobs);
                
                func({
                    jobs,
                    tags,
                    tagsEnabled,
                    engine,
                });
            },
            receiveCompanies: (response) => {
                func({companies: response.entity});
            }
        }
    }

    receiveJobs(response) {
		var jobs = response.entity;
		var tags = getTags(jobs);
		var tagsEnabled = tags.map(e=>e.name);
		var engine = this.startEngine(jobs);
		
		this.setState({
			jobs,
			tags,
			tagsEnabled,
			engine,
		});
	}
}

export default new JobService();