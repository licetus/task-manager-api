import should from 'should'
import client from './lib/client'

describe('Login Test', () => {
  it('should login success', (done) => {
    client()
      .post('/api/v0/login')
      .set('Content-Type', 'application/json')
      .send({
        type: 'mobile',
        region: '+86',
        number: testCx.user1.mobile,
        password: testCx.user1.password,
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.response('/login', 'post', 200)
        res.body.should.has.property('userId').equal(testCx.user1.id)
        res.body.should.has.property('token')
        testCx.user1.token = res.body.token
        done()
      })
  })

  const errors = {
    type: 'AUTH_TYPE_INVALID_ERROR',
    region: 'REGION_NOT_SUPPORTED_ERROR',
    number: 'MOBILE_NUMBER_INVALID_ERROR',
    password: 'PASSWORD_REQUIRED_ERROR',
  }

  Object.keys(errors).forEach((key) => {
    it(`bad request for ${key} required`, (done) => {
      const data = {
        type: 'mobile',
        region: '+86',
        number: testCx.user1.mobile,
        password: testCx.user1.password,
      }
      delete data[key]
      client()
        .post('/api/v0/login')
        .set('Content-Type', 'application/json')
        .send(data)
        .expect(400)
        .end((err, res) => {
          should.not.exist(err)
          res.body.should.be.error(errors[key])
          done()
        })
    })
  })

  it('should save user name success', (done) => {
    testCx.user1.name = `uid${testCx.user1.id}`
    client()
      .patch('/api/v0/profile')
      .set('Content-Type', 'application/json')
      .set('X-Auth-Key', testCx.user1.token)
      .send({
        name: testCx.user1.name,
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.response('/profile', 'patch', 200)
        res.body.should.has.property('name').equal(testCx.user1.name)
        done()
      })
  })

  it('should login by username success', (done) => {
    client()
      .post('/api/v0/login')
      .set('Content-Type', 'application/json')
      .send({
        type: 'name',
        name: testCx.user1.name,
        password: testCx.user1.password,
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.response('/login', 'post', 200)
        res.body.should.has.property('userId').equal(testCx.user1.id)
        res.body.should.has.property('token')
        testCx.user1.token = res.body.token
        done()
      })
  })
})
