// import Core from "@cosmos-client/core";
const Core = require("@cosmos-client/core");
const cosmosclient = Core.default;
const readline = require('readline');
const sdk = new cosmosclient.CosmosSDK("http://localhost:1317", "aptcaller");

async function x() {
  const privKey = new cosmosclient.proto.cosmos.crypto.secp256k1.PrivKey({
    key: await cosmosclient.generatePrivKeyFromMnemonic(
      "foam chimney square mammal wife random trial busy clutch stadium poem eight intact such hint print boss update poem calm shoot cor"
    ),
  });
  const pubKey = privKey.pubKey();
  const address = cosmosclient.AccAddress.fromPublicKey(pubKey);
  console.log(address.toString());
  const fromAddress = address;
  const toAddress = address;
  // const account = await cosmosclient.rest.auth
  //   .account(sdk, fromAddress)
  //   .then((res) =>
  //     cosmosclient.codec.protoJSONToInstance(
  //       cosmosclient.codec.castProtoJSONOfProtoAny(res.data.account)
  //     )
  //   )
  //   .catch((err) => {
  //     console.log("error", err);
  //   });
  const msgSend = new cosmosclient.proto.cosmos.bank.v1beta1.MsgSend({
    from_address: fromAddress.toString(),
    to_address: toAddress.toString(),
    amount: [{ denom: 'token', amount: '1' }],
  });
}
// x();

// avalanche-network-runner server --log-level debug --port=":8090" --grpc-gateway-port=":8091"
// curl -X POST -k http://localhost:8091/v1/control/start -d '{"execPath":"/home/ubuntu/avalanchego-v1.11.1/avalanchego","numNodes":1,"logLevel":"INFO","pluginDir":"/home/ubuntu/config/plugins","blockchainSpecs":[{"vm_name":"m1","genesis":"/home/ubuntu/config/genesis.json"}]}'

// curl -X POST -k http://localhost:8081/v1/control/start -d '{"execPath":"/home/ubuntu/avalanchego-v1.11.1/avalanchego","numNodes":1,"logLevel":"INFO","pluginDir":"/home/ubuntu/config/plugins","blockchainSpecs":[{"vm_name":"m1","genesis":"/home/ubuntu/config/genesis.json"}]}'
const fs = require("fs")

let txt = `
code: 0
codespace: ""
data: ""
events: []
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: ""
timestamp: ""
tx: null
txhash: 9BDC0D72A3DAB6B79577ABA5A1C00D72C7020C6019303E88E1C0BD4431FD28EA
code: 0
codespace: ""
data: ""
events: []
gas_used: "0"
gas_wanted: "0"
height: "0"
info: ""
logs: []
raw_log: ""
timestamp: ""
tx: null
txhash: 9BDC0D72A3DAB6B79577ABA5A1C00D72C7020C6019303E88E1C0BD4431FD28EA

`
const line =  txt.split('\n').find(it=>it.includes("txhash"));
console.log(line)


fetch("http://127.0.0.1:1317/cosmos/tx/v1beta1/txs/3951C8C70EF10617B5203892DEAF1DDF7F01546B0205D8A09D9E7BF74587F7AA").then(res=>res.json()).then(console.log)  