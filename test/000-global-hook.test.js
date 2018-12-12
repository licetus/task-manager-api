import nock from 'nock'
import chai from './chai'
import getServer from './lib/getServer'

before(async function test() {
  this.timeout(15000)
  global.should = chai.should()
  nock('http://gw.api.taobao.com')
    .persist()
    .post(/.*/)
    .reply(200, {
      alibaba_aliqin_fc_sms_num_send_response: {
        result: {
          success: true,
        },
      },
    })
  nock('http://restapi.amap.com')
    .persist()
    .get(/.*/)
    .reply(200, {
      status: '1',
      regeocode: {
        addressComponent: {
          country: '中国',
          province: '北京',
          city: '北京',
        },
      },
    })
  global.server = await getServer()
})

after((done) => {
  nock.cleanAll()
  done()
})
