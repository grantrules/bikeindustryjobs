import AuthService from './auth';

class StarService extends AuthService.Component {

    star(job_id,callback) {
        var data = new FormData();
        data.append("job_id", job_id);
        console.log(`${job_id} job`);

        this.fetchSecure(
            `${this.testinghost}/api/stars`,
            {
                method: "POST",
                body: this.urlencodeFormData(data),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }

    unstar(star_id,callback) {
        var data = new FormData();
        data.append("star_id", star_id);
        
        this.fetchSecure(
            `${this.testinghost}/api/star`,
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
            `${this.testinghost}/api/stars`,
            { method: "GET" },
            callback
        );
    }

}

export default new StarService();