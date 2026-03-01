#!/usr/bin/env node

import { runAgentVmCtlCli } from '#src/features/cli/agent-vm-ctl.js';

void runAgentVmCtlCli(process.argv.slice(2));
