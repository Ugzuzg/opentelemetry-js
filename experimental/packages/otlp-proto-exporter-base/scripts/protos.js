'use strict';

const cp = require('child_process');
const path = require('path');

const generatedPath = path.resolve(__dirname, '../src/generated');
const protosPath = path.resolve(__dirname, '../protos');
const protos = [
  'opentelemetry/proto/common/v1/common.proto',
  'opentelemetry/proto/resource/v1/resource.proto',
  'opentelemetry/proto/trace/v1/trace.proto',
  'opentelemetry/proto/collector/trace/v1/trace_service.proto',
  'opentelemetry/proto/metrics/v1/metrics.proto',
  'opentelemetry/proto/collector/metrics/v1/metrics_service.proto',
].map(it => {
  return path.join(protosPath, it);
});

function exec(command, argv) {
  return new Promise((resolve, reject) => {
    const child = cp.spawn(process.execPath, [command, ...argv], {
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    child.on('exit', (code, signal) => {
      if (code !== 0) {
        reject(new Error(`${command} exited with non-zero code(${code}, ${signal})`));
        return;
      }
      resolve();
    })
  });
}

function pbts(pbjsOutFile) {
  const pbtsPath = path.resolve(__dirname, '../node_modules/.bin/pbts');
  const pbtsOptions = [
    '-o', path.join(generatedPath, 'root.d.ts'),
  ]
  return exec(pbtsPath, [...pbtsOptions, pbjsOutFile]);
}

async function pbjs(files) {
  const pbjsPath = path.resolve(__dirname, '../node_modules/.bin/pbjs');
  const outFile = path.join(generatedPath, 'root.js');
  const pbjsOptions = [
    '-t', 'static-module',
    '-w', 'commonjs',
    '--null-defaults',
    '-o', outFile,
  ];
  await exec(pbjsPath, [...pbjsOptions, ...files]);
  return outFile;
}

(async function main() {
  const pbjsOut = await pbjs(protos);
  await pbts(pbjsOut);
})();
