import AuthService from './auth';

class StarService extends AuthService.Component {

    star(job_id,callback) {
        var data = new FormData();
        data.append("job_id", job_id);
        console.log(`${job_id} job`);

        this.fetchSecure(
            `/api/stars`,
            {
                method: "POST",
                body: this.urlencodeFormData(data),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }

    unstar(job_id,callback) {
        var data = new FormData();
        data.append("job_id", job_id);
        
        this.fetchSecure(
            `/api/star`,
            {
                method: "DELETE",
                body: this.urlencodeFormData(data),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }

    getStars(callback) {
        this.fetchSecure(
            `/api/stars?nocache=${(new Date()).getTime()}`,
            { method: "GET" },
            callback
        );
    }

}

export default new StarService();