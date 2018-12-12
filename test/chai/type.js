export default (chai, utils) => {
  utils.addMethod(chai.Assertion.prototype, 'type', function f(str) {
    new chai.Assertion(this._obj).not.be.a('null')
    new chai.Assertion(this._obj).not.be.an('undefined')
    switch (str) {
      case 'string':
        new chai.Assertion(typeof this._obj).equal('string')
        if (this._obj === '') throw new chai.AssertionError('empty string')
        break
      case 'integer':
        new chai.Assertion(typeof this._obj).equal('number')
        if (this._obj % 1 !== 0) throw new chai.AssertionError(`${this._obj} isn't integer`)
        break
      case 'number':
        new chai.Assertion(typeof this._obj).equal('number')
        break
      case 'boolean':
        new chai.Assertion(typeof this._obj).equal('boolean')
        break
      case 'object':
        new chai.Assertion(typeof this._obj).equal('object')
        if (Object.keys(this._obj).length === 0) {
          throw new chai.AssertionError('empty object')
        }
        break
      case 'array':
        new chai.Assertion(this._obj).be.instanceOf(Array)
        if (this._obj.length === 0) throw new chai.AssertionError('empty array')
        break
      default:
    }
  })
}
