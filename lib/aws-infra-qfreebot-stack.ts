import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as ddb from 'aws-cdk-lib/aws-dynamodb'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as cdk from 'aws-cdk-lib'

export class AwsInfraQfreebotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    // Create DDB table to store the tasks.
    const table = new ddb.Table(this, 'Tasks', {
      partitionKey: { name: 'task_id', type: ddb.AttributeType.STRING },
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      timeToLiveAttribute: 'ttl',
    })

    // Add GSI based on user_id.
    table.addGlobalSecondaryIndex({
      indexName: 'user-index',
      partitionKey: { name: 'user_id', type: ddb.AttributeType.STRING },
      sortKey: { name: 'created_time', type: ddb.AttributeType.NUMBER },
    })

    // Create Lambda function for the API
    const api = new lambda.Function(this, 'API', {
      runtime: lambda.Runtime.PYTHON_3_8,
      code: lambda.Code.fromAsset('./api'),
      handler: 'todo.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    })

    // Create URL to access function
    const functionUrl = api.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.ALL],
        allowedHeaders: ['*'],
      },
    })

    // Output the API function url.
    new CfnOutput(this, 'APIUrl', {
      value: functionUrl.url,
    })
    // Give Lambda permissions to read/write to the table
    table.grantReadWriteData(api)
  }
}
