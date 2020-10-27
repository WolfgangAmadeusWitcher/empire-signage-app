import { TerminalSignage } from './terminal-signage.model';

export class Terminal {
  id: number;
  alias: string;
  status: number;
  terminalSignages: TerminalSignage[];
  calledTicketNumber: number;
}

export enum Status {
  Online = 1,
  Serving,
  Break,
  Idle,
  Offline,
}
