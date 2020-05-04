var options = {
    TableName: 'options',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'uuid',
            KeyType: 'HASH',
        },
        { // Optional RANGE key type for HASH + RANGE tables
            AttributeName: 'symbol', 
            KeyType: 'RANGE', 
        }
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'uuid',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        {
            AttributeName: 'symbol',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        
        // ... more attributes ...
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
    },
};

dynamodb.createTable(options, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});

var symbols = {
    TableName: 'symbols',
    KeySchema: [ // The type of of schema.  Must start with a HASH type, with an optional second RANGE.
        { // Required HASH type attribute
            AttributeName: 'symbol',
            KeyType: 'HASH',
        },
    ],
    AttributeDefinitions: [ // The names and types of all primary and index key attributes only
        {
            AttributeName: 'symbol',
            AttributeType: 'S', // (S | N | B) for string, number, binary
        },
        // ... more attributes ...
    ],
    ProvisionedThroughput: { // required provisioned throughput for the table
        ReadCapacityUnits: 1, 
        WriteCapacityUnits: 1, 
    },
};

dynamodb.createTable(symbols, function(err, data) {
    if (err) ppJson(err); // an error occurred
    else ppJson(data); // successful response
});