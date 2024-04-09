```bash
curl http://127.0.0.1:1317/aptcaller/aptcaller/get_account/0x1
curl http://127.0.0.1:1317/aptcaller/aptcaller/get_account_resources/0x1/0/0/0
curl http://127.0.0.1:1317/aptcaller/aptcaller/get_account_modules/0x1/0/0/0
curl "http://127.0.0.1:1317/aptcaller/aptcaller/get_account_resource/0x57d91c5fbebfdc3d0f42490db87e317c700e1248db8d46f1a8c7e735e835ba0b/0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>"

curl http://127.0.0.1:1317/aptcaller/aptcaller/get_account_module/0x1/coin
curl http://127.0.0.1:1317/aptcaller/aptcaller/get_block_by_height/1/1
curl http://127.0.0.1:1317/aptcaller/aptcaller/get_block_by_version/10000/1
curl http://127.0.0.1:1317/aptcaller/aptcaller/get_events_by_creation_number/0x1/1/0/0

curl http://127.0.0.1:1317/aptcaller/aptcaller/get_ledger_info

curl http://127.0.0.1:1317/aptcaller/aptcaller/get_transaction_by_hash/0x343f74105eea2d44866c6dc2da4da4b77b5afeac082bdb9023c4a612e0e6cd0d

curl http://127.0.0.1:1317/aptcaller/aptcaller/estimate_gas_price
aptcallerd query tx --type=hash EAFA75122424CA09575AA5516C6CEF944D64308941AF4B0B376705692D7BC145




ignite scaffold query get-account-resources address ledgerVersion limit start --response AptRes:AptRes
ignite scaffold query get-account-modules address ledgerVersion limit start --response AptRes:AptRes
ignite scaffold query get-account-resource address resource_type ledgerVersion --response AptRes:AptRes
ignite scaffold query get-account-module address module_name ledgerVersion --response AptRes:AptRes
ignite scaffold query get-block-by-height block-height with_transactions:uint --response AptRes:AptRes
ignite scaffold query get-block-by-version version with_transactions:uint --response AptRes:AptRes
ignite scaffold query get-events-by-creation-number address creation_number limit start --response AptRes:AptRes
ignite scaffold query get-events-by-event-handle address event_handle field_name limit start --response AptRes:AptRes
ignite scaffold query get-ledger-info --response AptRes:AptRes
ignite scaffold query get-transactions limit start --response AptRes:AptRes
ignite scaffold query get-transaction-by-hash txn_hash --response AptRes:AptRes
ignite scaffold query get-wait-transaction-by-hash txn_hash --response AptRes:AptRes
ignite scaffold query get-transaction-by-version txn_version --response AptRes:AptRes
ignite scaffold query get-account-transaction address limit start --response AptRes:AptRes
ignite scaffold query estimate_gas_price --response AptRes:AptRes
ignite scaffold query submit-batch-transaction body --response AptRes:AptRes
ignite scaffold query simulate-transaction body --response AptRes:AptRes
ignite scaffold query encode-submission body --response AptRes:AptRes
ignite scaffold query view-function body ledgerVersion --response AptRes:AptRes
ignite scaffold query get-table-item table_handle body ledgerVersion --response AptRes:AptRes
ignite scaffold query get-raw-table-item table_handle body ledgerVersion --response AptRes:AptRes


ignite scaffold message submit-transaction body --response AptRes:AptRes
ignite scaffold query get-transaction-by-count count:uint --response AptRes:AptRes
aptcallerd tx aptcaller submit-transaction "hello world this data" --from alice --chain-id aptcaller -y
aptcallerd query aptcaller get-transaction-by-count 1


```


```
curl -X POST -k http://localhost:8091/v1/control/start -d '{"execPath":"/home/ubuntu/avalanchego-v1.11.1/avalanchego","numNodes":1,"logLevel":"INFO","pluginDir":"/home/ubuntu/config/plugins","blockchainSpecs":[{"vm_name":"m1","genesis":"/home/ubuntu/config/genesis.json"}]}'

```


