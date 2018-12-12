import xml2js from 'xml2js'

const parseString = (xml) => {
	return new Promise((resolve, reject) => {
		xml2js.parseString(xml, (err, result) => {
			if (err) return reject(err)
			return resolve(result)
		})
	})
}

const toXml = (params) => {
	const builder = new xml2js.Builder()
	const xml = builder.buildObject(params)
	return xml
}

export default { parseString, toXml }
