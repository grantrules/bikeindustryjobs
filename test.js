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
    });
  });