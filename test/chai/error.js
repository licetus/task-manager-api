export default (chai, utils) => {
  utils.addMethod(chai.Assertion.prototype, 'error', function f(str) {
    new chai.Assertion(this._obj).has.property('error')
      .has.property('code').equal(str)
  })
}
