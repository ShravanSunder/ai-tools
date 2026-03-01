import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { z } from 'zod';

import { buildConfigInputSchema } from '#src/core/models/build-config.js';
import { vmRuntimeConfigInputSchema } from '#src/core/models/vm-runtime-config.js';
import { tcpServiceConfigInputSchema } from '#src/features/runtime-control/tcp-service-config.js';

const thisFilePath = fileURLToPath(import.meta.url);
const thisDirectoryPath = path.dirname(thisFilePath);
const schemaOutputDirectoryPath = path.resolve(thisDirectoryPath, '../../schemas');

function writeSchemaFile(fileName: string, schema: z.ZodTypeAny, id: string): void {
	const jsonSchema = z.toJSONSchema(schema);
	const withMetadata = {
		$id: id,
		...jsonSchema,
	};

	fs.mkdirSync(schemaOutputDirectoryPath, { recursive: true });
	const outputPath = path.join(schemaOutputDirectoryPath, fileName);
	fs.writeFileSync(outputPath, `${JSON.stringify(withMetadata, null, '\t')}\n`, 'utf8');
}

function main(): void {
	writeSchemaFile('build-config.schema.json', buildConfigInputSchema, 'build-config');
	writeSchemaFile('vm-runtime.schema.json', vmRuntimeConfigInputSchema, 'vm-runtime');
	writeSchemaFile('tcp-services.schema.json', tcpServiceConfigInputSchema, 'tcp-services');
}

main();
