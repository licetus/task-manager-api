import paths from '../../src/swagger/paths'

export default (chai, utils) => {
  utils.addMethod(chai.Assertion.prototype, 'response', function f(where, how, code) {
    if (code < 400 && this._obj.error) {
      throw new chai.AssertionError(`Unexpected Error: ${JSON.stringify(this._obj)}`)
    }
    const path = paths[where]
    if (!path) throw new chai.AssertionError(`Path '${where}' is not found`)
    const method = path[how]
    if (!method) throw new chai.AssertionError(`Method '${how}' is not allowed for Path '${where}'`)
    const res = method.responses[code]
    if (!res) {
      throw new chai.AssertionError(`ResponseCode '${code}' is not found for [${how} ${where}]`)
    }
    if (!res.schema) {
      new chai.Assertion(Object.keys(this._obj).length).equal(0)
      if (code !== 204) throw new chai.AssertionError(`Unexpected noContent response for '${code}'`)
    } else {
      const def = res.schema.$ref
      if (def) {
        const name = def.substr('#/definitions/'.length)
        new chai.Assertion(this._obj).be.definition('', name)
      }
    }
  })
}
