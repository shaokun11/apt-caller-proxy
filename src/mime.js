// https://github.com/aptos-labs/aptos-core/blob/1de391c3589cf2d07cb423a73c4a2a6caa299ebf/api/types/src/mime_types.rs#L11

exports.APTOS_MIME_TYPE = {
    /// MIME type to submit BCS transactions
    BCS_VIEW_FUNCTION: 'application/x.aptos.view_function+bcs',

    BCS_SIGNED_TRANSACTION: 'application/x.aptos.signed_transaction+bcs',

    /// MIME type to submit JSON transactions and get JSON output
    JSON: 'application/json',

    /// MIME type to get BCS output
    BCS: 'application/x-bcs',
};
