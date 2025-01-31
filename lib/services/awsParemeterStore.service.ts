import { AWSParameterNames } from './envVariables.service';
import { SSMClient, GetParametersCommand } from '@aws-sdk/client-ssm';

const REGION = 'us-east-1';

const ssmClient = new SSMClient({ region: REGION });

async function getParameters(names: string[]): Promise<Record<string, string>> {
  try {
    const command = new GetParametersCommand({
      Names: names,
      WithDecryption: true,
    });

    const response = await ssmClient.send(command);
    const parameters = response.Parameters || [];

    // Convert response to a key-value map
    return parameters.reduce(
      (acc, param) => {
        if (param.Name && param.Value) {
          acc[param.Name] = param.Value;
        }
        return acc;
      },
      {} as Record<string, string>
    );
  } catch (error) {
    console.error('Error fetching parameters:', error);
    throw error;
  }
}

export const setEnvVariables = async () => {
  try {
    const envVariables = await getParameters(AWSParameterNames);
    const envKeys = Object.keys(envVariables);
    envKeys.forEach(key => {
      process.env[key] = envVariables[key];
    });
    console.log('Loaded parameters');
  } catch (err) {
    console.error('Failed to load parameters:', err);
  }
};
