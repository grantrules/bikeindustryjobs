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