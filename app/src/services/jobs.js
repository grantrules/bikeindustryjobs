import AuthService from '../services/auth';
import { getTags } from '../components/Tags';

class JobService extends AuthService.Component {

    postJob(form,callback) {
        
        
        this.fetchSecure(
            `/api/jobs`,
            {
                method: "POST",
                body: this.urlencodeFormData(form),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }

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