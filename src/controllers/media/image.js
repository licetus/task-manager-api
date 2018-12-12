import uniqueFilename from 'unique-filename'
import fs from 'fs'

import errors from '../../errors'

const getFileExtension = (filename) => {
	const splits = filename.split('.')
	if (splits.length > 0) return splits[splits.length - 1]
	return ''
}

export const uploadFile = (req, res) => {
	global.logger.trace('uploadFile', req.files.file.data.length)
	if (!req.files || !req.files.file) throw new errors.NoFileFoundError()

	if (req.files.file.data.length > 500 * 1024 * 1024) throw new errors.FileSizeExtendLimitError()

	const file = req.files.file
	const extension = getFileExtension(req.files.file.name)
	const name = uniqueFilename('files', 'bip')
	const dir = './files'
	if (!fs.existsSync(dir)) fs.mkdirSync(dir)
	file.mv(`./${name}.${extension}`, (err) => {
		if (err) throw new errors.SaveFileFailedError()
		return res.json({
			fileUrl: `${name}.${extension}`,
		})
	})
	// req.form.on('progress', function(bytesReceived, bytesExpected) {
	// 	console.log(((bytesReceived / bytesExpected)*100) + "% uploaded");
	// });
	// req.form.on('end', function() {
	// 		console.log(req.files);
	// 		res.send("well done");
	// });
}
