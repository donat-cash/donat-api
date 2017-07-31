import yandexMoney from 'yandex-money-sdk';
import uuid from 'uuid';
import * as dynamoDbLib from './libs/dynamodb-lib';
import { success, failure } from './libs/response-lib';
import config from '../config';

export function main(event, context, callback) {
  yandexMoney.Wallet.getAccessToken(config.clientId, event.queryParams.code, config.redirectURI, config.clientSecret, async (err, response) => {
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

    callback(null, success({
      accessToken: response.access_token,
    }));
  });
};

