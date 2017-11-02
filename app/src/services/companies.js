import AuthService from './auth';

class CompanyService extends AuthService.Component {

    getMyCompanies(callback) {
        this.fetchSecure(`/api/companies/my`,
            {
                method: "GET"
            },
            callback
        )

    }

    putAWSImage(url, file, callback) {
        var body = new FormData();
        body.append('file', file);

        this.fetch(
            url,
            {
                method: "PUT",
                body: body,
                headers: new Headers({'x-amz-acl':'public-read'})
            },
            callback
        )
    }

    getImageUploadUrl(file, callback) {
        var contentType = file.type;
        this.fetchSecure(
            `/api/imageUploadUrl?contentType=${contentType}`,
            {
                method: "GET"
            },
            (err,data) => {
                // { secret, signedRequest, fileName }
                callback(err,data)
            }
        );
    }

    postCompany(form,callback) {


        this.fetchSecure(
            `/api/companies`,
            {
                method: "POST",
                body: this.urlencodeFormData(form),
                headers: new Headers({'Content-Type': "application/x-www-form-urlencoded"})
            },
            callback
        );
    }

}

export default new CompanyService();