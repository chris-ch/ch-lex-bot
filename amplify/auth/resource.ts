import { defineAuth, secret } from '@aws-amplify/backend'

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      callbackUrls: [
        'https://main.d2oscfxu87lwbd.amplifyapp.com/',
        'https://localhost:8443/',
        'http://localhost:5173/',
      ],
      logoutUrls: [
        'https://main.d2oscfxu87lwbd.amplifyapp.com/',
        'https://localhost:8443/',
        'http://localhost:5173/',
      ],
      google: {
        clientId: secret('GOOGLE_CLIENT_ID'),
        clientSecret: secret('GOOGLE_CLIENT_SECRET'),
        // make sure we ask Google for the email
        scopes: ['openid', 'email', 'profile'],
        attributeMapping: {
          email: 'email',
        },
      },
      facebook: {
        clientId: secret('FACEBOOK_CLIENT_ID'),
        clientSecret: secret('FACEBOOK_CLIENT_SECRET'),
        scopes: ['email', 'public_profile'],
        attributeMapping: {
          email: 'email',
        },
      },
    },
  },
  userAttributes: {
    'custom:openai-api-key': {
      dataType: 'String',
      mutable: true,
    },
  },
})
