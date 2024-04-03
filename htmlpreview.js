(function () {
	
	var content = document.getElementById('content');

	var url = location.search.substring(1).replace(/\/\/github\.com/, '//raw.githubusercontent.com').replace(/\/blob\//, '/'); //Get URL of the raw file

	var loadMarkDown = function (data) {
		if (data) {
			setTimeout(function () {
				content.innerHTML = marked.parse(data);
			}, 10); //Delay updating document to have it cleared before
		}
	};

	var fetchProxy = function (url, options, i) {
		var proxy = [
			'', // try without proxy first
			'https://api.codetabs.com/v1/proxy/?quest='
		];
		return fetch(proxy[i] + url, options).then(function (res) {
			if (!res.ok) throw new Error('Cannot load ' + url + ': ' + res.status + ' ' + res.statusText);
			return res.text();
		}).catch(function (error) {
			if (i === proxy.length - 1)
				throw error;
			return fetchProxy(url, options, i + 1);
		})
	};

	if (url && url.indexOf(location.hostname) < 0)
		fetchProxy(url, null, 0).then(loadMarkDown).catch(function (error) {
			console.error(error);
			content.innerText = error;
		});
	else
		content.firstElementChild.style.display = 'block';

})()
