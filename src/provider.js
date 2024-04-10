const fetch = require('node-fetch');
const _ = require('lodash');
const { execaCommand } = require('execa');
const { URL } = require('./const');
const { sleep } = require('./helper');
async function exe_cmd(cmd) {
	return new Promise(resolve => {
		let ret = '';
		const res = execaCommand(cmd, {
			stdio: ['inherit', 'pipe'],
		});
		res.stdout.on('data', data => {
			const str = data.toString();
			process.stdout.write(str);
			ret += str;
		});
		res.stdout.on('end', () => {
			resolve(ret);
		});
	});
}

function parseRustString(rustString) {
	let result = JSON.parse(rustString);
	result['error_code'] = _.snakeCase(result['error_code']);
	result['vm_error_code'] = result['vm_error_code'] === 'None' ? null : result['vm_error_code'];
	return result;
}

function parseRet(res) {
	const result = res.aptRes;
	console.log('---request----res-----', res);
	let data = result.body;
	let code = result.code;
	let error;
	if (code !== 200 || code !== 202) {
		error = parseRustString(data);
		error.code = code;
	} else {
		// if (!params?.is_bcs_format) {
		//   data = JSON.parse(result.data);
		// }
	}
	let ret = {
		data,
		header: JSON.parse(result.header),
		error: error,
	};
	return ret;
}

exports.call = function call(url) {
	return fetch(url)
		.then(response => response.json())
		.then(parseRet);
};

exports.post = function (url, body) {
	return fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(body),
	})
		.then(response => response.json())
		.then(parseRet);
};

async function getResponse(url, max = 10) {
	let counter = 0;
	while (counter < max) {
		try {
			let res = await fetch(url).then(res => res.json());
			if (res.tx_response) {
				return res;
			}
			throw 'tx_response not found';
		} catch (error) {
			counter++;
		}
		await sleep(500);
	}
}

exports.sendSubmitTx = async function sendSubmitTx(body, header) {
	const cmd = `aptcallerd tx aptcaller submit-transaction ${header} ${body} --log_format json --from alice --chain-id aptcaller -y`;
	const res = await exe_cmd(cmd);
	const line = await res.split('\n').find(it => it.includes('txhash'));
	const hash = line.split(' ')[1].trim();
	const url = `${URL}/cosmos/tx/v1beta1/txs/${hash}`;
	await new Promise(resolve => setTimeout(resolve, 1000));
	const tx_result = await getResponse(url);
	const ret = tx_result.tx_response.events.find(it => it.type === 'SubmitTransactionEvent');
	return parseRet({
		aptRes: {
			body: ret.attributes.find(it => it.key === 'body').value,
			code: parseInt(ret.attributes.find(it => it.key === 'code').value),
			header: ret.attributes.find(it => it.key === 'header').value,
		},
	});
};
