import url from 'url'
import request from './request'
import errors from '../errors'

class GeoUtils {
	getGeoByCoordinates = async (coordinate) => {
		const { config } = global
		const { key } = config.thirdParty.amap
		const [lat, lng] = coordinate
		const urlPath = {
			protocol: 'http',
			hostname: 'restapi.amap.com',
			pathname: 'v3/geocode/regeo',
			query: {
				location: `${lng},${lat}`,
				key,
			},
		}
		const result = await request.get(url.format(urlPath))
		if (result && result.status === '1') {
			if (result.regeocode && result.regeocode.addressComponent) {
				const addr = result.regeocode.addressComponent
				let countryCode
				if (addr.country === '中国') {
					countryCode = 'CN'
					if (addr.province && (addr.province.endsWith('省') || addr.province.endsWith('市'))) {
						addr.province = addr.province.substr(0, addr.province.length - 1)
					}
					if (addr.city && addr.city.length > 0
						&& (addr.city.endsWith('省') || addr.city.endsWith('市'))) {
						addr.city = addr.city.substr(0, addr.city.length - 1)
					}
				} else if (addr.country.length === 0) {
					countryCode = 'OVERSEAR'
					addr.country = '海外'
					addr.province = '未知'
					addr.city = '未知'
				}
				return {
					country: {
						code: countryCode,
						name: addr.country,
					},
					province: addr.province,
					city: {
						name: !addr.city || addr.city.length <= 0 ? addr.province : addr.city,
					},
				}
			}
		}
		throw new errors.InvalidCoordinateError()
	}
}

export default new GeoUtils()
