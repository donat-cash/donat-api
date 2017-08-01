import yandexMoney from 'yandex-money-sdk';
import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';
import config from '../config';

export function main(event, context, callback) {
  const data = JSON.parse(event.body);

  yandexMoney.Wallet.getAccessToken(config.clientId, data.code, config.redirectURI, config.clientSecret, async (err, response) => {
    if (err !== null) {
      callback(null, failure({
        status: false,
        message: err,
      }));

      return;
    }

    if (response.error !== undefined) {
      callback(null, failure({
        status: false,
        message: response.error,
      }));

      return;
    }

    const api = new Wallet(response.access_token);

    api.accountInfo((err, { account }) => {
      if (err !== null) {
        callback(null, failure({
          status: false,
          message: err,
        }));

        return;
      }

      const params = {
        TableName: 'donat-users',
        Item: {
          userId: account,
          accessToken: response.access_token,
          createdAt: new Date().getTime(),
        },
      };

      try {
        await dynamoDbLib.call('put', params);

        callback(null, success(params.Item));
      }
      catch(e) {
        callback(null, failure({
          status: false,
          message: e,
        }));
      }
    });
  });
};

