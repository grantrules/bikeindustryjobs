import Service from './service';

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
}

export default new JobService();