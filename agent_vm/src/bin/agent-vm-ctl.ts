#!/usr/bin/env node

import { runAgentVmCtlCli } from '../cli/agent-vm-ctl.js';

void runAgentVmCtlCli(process.argv.slice(2));
