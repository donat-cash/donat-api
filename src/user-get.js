import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const params = {
    TableName: 'donat-users',
    Key: {
      userId: event.pathParameters.id,
    },
  };

  try {
    const result = await dynamoDbLib.call('get', params);

    if (result.Item) {
      callback(null, success(result.Item));
    }
    else {
      callback(null, failure({
        status: false,
        message: 'Item not found.',
      }));
    }
  }
  catch(e) {
    callback(null, failure({
      status: false,
      message: e,
    }));
  }
};

