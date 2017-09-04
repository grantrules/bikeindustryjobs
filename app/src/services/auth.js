import Service from './service';

class AuthService extends Service {

    urlencodeFormData(fd){
        var s = '';
        function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
        for(var pair of fd.entries()){
            if(typeof pair[1]=='string'){
                s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
            }
        }
        return s;
    }

    // error first callback
    login(data, callback) {
        fetch(`${this.testinghost}/api/login`,
            {
                method: "POST",
                body: this.urlencodeFormData(data),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            }).then(callback);

        /*
        this.client({
            method: 'POST',
            entity: data,
            path: `${this.testinghost}/api/login`
        }).then(callback);*/
     }

    register(data, callback) {
        if (data.get('password') !== data.get('passwordConfirm')) {
            return callback("Passwords don't match");
        }
        fetch(`${this.testinghost}/api/users`,
        {
            method: "POST",
            body: this.urlencodeFormData(data),
            headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
        }).then(callback);
        /*
        this.client({
            method: 'POST',
            entity: { first_name, last_name, email, password },
            path: `${this.testinghost}/api/users`
        }).then(callback);
        */
    }
}

export default new AuthService();