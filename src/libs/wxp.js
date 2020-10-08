function promisefy(api) {
	return (options = {}) => new Promise((resolve, reject) => {
		options.success = resolve
		options.fail = reject
		api(options)
	})
}
// Add `finally()` to `Promise.prototype`
Promise.prototype.finally = function (onFinally) {
	return this.then(
		/* onFulfilled */
		res => Promise.resolve(onFinally()).then(() => res),
		/* onRejected */
		err => Promise.resolve(onFinally()).then(() => { throw err })
	)
}
const wxApis = [
	'login',
	'request',
	'getStorage', 'setStorage', 'getStorageInfo', 'removeStorage',
	'saveFile', 'getFileInfo', 'getSavedFileList', 'getSavedFileInfo', 'removeSavedFile', 'openDocument',
	'uploadFile', 'downloadFile',
	'chooseImage', 'previewImage', 'getImageInfo', 'saveImageToPhotosAlbum',
	'startRecord', 'stopRecord', 'playVoice',
	'getLocation', 'chooseLocation', 'openLocation',
	'getSystemInfo',
	'getNetworkType',
	'startAccelerometer', 'stopAccelerometer',
	'scanCode',
	'setClipboardData', 'getClipboardData',
	'requestPayment'
]
const wxp = {}
for (let i = 0, len = wxApis.length; i < len; i++) {
	const api = wxApis[i]
	wxp[api] = promisefy(wx[api])
}

// wxp.request.post = options => {
// 	options = {
// 		method: 'POST',
// 		header: { 'content-type': 'application/x-www-form-urlencoded' },
// 		...options
// 	}
// 	return wxp.request(options)
// }

export default {
	...wxp
}
