import { Wallet } from 'yandex-money-sdk';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const api = new Wallet(data.accessToken);

  api.accountInfo((err) => {
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
    };

    try {
      const result = await dynamoDbLib.call('delete', params);

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

