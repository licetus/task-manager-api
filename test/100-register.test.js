import client from './lib/client'

global.testCx = {}

const now = new Date()
const secondsOfHour = now.getMinutes() * 60 + now.getSeconds() + 1000
const dateAndMonth = now.getMonth() * 100 + now.getDate() + 1000
testCx.user1 = {
  mobile: `187${dateAndMonth}${secondsOfHour}`,
}
testCx.user2 = {
  mobile: `187${dateAndMonth}${secondsOfHour + 1}`,
}
testCx.user3 = {
  mobile: `187${dateAndMonth}${secondsOfHour + 2}`,
}
testCx.user4 = {
  mobile: `187${dateAndMonth}${secondsOfHour + 3}`,
}

const users = [testCx.user1, testCx.user2, testCx.user3, testCx.user4]

describe('phone register test', () => {
  it('bad request for empty body', (done) => {
    client()
      .put('/api/v0/register/verify')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.error('AUTH_TYPE_INVALID_ERROR')
        done()
      })
  })

  it('bad request for phone number do not have country code', (done) => {
    client()
      .put('/api/v0/register/verify')
      .send({
        type: 'mobile',
        number: '18701319311',
      })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.error('REGION_NOT_SUPPORTED_ERROR')
        done()
      })
  })

  it('success sending the code', (done) => {
    let doneCount = 0
    client()
      .put('/api/v0/register/verify')
      .send({
        type: 'mobile',
        region: '+86',
        number: testCx.user1.mobile,
      })
      .set('Content-Type', 'application/json')
      .expect(204)
      .end((err, res) => {
        should.not.exist(err)
        res.noContent.should.to.be.true

        client()
          .put('/api/v0/register/verify')
          .send({
            type: 'mobile',
            region: '+86',
            number: testCx.user1.mobile,
          })
          .set('Content-Type', 'application/json')
          .expect(400)
          .end((innerErr, innerRes) => {
            should.not.exist(innerErr)
            innerRes.body.should.be.error('SEND_VERIFY_CODE_TOO_OFTEN_ERROR')
            doneCount++
            if (doneCount === users.length) done()
          })

        const innerCallback = (innerErr) => {
          should.not.exist(innerErr)
          doneCount++
          if (doneCount === users.length) done()
        }

        for (let i = 1; i < users.length; i++) {
          const user = users[i]
          client()
            .put('/api/v0/register/verify')
            .send({
              type: 'mobile',
              region: '+86',
              number: user.mobile,
            })
            .set('Content-Type', 'application/json')
            .expect(204)
            .end(innerCallback)
        }
      })
  })

  it('should register success', (done) => {
    let doneCount = 0
    client()
      .post('/api/v0/register')
      .send({
        type: 'mobile',
        region: '+86',
        number: testCx.user1.mobile,
        verifyCode: '123456',
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.response('/register', 'post', 200)
        res.body.should.has.property('userId')
        res.body.should.has.property('token')
        testCx.user1.id = res.body.userId
        testCx.user1.token = res.body.token
        doneCount++
        if (doneCount === users.length) done()
      })

    client()
      .post('/api/v0/register')
      .send({
        type: 'mobile',
        region: '+86',
        number: testCx.user2.mobile,
        verifyCode: '123456',
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.response('/register', 'post', 200)
        testCx.user2.id = res.body.userId
        testCx.user2.token = res.body.token
        doneCount++
        if (doneCount === users.length) done()
      })

    client()
      .post('/api/v0/register')
      .send({
        type: 'mobile',
        region: '+86',
        number: testCx.user3.mobile,
        verifyCode: '123456',
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.response('/register', 'post', 200)
        testCx.user3.id = res.body.userId
        testCx.user3.token = res.body.token
        doneCount++
        if (doneCount === users.length) done()
      })

    client()
      .post('/api/v0/register')
      .send({
        type: 'mobile',
        region: '+86',
        number: testCx.user4.mobile,
        verifyCode: '123456',
      })
      .set('Content-Type', 'application/json')
      .expect(200)
      .end((err, res) => {
        should.not.exist(err)
        res.body.should.be.response('/register', 'post', 200)
        testCx.user4.id = res.body.userId
        testCx.user4.token = res.body.token
        doneCount++
        if (doneCount === users.length) done()
      })

  })

  it('should register fill user profile success', (done) => {
    testCx.user1.password = testCx.user2.password = testCx.user3.password = testCx.user4.password = 'password'
    testCx.user1.avatar = 'http://o8ponygb0.bkt.clouddn.com/FpjmNEqtPCIMF36xi7aIACSNrAli1?imageView2/1/w/128/h/128'
    testCx.user2.avatar = 'http://o8ponygb0.bkt.clouddn.com/FpjmNEqtPCIMF36xi7aIACSNrAli2?imageView2/1/w/128/h/128'
    testCx.user3.avatar = 'http://o8ponygb0.bkt.clouddn.com/FpjmNEqtPCIMF36xi7aIACSNrAli3?imageView2/1/w/128/h/128'
    testCx.user4.avatar = 'http://o8ponygb0.bkt.clouddn.com/FpjmNEqtPCIMF36xi7aIACSNrAli4?imageView2/1/w/128/h/128'
    testCx.user1.nickname = `Random #${testCx.user1.mobile}`
    testCx.user2.nickname = `Random #${testCx.user2.mobile}`
    testCx.user3.nickname = `Random #${testCx.user3.mobile}`
    testCx.user4.nickname = `Random #${testCx.user4.mobile}`

    let doneCount = 0

    const innerCallback = (err) => {
      should.not.exist(err)
      doneCount++
      if (doneCount === users.length) done()
    }

    for (let i = 0; i < users.length; i++) {
      const user = users[i]
      client()
        .post('/api/v0/register/profile')
        .set('Content-Type', 'application/json')
        .set('X-Auth-Key', user.token)
        .send({
          password: user.password,
          nickname: user.nickname,
          avatar: user.avatar,
        })
        .expect(204)
        .end(innerCallback)
    }
  })
})
