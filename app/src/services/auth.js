import Service from './service';

class AuthService extends Service {

    getRefreshToken() {
        return localStorage.getItem("refresh_token");
    }

    fetchSecure(url, options, callback, refreshed) {
        var jwt = localStorage.getItem("jwt");

        if (!jwt) {
            callback({err: "Not logged in"});
        } else {

            if (!options.headers) {
                options.headers = new Headers();
            }
            options.headers.append("Authorization", `BEARER ${jwt}`);
            options.mode = 'cors';

            this.fetch(
                `${this.testinghost}${url}`,options,(err, data) => {
                    // TODO finish this
                    console.log("got something");
                    console.log(data);
                    // if jwt is expired do something here
                    /*
                    if (refreshed) {
                        // already refreshed once on this call, sometings fucky
                    }
                    this.refresh_token(null, err => {
                        if (!err) {
                            this.fetchSecure(url, options, callback, true)
                        }
                    })
                    */
                }
            );
        }
        
    }

    setToken(token) {
        localStorage.setItem("jwt", token);
    }

    refresh_token(token, callback) {
        if (!token) {
            token = localStorage.getItem("refresh_token");
        }
        if (!token) {
            console.log("no refresh token found");
            return callback({err: "No refresh token found"});
        }
        var data = new FormData();
        data.append('refresh_token', token);
        data = this.urlencodeFormData(data);
        this.fetch(
            `${this.testinghost}/api/refresh_token`,
            {
                method: "POST",
                body: data,
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            (err, data) => {
                if (!err) {
                    if (data.token) {
                        this.setToken(data.token);
                    } else {
                        err = {'err': "No token"}
                    }
                }
                callback(err,data);
            }
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

var service = new AuthService();
service.Component = AuthService;

export default service;