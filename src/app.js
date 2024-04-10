require('dotenv').config();
require('express-async-errors');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { call, sendSubmitTx, post } = require('./provider');
const { PORT, URL } = require('./const');
const { APTOS_MIME_TYPE } = require('./mime');
const app = express();

app.use(cors());
const limit = {
  limit: '100mb',
};
app.use(express.json(limit));
app.use(express.urlencoded({ extended: true, ...limit }));
app.use(
  bodyParser.raw({
    type: 'application/x.aptos.signed_transaction+bcs',
    ...limit,
  }),
);
// app.set("trust proxy", true);
const router = express.Router();

function parsePage(req) {
  const data = req.query;
  const option = {};
  if (data.limit) option.limit = parseInt(data.limit);
  if (data.start) option.start = data.start;
  return option;
}

function setHeader(header, res) {
  if (!header) return;
  if (Object.keys(header).length < 7) return;
  for (let [k, v] of Object.entries(header)) {
    res.setHeader(k, v);
  }
}

/////////////////////////////////account start///////////////////////////////////////
router.get('/accounts/:address', async (req, res) => {
  let option = {
    is_bcs_format: req.is_bcs_format,
  };
  option.data = req.params.address;
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url = URL + 'get_account/' + req.params.address;
  const result = await call(url);
  res.sendData(result);
});

router.get('/accounts/:address/resources', async (req, res) => {
  const page = parsePage(req);
  let option = {
    ...page,
    is_bcs_format: req.is_bcs_format,
  };
  option.address = req.params.address;
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url =
    URL +
    `get_account_resources/${option.address}//${option.ledger_version || 0}/${option.limit || 0
    }/${option.start || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/accounts/:address/modules', async (req, res) => {
  const page = parsePage(req);
  let option = {
    ...page,
    is_bcs_format: req.is_bcs_format,
  };
  option.account = req.params.address;
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url =
    URL +
    `get_account_modules/${option.account}/${option.ledger_version || 0}/${option.limit || 0
    }/${option.start || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/accounts/:address/resource/:resource_type', async (req, res) => {
  const address = req.params.address;
  let resource_type = req.params.resource_type;
  let option = {
    account: address,
    resource: resource_type,
    is_bcs_format: req.is_bcs_format,
  };
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url = URL + `get_account_resource/${option.account}/${option.resource}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/accounts/:address/module/:module_name', async (req, res) => {
  const address = req.params.address;
  const module_name = req.params.module_name;
  let option = {
    account: address,
    module_name: module_name,
    is_bcs_format: req.is_bcs_format,
  };
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url =
    URL + `get_account_module/${option.account}/${option.module_name}/${option.ledger_version || 0}`;
  const result = await call(url);
  res.sendData(result);
});

/////////////////////////////////account end///////////////////////////////////////

router.get('/blocks/by_height/:height', async (req, res) => {
  const height = req.params.height;
  const option = { with_transactions: false, is_bcs_format: req.is_bcs_format };
  const query = req.query;
  if (query.with_transactions?.toString() === 'true') {
    option.with_transactions = true;
  }
  option.height = parseInt(height);
  const url = URL + `get_block_by_height/${option.height}/${option.with_transactions ? 1 : 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/blocks/by_version/:version', async (req, res) => {
  const version = req.params.version;
  const option = {
    with_transactions: false,
    is_bcs_format: req.is_bcs_format,
  };
  if (req.query.with_transactions?.toString() === 'true') {
    option.with_transactions = true;
  }
  option.version = parseInt(version);
  const url = URL + `get_block_by_version/${option.version}/${option.with_transactions ? 1 : 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/accounts/:address/events/:creation_number', async (req, res) => {
  const page = parsePage(req);
  const address = req.params.address;
  const creation_number = req.params.creation_number;
  let option = {
    ...page,
    address,
    creation_number,
    is_bcs_format: req.is_bcs_format,
  };
  const url =
    URL +
    `get_events_by_creation_number/${option.address}/${option.creation_number
    }/${option.limit || 0}/${option.start || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/accounts/:address/events/:event_handle/:field_name', async (req, res) => {
  const page = parsePage(req);
  const address = req.params.address;
  const event_handle = req.params.event_handle;
  const field_name = req.params.field_name;
  let option = {
    ...page,
    address,
    event_handle,
    field_name,
    is_bcs_format: req.is_bcs_format,
  };
  const url =
    URL +
    `get_events_by_event_handle/${option.address}/${option.event_handle}/${option.field_name
    }/${option.limit || 0}/${option.start || 0}`;
  const result = await call(url);
  res.sendData(result);
});
router.get('/', async (req, res) => {
  const url = URL + `get_ledger_info`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/transactions', async (req, res) => {
  const option = { ...parsePage(req), is_bcs_format: req.is_bcs_format };
  const url = URL + `get_transactions/${option.limit || 0}/${option.start || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.post('/transactions', async (req, res) => {
  const body = Buffer.from(req.body).toString('hex');
  const result = await sendSubmitTx(body, req.req_header);
  console.log('---result---', result);
  res.sendData(result);
});

router.post('/transactions/batch', async (req, res) => {
  throw 'todo implement';
  const body = Buffer.from(req.body).toString('hex');
  let option = { data: body, is_bcs_format: req.is_bcs_format };
  const result = await request('submitTransactionBatch', option);
  res.sendData(result);
});

router.get('/transactions/by_hash/:txn_hash', async (req, res) => {
  let txn_hash = req.params.txn_hash;
  if (txn_hash.startsWith('0x')) txn_hash = txn_hash.slice(2);
  let option = {
    txn_hash: txn_hash,
    is_bcs_format: req.is_bcs_format,
  };
  const url = URL + `get_transaction_by_hash/${option.txn_hash}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/transactions/wait_by_hash/:txn_hash', async (req, res) => {
  let txn_hash = req.params.txn_hash;
  if (txn_hash.startsWith('0x')) txn_hash = txn_hash.slice(2);
  let option = {
    txn_hash: txn_hash,
    is_bcs_format: req.is_bcs_format,
  };
  const url = URL + `get_wait_transaction_by_hash/${option.txn_hash}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/transactions/by_version/:txn_version', async (req, res) => {
  let txn_version = req.params.txn_version;
  let option = {
    version: txn_version,
    is_bcs_format: req.is_bcs_format,
  };
  const url = URL + `get_transaction_by_version/${option.version}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/accounts/:address/transactions', async (req, res) => {
  const address = req.params.address;
  const page = parsePage(req);
  let option = {
    address: address,
    ...page,
    is_bcs_format: req.is_bcs_format,
  };

  const url = URL + `get_account_transaction/${option.address}/${option.limit || 0}/${option.start || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/estimate_gas_price', async (req, res) => {
  const url = URL + `estimate_gas_price`;
  const result = await call(url);
  res.sendData(result);
});

router.post('/transactions/simulate', async (req, res) => {
  const body = Buffer.from(req.body).toString('hex');
  const url =
    URL +
    `simulate_transaction`;
  const result = await post(url, {
    header: req.req_header,
    body: body,
    gasUnitPrice: req.query.estimate_gas_unit_price ? 1 : 0,
    maxGasAmount: req.query.estimate_max_gas_amount ? 1 : 0,
    prioritizedGasUnitPrice: req.query.estimate_prioritized_gas_unit_price ? 1 : 0,
  });
  res.sendData(result);
});

router.post('/view', async (req, res) => {
  const body = req.body;
  let option = {
    data: JSON.stringify(body),
    is_bcs_format: req.is_bcs_format,
  };
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url = URL + `view_function/${option.data}/${option.ledger_version || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.post('/tables/:table_handle/item', async (req, res) => {
  const body = req.body;
  const table_handle = req.params.table_handle;
  let option = {
    table_handle: table_handle,
    body: JSON.stringify(body),
    is_bcs_format: req.is_bcs_format,
  };
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url = URL + `get_table_item/${option.table_handle}/${option.body}/${option.ledger_version || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.post('/tables/:table_handle/raw_item', async (req, res) => {
  const body = req.body;
  const table_handle = req.params.table_handle;
  let option = {
    query: table_handle,
    body: JSON.stringify(body),
    is_bcs_format: req.is_bcs_format,
  };
  if (req.query.ledger_version) {
    option.ledger_version = '' + req.query.ledger_version;
  }
  const url =
    URL + `get_raw_table_item/${option.table_handle}/${option.body}/${option.ledger_version || 0}`;
  const result = await call(url);
  res.sendData(result);
});

router.get('/-/healthy', async (req, res) => {
  res.json({ message: 'success' });
});

router.post('/graphql', async (req, res) => {
  const url = URL + `aptos_indexer/${Buffer.from(JSON.stringify(req.body)).toString('hex')}`;
  const result = await call(url);
  res.json(JSON.parse(result.data));
});

const bcs_formatter = (req, res, next) => {
  let rev_format = APTOS_MIME_TYPE.JSON;
  let send_format = APTOS_MIME_TYPE.JSON;
  let accepts = req.headers['accept'];
  let content_types = req.headers['content-type'];
  if (accepts) {
    accepts = accepts.split(',');
    // https://github.com/aptos-labs/aptos-core/pull/12131
    if (accepts.includes(APTOS_MIME_TYPE.JSON)) {
      rev_format = APTOS_MIME_TYPE.JSON;
    } else if (accepts.includes(APTOS_MIME_TYPE.BCS)) {
      rev_format = APTOS_MIME_TYPE.BCS;
    }
  }
  if (content_types) {
    content_types = content_types.split(',');
    if (content_types.includes(APTOS_MIME_TYPE.BCS_VIEW_FUNCTION)) {
      send_format = APTOS_MIME_TYPE.BCS_VIEW_FUNCTION;
    } else if (content_types.includes(APTOS_MIME_TYPE.BCS_SIGNED_TRANSACTION)) {
      send_format = APTOS_MIME_TYPE.BCS_SIGNED_TRANSACTION;
    }
  }
  req.req_header = Buffer.from(`${send_format}&${rev_format}`).toString('hex');
  res.sendData = data => {
    setHeader(data.header, res);
    if (data.error) {
      res.status(data.error.code || 404).json(data.error);
    } else {
      if (rev_format === APTOS_MIME_TYPE.BCS) {
        res.setHeader('Content-Type', bcs);
        const buffer = Buffer.from(data.data, 'hex');
        res.status(200).send(buffer);
      } else {
        res.status(200).json(JSON.parse(data.data));
      }
    }
  };
  next();
};

app.use('/v1', bcs_formatter, router);

app.use((err, req, res, next) => {
  console.error('--------err---------', err);
  res.status(404);
  res.json({
    error_code: 'account_not_found',
    message: 'Internal Server Error',
  });
});
app.listen(PORT, () => {
  console.log(` app listening on port ${PORT}`);
});
