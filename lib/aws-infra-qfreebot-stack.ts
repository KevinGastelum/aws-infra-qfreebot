import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { time } from 'console'
import * as cdk from 'aws-cdk-lib'

export class AwsInfraQfreebotStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    const dockerFunc = new lambda.DockerImageFunction(this, 'DockerFunc', {
      code: lambda.DockerImageCode.fromImageAsset('./api'),
      memorySize: 2024,
      timeout: cdk.Duration.minutes(5),
      architecture: lambda.Architecture.X86_64,
    })
    // Turn this into docker func AND create dockerfile in

    // Create URL to access function
    const functionUrl = dockerFunc.addFunctionUrl({
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
  }
}
