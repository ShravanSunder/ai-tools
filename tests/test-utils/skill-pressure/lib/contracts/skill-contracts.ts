import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parseDocument } from "yaml";

import type { SkillOwner } from "./contract-types.js";
import { parseV3BehaviorContract, type V3BehaviorContract } from "./v3-behavior-contract.js";

export class ContractValidationError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "ContractValidationError";
  }
}

export interface LoadScenarioContractProps {
  readonly scenarioPath: string;
  readonly expectedOwner?: SkillOwner;
}

export interface LoadedScenarioContract extends V3BehaviorContract {
  readonly scenarioPath: string;
}

export async function loadScenarioContract(
  props: LoadScenarioContractProps,
): Promise<LoadedScenarioContract> {
  const scenarioPath = resolve(props.scenarioPath);
  const source = await readFile(scenarioPath, "utf8");
  const frontmatter = /^---\s*\n([\s\S]*?)\n---(?:\s*\n|$)/u.exec(source)?.[1];
  if (frontmatter === undefined) {
    throw new ContractValidationError(`scenario contract is missing YAML frontmatter: ${scenarioPath}`);
  }
  const document = parseDocument(frontmatter, {
    prettyErrors: false,
    strict: true,
    uniqueKeys: true,
  });
  if (document.errors.length > 0) {
    throw new ContractValidationError(
      `scenario contract has invalid YAML at ${scenarioPath}: ${document.errors.map((error) => error.message).join("; ")}`,
    );
  }
  let contract: V3BehaviorContract;
  try {
    contract = parseV3BehaviorContract(document.toJS({ maxAliasCount: 0 }));
  } catch (error) {
    throw new ContractValidationError(
      `scenario contract is invalid at ${scenarioPath}: ${error instanceof Error ? error.message : "unknown contract error"}`,
    );
  }
  if (
    props.expectedOwner !== undefined &&
    (contract.plugin !== props.expectedOwner.plugin || contract.skill !== props.expectedOwner.skill)
  ) {
    throw new ContractValidationError(`scenario owner fields do not match owner path: ${scenarioPath}`);
  }
  return { ...contract, scenarioPath };
}
