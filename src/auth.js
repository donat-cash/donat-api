import yandexMoney from 'yandex-money-sdk';
import { success, failure } from './libs/response-lib';
import config from '../config';

export function main(event, context, callback) {
  callback(null, success({
    url: yandexMoney.Wallet.buildObtainTokenUrl(config.clientId, config.redirectURI, [
      'account-info',
      'operation-history',
    ]),
  }));
};

