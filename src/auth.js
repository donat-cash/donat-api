import yandexMoney from 'yandex-money-sdk';
import { failure } from './libs/response-lib';
import config from '../config';

export function main(event, context, callback) {
  if (event.requestContext.authorizer.claims.sub === undefined) {
    callback(null, failure({
      status: false,
      message: 'Not user',
    }));

    return;
  }

  callback(null, {
    statusCode: 302,
    headers: {
      Location: yandexMoney.Wallet.buildObtainTokenUrl(config.clientId, config.redirectURI, [
        'account-info',
        'operation-history',
      ]),
    },
  });
};

