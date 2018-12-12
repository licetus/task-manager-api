import chai from 'chai'
import chaiError from './error'
import chaiDefinition from './definition'
import chaiResponse from './response'
import chaiType from './type'
import charAsPromised from 'chai-as-promised'

chai.use(chaiError)
chai.use(chaiDefinition)
chai.use(chaiResponse)
chai.use(chaiType)
chai.use(charAsPromised)

export default chai
