import defs from '../../src/swagger/definitions'

const checkArray = (chai, def, path, array, allowEmpty) => {
  const itemRef = def.items.$ref
  if (!(array instanceof Array)) {
    const pathName = path ? `'${path}'` : 'the result'
    throw new chai.AssertionError(
      `Unexpected invalid array object: ${pathName} is '${typeof array}'`
    )
  }
  const itemObj = array[0]
  if (!allowEmpty && !itemObj && itemObj !== 0 && itemObj !== false) {
    throw new chai.AssertionError(`Unexpected empty array: '${path}'`)
  }
  if (itemRef) {
    if (itemObj) {
      new chai.Assertion(itemObj)
        .be.definition(`${path}[idx]`, itemRef.substr('#/definitions/'.length))
    }
  } else {
    try {
      new chai.Assertion(itemObj).be.type(def.items.type)
    } catch (e) {
      throw new chai.AssertionError(`Unexpected '${path}[idx]': ${e.message}`)
    }
  }
}

export default (chai, utils) => {
  utils.addMethod(chai.Assertion.prototype, 'definition', function f(propName, defName) {
    const def = defs[defName]
    if (!def) throw new chai.AssertionError(`Definition '${propName}' is not found`)
    const { required, properties } = def
    if (def.type === 'array') {
      checkArray(chai, def, propName, this._obj, true)
      return
    }
    if (def.type instanceof Array) {
      for (const t of def.type) {
        if (t === 'array' && (this._obj instanceof Array)) {
          checkArray(chai, def, propName, this._obj)
          return
        }
      }
    }
    if (required) {
      required.forEach((item) => {
        if (!{}.hasOwnProperty.call(this._obj, item)) {
          throw new chai.AssertionError(`Expected ${propName} to have a property '${item}'`)
        }
        // new chai.Assertion(this._obj).has.property(item)
      })
    }
    const keys = Object.keys(this._obj)
    keys.forEach((key) => {
      const prop = properties[key]
      const propPath = propName ? `${propName}.${key}` : key
      if (!prop) throw new chai.AssertionError(`Unexpected property: '${propPath}'`)
      const propObj = this._obj[key]
      // if (!propObj && propObj !== 0 && propObj !== false) {
      //   throw new chai.AssertionError(`Unexpected empty or null property: '${propPath}'`)
      // }
      const ref = prop.$ref
      if (ref) {
        new chai.Assertion(propObj).be.definition(propPath, ref.substr('#/definitions/'.length))
      } else {
        try {
          new chai.Assertion(propObj).be.type(prop.type)
        } catch (e) {
          throw new chai.AssertionError(`Unexpected '${propPath}': ${e.message}`)
        }
        if (prop.type === 'array') {
          checkArray(chai, prop, propPath, propObj)
        }
      }
    })
  })
}
