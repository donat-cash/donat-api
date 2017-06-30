import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'donat-pays',
    Item: {
      payId: uuid.v1(),
      userId: event.requestContext.authorizer.claims.sub,
      name: data.name,
      createdAt: new Date().getTime(),
    },
  };

  try {
    const result = await dynamoDbLib.call('put', params);

    callback(null, success(params.Item));
  }
  catch(e) {
    console.log(e);

    callback(null, failure({
      status: false
    }));
  }
};
