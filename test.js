// import Core from "@cosmos-client/core";
const Core = require("@cosmos-client/core");
const cosmosclient = Core.default;

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


console.log(Buffer.from("6c7efc6b3b0f2a3240736b0efaf514c7aa3c3de79c5e9b82dc72c8fe93b15ec200000000000000000200000000000000000000000000000000000000000000000000000000000000010d6170746f735f6163636f756e740e7472616e736665725f636f696e73010700000000000000000000000000000000000000000000000000000000000000010a6170746f735f636f696e094170746f73436f696e0002203721b408f83b272e144bb4a4c13ac44a4de6dbb18c63b19a9d9087eedfd823d108a0860100000000000e000000000000009600000000000000a20e166600000000020020946f16230623155c6d9e7d347d34faa64e24921e7db205f6183cf8c37a098dae40e31732f1f0308c9bf76a67a59a8f4f3032425b5e1fc13190c5f2fb8a8c7b02c9cc5e4aabb8087ecddadf2b7b8109815b44108adefdd36f553eca9d232aa1d102"), "hex")