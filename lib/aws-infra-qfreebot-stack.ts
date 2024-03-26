import { Stack, StackProps, aws_ec2, aws_iam } from 'aws-cdk-lib' // CfnOutput
import { Construct } from 'constructs'
import { Effect } from 'aws-cdk-lib/aws-iam'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as fs from 'fs'

interface NetworkProps extends StackProps {
  cidr: string
}

export class NetworkStack extends Stack {
  public readonly vpc: aws_ec2.Vpc

  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id, props)

    this.vpc = new aws_ec2.Vpc(this, 'VpcDemo', {
      vpcName: 'VpcDemo',
      maxAzs: 1,
      subnetConfiguration: [
        {
          name: 'PublicSubnet',
          cidrMask: 24,
          subnetType: aws_ec2.SubnetType.PUBLIC,
        },
        {
          name: 'PrivateSubnet',
          cidrMask: 24,
          subnetType: aws_ec2.SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          name: 'IsolatedSubnet',
          cidrMask: 24,
          subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    })
    // Optional Add API Gateway - Try Adding Lambda Function here
    // const dockerFunc = new lambda.DockerImageFunction(this, 'DockerFunc', {
    //   code: lambda.DockerImageCode.fromImageAsset('../api'),
    //   memorySize: 1024,
    //   timeout: cdk.Duration.minutes(5),
    //   architecture: lambda.Architecture.X86_64,
    // })
    //         const functionUrl = dockerFunc.addFunctionUrl({
    //       authType: lambda.FunctionUrlAuthType.NONE,
    //       cors: {
    //         allowedMethods: [lambda.HttpMethod.ALL],
    //         allowedHeaders: ["*"],
    //         allowedOrigins: ["*"],
    //       },
    //     });

    //     // Output the API function url.
    //     new CfnOutput(this, "APIUrl", {
    //       value: functionUrl.url,
    //     });
    //   }
    // }
  }
}

interface ApplicationProps extends StackProps {
  keyName: string
  vpc: aws_ec2.Vpc
}

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props: ApplicationProps) {
    super(scope, id, props)

    //  Security Group open 80 and 22
    const sg = new aws_ec2.SecurityGroup(this, 'Open80And225G', {
      securityGroupName: 'Open80And225G',
      vpc: props.vpc,
    })

    sg.addIngressRule(
      aws_ec2.Peer.anyIpv4(),
      aws_ec2.Port.tcp(80),
      'Open port 80 for http'
    )

    sg.addIngressRule(
      aws_ec2.Peer.anyIpv4(),
      aws_ec2.Port.tcp(22),
      'Open port 22 for ssh'
    )
    // Role for Instance
    const role = new aws_iam.Role(this, 'Ec2ToConnectSSMAndAccessS3', {
      roleName: 'Ec2ToConnectSSMAndAccessS3',
      assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com'),
    })
    role.addManagedPolicy(
      aws_iam.ManagedPolicy.fromManagedPolicyArn(
        this,
        'SSMaanagedPolicyForEc2',
        'arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore'
      )
    )
    role.addToPolicy(
      new aws_iam.PolicyStatement({
        effect: Effect.ALLOW,
        resources: ['*'],
        actions: ['s3:*'],
      })
    )

    // EC2 in Public Subnet
    const ec2 = new aws_ec2.Instance(this, 'PubEc2', {
      instanceName: 'PubEc2',
      vpc: props.vpc,
      role: role,
      securityGroup: sg,
      vpcSubnets: {
        subnetType: aws_ec2.SubnetType.PUBLIC,
      },
      instanceType: aws_ec2.InstanceType.of(
        aws_ec2.InstanceClass.T3,
        aws_ec2.InstanceSize.SMALL
      ),
      machineImage: new aws_ec2.AmazonLinuxImage({
        generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        edition: aws_ec2.AmazonLinuxEdition.STANDARD,
      }),
      allowAllOutbound: true,
    })
    //  Add user to Ec2
    ec2.addUserData(
      fs.readFileSync('./lib/user-data.sh', { encoding: 'utf-8' })
    )
  }
}
