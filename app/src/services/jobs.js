import Service from './service';
import { getTags } from '../components/Tags';

class JobService extends Service {

    getCompanies(callback) {
        this.fetch(`${this.testinghost}/api/companies`, {method: 'GET'}, callback);
    }

    getJobs(callback) {
        this.fetch(`${this.testinghost}/api/jobs`, {method: 'GET'}, callback);
    }

    callback(func) {
        return {
            receiveJobs: (err, data) => {
                if (err) {
                    console.log(`error receiving jobs ${err}`);
                }
                var jobs = data;
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
            receiveCompanies: (err, data) => {
                func({companies: data});
            }
        }
    }
}

export default new JobService();