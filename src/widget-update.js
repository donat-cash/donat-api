import { Wallet } from 'yandex-money-sdk';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const api = new Wallet(data.accessToken);

  api.accountInfo(async (err) => {
    if (err !== null) {
      callback(null, failure({
        status: false,
        message: err,
      }));

      return;
    }

    const params = {
      TableName: 'donat-widgets',
      Key: {
        widgetId: event.pathParameters.id,
      },
      UpdateExpression: 'SET name = :name, sum = :sum',
      ExpressionAttributeValues: {
        ':name': data.name ? data.name : null,
        ':sum': data.sum ? data.sum : null,
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      const result = await dynamoDbLib.call('update', params);

      callback(null, success({
        status: true,
      }));
    }
    catch(e) {
      callback(null, failure({
        status: false,
        message: e,
      }));
    }
  });
};

