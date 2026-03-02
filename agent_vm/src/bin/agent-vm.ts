#!/usr/bin/env node

import { runAgentVmCli } from '#src/features/cli/agent-vm.js';

void runAgentVmCli(process.argv.slice(2));
