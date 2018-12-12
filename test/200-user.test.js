import should from 'should'
// import qiniu from 'qiniu'
import client from './lib/client'

describe('User Test', () => {
  it('should update user profile success', (done) => {
    testCx.user1.birthday = '2016-06-19'
    testCx.user1.gender = 1
    // testCx.user1.geo = {
    //   countryCode: 'CN',
    //   country: '中国',
    //   province: '北京',
    //   city: '北京',
    // }
    client()
      .patch('/api/v0/profile')
      .set('Content-Type', 'application/json')
      .set('X-Auth-Key', testCx.user1.token)
      .send({
        nickname: testCx.user1.nickname,
        gender: testCx.user1.gender,
        birthday: testCx.user1.birthday,
        // geo: testCx.user1.geo,
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        res.body.should.be.response('/profile', 'patch', 200)
        res.body.should.has.property('id').equal(testCx.user1.id)
        res.body.should.has.property('nickname').equal(testCx.user1.nickname)
        res.body.should.has.property('gender').equal(testCx.user1.gender)
        res.body.should.has.property('birthday').equal(testCx.user1.birthday)
        done()
      })
  })

  it('should update user2 profile success', (done) => {
    testCx.user2.birthday = '2010-06-19'
    testCx.user2.gender = 2
    client()
      .patch('/api/v0/profile')
      .set('Content-Type', 'application/json')
      .set('X-Auth-Key', testCx.user2.token)
      .send({
        nickname: testCx.user2.nickname,
        gender: testCx.user2.gender,
        birthday: testCx.user2.birthday,
      })
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        res.body.should.be.response('/profile', 'patch', 200)
        res.body.should.has.property('id').equal(testCx.user2.id)
        res.body.should.has.property('nickname').equal(testCx.user2.nickname)
        res.body.should.has.property('gender').equal(testCx.user2.gender)
        res.body.should.has.property('birthday').equal(testCx.user2.birthday)
        done()
      })
  })

  it('should change moblie number fail without region code', (done) => {
    const number = `${+testCx.user1.mobile + 10}`
    client()
      .put('/api/v0/register/verify')
      .set('X-Auth-Key', testCx.user1.token)
      .send({
        type: 'mobile',
        number,
      })
      .set('Content-Type', 'application/json')
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.error('REGION_NOT_SUPPORTED_ERROR')
        done()
      })
  })

  it('should change mobile number success', (done) => {
    const number = `${+testCx.user1.mobile + 10}`
    client()
      .put('/api/v0/register/verify')
      .set('X-Auth-Key', testCx.user1.token)
      .send({
        type: 'mobile',
        region: '+86',
        number,
      })
      .set('Content-Type', 'application/json')
      .expect(204)
      .end((err, res) => {
        should.not.exist(err)
        res.noContent.should.to.be.true
        client()
          .patch('/api/v0/profile')
          .set('Content-Type', 'application/json')
          .set('X-Auth-Key', testCx.user1.token)
          .send({
            mobile: {
              region: '+86',
              number,
              verifyCode: '123456',
            },
          })
          .expect(200)
          .end((err2, res2) => {
            should.not.exist(err2)
            testCx.user1.mobile = number
            res2.body.should.be.response('/profile', 'patch', 200)
            res2.body.should.has.property('mobile').has.property('number').equal(number)
            done()
          })
      })
  })

  it('should get user profile success', (done) => {
    client()
      .get('/api/v0/profile')
      .set('X-Auth-Key', testCx.user1.token)
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        should.exist(res.body)
        res.body.should.be.response('/profile', 'get', 200)
        res.body.should.has.property('id').equal(testCx.user1.id)
        res.body.should.has.property('nickname').equal(testCx.user1.nickname)
        res.body.should.has.property('gender').equal(testCx.user1.gender)
        res.body.should.has.property('birthday').equal(testCx.user1.birthday)
        done()
      })
  })
})
