import { assert } from 'chai'
import { queryString } from '../src/utils'

describe('query string test', () => {
  it('should equal', () => {
    assert.equal(queryString({
      'test key': 'test value',
    }), 'test%20key=test%20value')
    assert.equal(queryString({
      'test key0': 'test value0',
      'test key1': 'test value1',
    }), 'test%20key0=test%20value0&test%20key1=test%20value1')
  })
})
