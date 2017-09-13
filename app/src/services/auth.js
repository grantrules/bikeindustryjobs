import Service from './service';

class AuthService extends Service {

    fetchSecure(data, callback) {
        
    }

    refresh_token(token, callback) {
        var data = new FormData({refresh_token: token});
        this.fetch(
            `${this.testinghost}/api/refresh_token`,
            {
                method: "POST",
                body: this.urlencodeFormData(data),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }

    // error first callback
    login(data, callback) {
        this.fetch(
            `${this.testinghost}/api/login`,
            {
                method: "POST",
                body: this.urlencodeFormData(data),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }

    register(data, callback) {
        if (data.get('password') !== data.get('passwordConfirm')) {
            return callback("Passwords don't match");
        }
        this.fetch(
            `${this.testinghost}/api/users`,
            {
                method: "POST",
                body: this.urlencodeFormData(data),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }
}

export default new AuthService();