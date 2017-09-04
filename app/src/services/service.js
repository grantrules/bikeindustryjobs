import rest from 'rest';
import mime from 'rest/interceptor/mime';

class Service {
    constructor() {

        this.testinghost = (window.location.origin === 'http://localhost:3000' ? 'http://localhost:9004' : '');
        this.client = rest.wrap(mime);
    }
}

export default Service;