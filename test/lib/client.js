import request from 'supertest'

export default () => (request(global.server))
