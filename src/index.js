import 'babel-polyfill';

export { default as createScraper } from './scrapers/factory';
export { SCRAPERS } from './definitions';

export function requestedChromiumVersion() {
  // The chromium version was copied automatically during the publish process
  // from './node_modules/puppeteer-core/package.json, property:
  //   "puppeteer": {
  //     "chromium_revision": "XXXX"
  //   }
  return '656675';
}
