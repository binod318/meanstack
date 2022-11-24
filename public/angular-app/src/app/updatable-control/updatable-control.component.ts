import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-updatable-control',
  templateUrl: './updatable-control.component.html',
  styleUrls: ['./updatable-control.component.css']
})
export class UpdatableControlComponent implements OnInit {

  isUpdatable: boolean = false;

  @Input()
  label!: string;

  @Input()
  placeholder!: string;

  @Input()
  value!: string;

  @Output()
  valueChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  actionEvent: EventEmitter<string> = new EventEmitter<string>();

  //labels
  bornYearLabel: string = environment.bornYear_label;
  genderLabel: string = environment.gender_label;
  nationLabel: string = environment.nation_label;
  firstSongLabel: string = environment.firstSong_label;
  bandsLabel: string = environment.bands_label;
  edit_label: string = environment.edit_label;
  cancel_label: string = environment.cancel_label;
  ok_label: string = environment.ok_label;

  get isLoggedIn(): boolean {
    return this._authenticationService.isLoggedIn;
  }

  constructor(private _authenticationService:AuthenticationService) { }

  ngOnInit(): void {
  }

  edit() {
    this.isUpdatable = true;
  }

  confirm(action: string) {
    this.isUpdatable = false;
    this.valueChange.emit(this.value); // I made value property two one way bindings
    this.actionEvent.emit(action + "|" + this.label);
  }
}
