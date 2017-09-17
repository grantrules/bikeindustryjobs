class Service {
    constructor() {
        this.testinghost = (window.location.origin === 'http://localhost:3000' ? 'http://localhost:9004' : '');
    }

    /* encode formdata to application/x-www-form-urlencoded */
    urlencodeFormData(fd){
        var s = '';
        function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
        for(var pair of fd.entries()){
            if(typeof pair[1]==='string'){
                s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
            }
        }
        return s;
    }

    /* fetch json */
    fetch(url, options, callback) {
        fetch(url, options).then((res) => {
            var contentType = res.headers.get("content-type");
            if(contentType && contentType.includes("application/json")) {
                return res.json();
            }
            throw new TypeError("Oops, we haven't got JSON!");
        }).then((json) => {
            callback(null, json)
        }).catch((err) => {
            callback(err, null);
        });
    }
}

export default Service;