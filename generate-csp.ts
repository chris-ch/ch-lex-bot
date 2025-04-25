import * as fs from 'fs';

// Get the HANKO_API_URL from environment variable
const hankoApiUrl = process.env.HANKO_API_URL || '';

// Generate the CSP content
const cspContent = `default-src 'self'; script-src 'self' 'unsafe-eval' ${hankoApiUrl}; style-src 'self' 'unsafe-inline'; style-src-elem 'self' 'unsafe-inline'; connect-src 'self' ${hankoApiUrl}; frame-src 'self' ${hankoApiUrl};`;

// Create the headers file that Amplify will use
const headersConfig = {
  customHeaders: [
    {
      pattern: '**/*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: cspContent
        }
      ]
    }
  ]
};

// Write the config to a file
fs.writeFileSync('./amplify-headers.json', JSON.stringify(headersConfig, null, 2));

console.log('Generated CSP headers configuration');
