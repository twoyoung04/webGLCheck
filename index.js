import {compatibilityCheckCommon} from './check.js';

testDemand = {
  mobile: false,
  nwClient: true,
  webGL: true,
  browserVersions: {chrome: 57, safari: 20, firefox: 52, edge: 12},
  url: './'
}

function buttonClick () {
    console.log('buttonClick');
    compatibilityCheckCommon(testDemand);
}
