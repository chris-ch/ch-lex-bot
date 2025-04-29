import type { ResourcesConfig } from 'aws-amplify'
import { parseAmplifyConfig } from 'aws-amplify/utils'
import outputs from '../amplify_outputs.json'

export const amplifyConfig: ResourcesConfig = parseAmplifyConfig(outputs)
