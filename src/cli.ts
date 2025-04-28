#!/usr/bin/env node

import { Command } from 'commander';
import { AcrossClient, createAcrossClient } from './client';

export const program = new Command();
const client = createAcrossClient();

function parseKeyValueParams(paramList: string[]): Record<string, string> {
  const params: Record<string, string> = {};
  for (const param of paramList) {
    const [key, value] = param.split('=');
    if (!key || value === undefined) {
      throw new Error(
        `Invalid parameter format: "${param}". Expected format is key=value`,
      );
    }
    params[key] = value;
  }
  return params;
}

program
  .name('across-v3-cli')
  .description('CLI for interacting with Across V3 SDK')
  .argument('<method>', 'API method to call')
  .option('-p, --params <params...>', 'API call params')
  .option('-o, --output <fields...>', 'Output fields')
  .action(
    async (
      method: string,
      options: { params: string[]; output?: string[] },
    ) => {
      try {
        const paramsObject = options.params
          ? parseKeyValueParams(options.params)
          : {};
        const outputFields = options.output || [];

        const apiMethod = client[method as keyof AcrossClient];
        if (!apiMethod) {
          console.error(`❌ Unknown method: ${method}`);
          process.exit(1);
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const result = await apiMethod(paramsObject as any);

        if (outputFields.length > 0) {
          const filteredResult = outputFields.reduce(
            (acc: Record<string, unknown>, field: string) => {
              acc[field] = result[field as keyof typeof result];
              return acc;
            },
            {},
          );
          console.log(JSON.stringify(filteredResult, null, 2));
        } else {
          console.log(JSON.stringify(result, null, 2));
        }
      } catch (error: Error | unknown) {
        console.error(
          '❌ Error:',
          error instanceof Error ? error.message : String(error),
        );
        process.exit(1);
      }
    },
  );

program.parseAsync(process.argv);
