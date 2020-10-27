import { Status, Terminal } from './../models/terminal.model';
import { TerminalSignage } from './../models/terminal-signage.model';
import { SignageService } from './../services/signage.service';
import { SignalRService } from './../services/signal-r.service';
import { Signage } from './../models/signage.model';
import { HashTable } from './../utils/hash-table';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-signage',
  templateUrl: './signage.component.html',
  styleUrls: ['./signage.component.css'],
})
export class SignageComponent implements OnInit {
  signages = new HashTable<number, Signage>();
  terminals = new HashTable<number, Terminal>();
  terminalSignages = new HashTable<number, Terminal[]>();
  selectedSignage: Signage;
  calledTicketNumber: number;

  constructor(
    private signalRService: SignalRService,
    private signageService: SignageService
  ) {
    this.signalRService.signageUpdated.subscribe((sign) =>
      this.updateSignage(sign)
    );

    this.signalRService.signageCreated.subscribe((sign) =>
      this.signages.put(sign.id, sign)
    );

    this.signalRService.signageDeleted.subscribe((sign) =>
      this.deleteSignage(sign)
    );

    this.signalRService.terminalUpdated.subscribe((terminal) =>
      this.updateTerminal(terminal)
    );

    this.signalRService.terminalDeleted.subscribe((terminal) =>
      this.terminals.remove(terminal.id)
    );

    this.signalRService.terminalSignageCreated.subscribe(
      (terminalSign: TerminalSignage) => {
        const updatedSignage = this.signages.get(terminalSign.signageId);
        updatedSignage.terminalSignages.push(terminalSign);
        this.updateSignage(updatedSignage);
      }
    );

    this.signalRService.terminalSignageDeleted.subscribe(
      (terminalSign: TerminalSignage) => {
        const updatedSignage = this.signages.get(terminalSign.signageId);
        const deleteIndex = updatedSignage.terminalSignages.findIndex(
          (ts) => ts.terminalId === terminalSign.terminalId
        );
        updatedSignage.terminalSignages.splice(deleteIndex, 1);
        this.updateSignage(updatedSignage);
      }
    );
  }

  ngOnInit(): void {
    this.loadAllSignages();
    this.loadAllTerminals();
    this.signalRService.startConnection();
    this.signalRService.addSignageCreatedEventListener();
    this.signalRService.addSignageUpdatedEventListener();
    this.signalRService.addSignageDeletedEventListener();
    this.signalRService.addTerminalSignageAddedEventListener();
    this.signalRService.addTerminalSignageDeletedEventListener();
    this.signalRService.addTerminalDeletedEventListener();
    this.signalRService.addTerminalUpdatedEventListener();
    this.signalRService.onDisconnectEventListener();
  }

  loadAllSignages(): void {
    this.signageService.getAll().subscribe((signageRecords) => {
      signageRecords.map((signage) => this.signages.put(signage.id, signage));
    });
  }

  loadAllTerminals(): void {
    this.signageService.getAllTerminals().subscribe((terminalRecords) => {
      terminalRecords.map((terminal) =>
        this.terminals.put(terminal.id, terminal)
      );
    });
  }

  updateSignage(updatedSignage: Signage): void {
    const oldSignage = this.signages.get(updatedSignage.id);
    oldSignage.terminalSignages.forEach(ts => updatedSignage.terminalSignages.push(ts));
    this.signages.remove(updatedSignage.id);
    this.signages.put(updatedSignage.id, updatedSignage);
    this.selectedSignage = this.signages.get(this.selectedSignage.id);
  }

  updateTerminal(updatedTerminal: Terminal): void {
    this.terminals.remove(updatedTerminal.id);
    this.terminals.put(updatedTerminal.id, updatedTerminal);
  }

  deleteSignage(signage: Signage): void {
    this.signages.remove(signage.id);
    this.selectedSignage = this.signages.get(this.selectedSignage.id);
  }

  onSignageSelected($event): void {
    const currentSelection = this.signages.get(
      parseInt($event.target.value, 10)
    );

    if (this.selectedSignage !== undefined){
      this.signalRService.inActivateSelectedSignage(this.selectedSignage);
    }
    this.selectedSignage = currentSelection;
    this.activateSelectedSignage();
  }

  getTerminalsForSelectedSignage(): Terminal[] {
    return this.terminals
      .getAll()
      .filter((terminal) =>
        this.selectedSignage.terminalSignages.some(
          (sign) => sign.terminalId === terminal.id
        )
      );
  }

  activateSelectedSignage(): void{
    this.signalRService.activateSelectedSignage(this.selectedSignage);
  }

  getStatusText(statusCode: number): string {
    return Status[statusCode];
  }
}
