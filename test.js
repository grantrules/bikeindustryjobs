var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
//var config = require('./config');
//var User = require('./models/user');
//var jwt = require('jsonwebtoken');

describe('Routing', () => {
    var url = 'http://localhost:9004';
    var token = null;
    var user = null;

    before(done => {
      //mongoose.connect(config.mongodb);
      done();

    });

    describe('Account', () => {
      it('should return error trying to save duplicate email', done => {
          var profile = {
            email: 'test@test.com',
            password: 'test',
            first_name: 'Valerio',
            last_name: 'Gheri'
          };
        
        request(url)
        .post('/api/users')
        .send(profile)
        .end((err, res) => {
              if (err) {
                throw err;
              }
              // this is should.js syntax, very clear
              res.should.have.property("status", 400);
              done();
            });
      });

      it('should give generic login error if passwords do not match', done => {
        var login = {
          email: 'test@test.com',
          password: 'nottest'
        }
        request(url)
        .post('/api/login')
        .send(login)
        .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.property("status", 401);
            done();
        })
      })

      it('should give generic login error if email does not exist', done => {
        var login = {
          email: 'testnotexist@test.com',
          password: 'nottest'
        }
        request(url)
        .post('/api/login')
        .send(login)
        .end((err, res) => {
            if (err) {
              throw err;
            }
            res.should.have.property("status", 401);
            done();
        })
      })

      it('should give user, refresh token, and token on login', done => {
          var login = {
            email: 'test@test.com',
            password: 'test'
          }
          request(url)
          .post('/api/login')
          .send(login)
          .end((err, res) => {
              if (err) {
                throw err;
              }
              res.body.should.have.property('user');
              res.body.should.have.property('token');
              res.body.should.have.property('refresh_token');
              token = res.body.token;
              user = res.body.user;
              
              done();
          })
        
      })
      it('should return error trying to access private area with no jwt', done => {
        request(url)
        .get('/api/stars')
        .send()
        .end((err, res) => {
          res.should.have.property("status", 401);
          done();
        })
      })

      it('should return 200 trying to access private area with jwt', done => {
        request(url)
        .get('/api/stars')
        .set('Authorization', `BEARER ${token}`)
        .send()
        .end((err, res) => {
          res.should.have.property("status", 200);
          done();
        })
      })
    });

    describe('Stars', () => {

      it('should add a star (with jwt)', done => {
        var star = {
          job_id: "abc123"
        }
        request(url)
        .post('/api/stars')
        .set('Authorization', `BEARER ${token}`)
        .send(star)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          res.body.should.have.property('job_id');
          done();
        })
      })

      it('should remove a star (with jwt)', done => {
        var star = {
          job_id: "abc123"
        }
        request(url)
        .delete('/api/stars')
        .set('Authorization', `BEARER ${token}`)
        .send(star)        
        .end((err, res) => {
          //todo
          done();
        })
      })

    });




    describe('Companies', () => {
      
      it('should add a company (with jwt)', done => {
        var company = {
            title: "Hot Bikes Inc.",
            location: "Brooklyn, NY",
            website: "http://careers.bike",
            about: "Bikes n stuff",
            logo: "https://e.thumbs.redditmedia.com/3j0csAQenNLKSn0v.png",
            hasScraper: false,
            details: {
              numEmployees: 10,
              founded: 2005,
              headquarters: "",
              industry: "Retail",
            }
          }
        request(url)
        .post('/api/companies')
        .set('Authorization', `BEARER ${token}`)
        .send(company)
        .end((err, res) => {
          if (err) {
            throw err;
          }
          res.body.should.have.property('_id');
          done();
        })
      })

    });

  });