import request from './request'

const refinePrecipitation = (value) => {
	if (value === 0 || value) return value
	return null
}

export const getWeatherFromForecast = (coordinate) => {
	const { config } = global
	const { key } = config.thirdParty.forecast
	const url = `https://api.forecast.io/forecast/${key}/${coordinate.join(',')}?units=si`
	return request.get(url)
		.then((json) =>
			json.daily.data.map(d => ({
				weather: d.icon,
				time: d.time,
				temperatureLow: d.temperatureMin,
				temperatureHigh: d.temperatureMax,
				precipitation: refinePrecipitation(d.precipProbability),
			})).concat(json.hourly.data.map(d => ({
				weather: d.icon,
				time: d.time,
				temperatureLow: d.temperature,
				temperatureHigh: d.temperature,
				precipitation: refinePrecipitation(d.precipProbability),
			})))
		)
}
