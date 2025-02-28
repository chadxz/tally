import "@opentelemetry/instrumentation/hook.mjs"; // imported so it is bundled
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('@opentelemetry/instrumentation/hook.mjs', pathToFileURL('./'));
