import uuid from 'uuid';
import AWS from 'aws-sdk';

AWS.config.update({
  region:'us-west-2'
});

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function main(event, context, callback) {
  const data = JSON.parse(event.body);
  const params = {
    TableName: 'notes',
    Item: {
      userId: event.requestContext.authorizer.claims.sub,
      widgetId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: new Date().getTime(),
    },
  };

  dynamoDb.put(params, (error, data) => {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    };

    if (error !== null) {
      callback(null, {
        statusCode: 500,
        headers: headers,
        body: JSON.stringify({
          status: false
        }),
      });

      return;
    }

    callback(null, {
      statusCode: 200,
      headers: headers,
      body: JSON.stringify(params.Item),
    });
  });
};
