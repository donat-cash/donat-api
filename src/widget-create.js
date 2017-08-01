import uuid from 'uuid';
import { Wallet } from 'yandex-money-sdk';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';

export async function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const api = new Wallet(data.accessToken);

  api.accountInfo(async (err, { account }) => {
    if (err !== null) {
      callback(null, failure({
        status: false,
        message: err,
      }));

      return;
    }

    const params = {
      TableName: 'donat-widgets',
      Item: {
        widgetId: uuid.v1(),
        userId: account,
        name: data.name,
        createdAt: new Date().getTime(),
      },
    };

    try {
      const result = await dynamoDbLib.call('put', params);

      callback(null, success(params.Item));
    }
    catch(e) {
      callback(null, failure({
        status: false,
        message: e,
      }));
    }
  });
};

