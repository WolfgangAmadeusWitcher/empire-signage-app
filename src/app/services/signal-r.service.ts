import { Terminal } from './../models/terminal.model';
import { TerminalSignage } from './../models/terminal-signage.model';
import { Signage } from './../models/signage.model';
import { EventEmitter, Output } from '@angular/core';
import { Injectable } from '@angular/core';
import * as signalR from '@aspnet/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  @Output() signageCreated = new EventEmitter<Signage>();
  @Output() signageDeleted = new EventEmitter<number>();
  @Output() signageUpdated = new EventEmitter<Signage>();

  @Output() terminalUpdated = new EventEmitter<Terminal>();
  @Output() terminalDeleted = new EventEmitter<Terminal>();

  @Output() terminalSignageCreated = new EventEmitter<TerminalSignage>();
  @Output() terminalSignageDeleted = new EventEmitter<TerminalSignage>();

  public signage: Signage;
  public terminal: Terminal;
  public terminalSignage: TerminalSignage;
  private hubConnection: signalR.HubConnection;

  public startConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:5009/signage')
      .build();
    console.log('Connection Starting...');
    this.hubConnection
      .start()
      .then(() => console.log('Connection started'))
      .catch((err) => console.log('Error while starting connection: ' + err));
  }

  addSignageCreatedEventListener(): void {
    this.hubConnection.on('signage-created-event', (signageRecord) => {
      this.signage = signageRecord;
      this.signageCreated.emit(this.signage);
    });
  }

  addSignageDeletedEventListener(): void {
    this.hubConnection.on('signage-deleted-event', (signageId) => {
      this.signageDeleted.emit(signageId);
    });
  }

  addSignageUpdatedEventListener(): void{
    this.hubConnection.on('signage-updated-event', (signageRecord) => {
      this.signage = signageRecord;
      this.signageUpdated.emit(this.signage);
    });
  }

  addTerminalSignageAddedEventListener(): void{
    this.hubConnection.on('terminal-signage-created-event', (terminalSignage) => {
      this.terminalSignage = terminalSignage;
      this.terminalSignageCreated.emit(this.terminalSignage);
    });
  }

  addTerminalSignageDeletedEventListener(): void{
    this.hubConnection.on('terminal-signage-deleted-event', (terminalSignage) => {
      this.terminalSignage = terminalSignage;
      this.terminalSignageDeleted.emit(this.terminalSignage);
    });
  }


  addTerminalDeletedEventListener(): void {
    this.hubConnection.on('terminal-deleted-event', (terminalId) => {
      this.terminalDeleted.emit(terminalId);
    });
  }

  addTerminalUpdatedEventListener(): void{
    this.hubConnection.on('terminal-updated-event', (terminalRecord) => {
      this.terminal = terminalRecord;
      console.log(this.terminal);
      this.terminalUpdated.emit(this.terminal);
    });
  }

  activateSelectedSignage(selectedSignage: Signage): void {
    this.hubConnection
      .invoke('ActivateSignage', selectedSignage)
      .catch((err) => console.error(err));
  }

  inActivateSelectedSignage(selectedSignage: Signage): void {
    this.hubConnection
      .invoke('InactivateSignage', selectedSignage)
      .catch((err) => console.error(err));
  }

  onDisconnectEventListener(): void {
    this.hubConnection.onclose((error) => console.log(error));
  }
}
