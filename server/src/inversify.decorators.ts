import * as inversify from 'inversify';

if (!Reflect.defineMetadata) {
  require('reflect-metadata');
}

export let inject = inversify.inject;
export let injectable = inversify.injectable;
