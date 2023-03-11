// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Config } from './config.interface';

export const environment: Config = {
  production: false,
  apiEndpoints: {
    product: 'https://sgvz5ygvqk.execute-api.eu-west-1.amazonaws.com',
    order: 'https://sgvz5ygvqk.execute-api.eu-west-1.amazonaws.com',
    import: 'https://3e4fmfi765.execute-api.eu-west-1.amazonaws.com',
    bff: 'https://sgvz5ygvqk.execute-api.eu-west-1.amazonaws.com',
    cart: 'https://sgvz5ygvqk.execute-api.eu-west-1.amazonaws.com',
  },
  apiEndpointsEnabled: {
    product: true,
    order: false,
    import: true,
    bff: true,
    cart: false,
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
