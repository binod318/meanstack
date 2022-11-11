import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationForm!:FormGroup;

  constructor(private _formBuilder: FormBuilder) {
    this.registrationForm = this._formBuilder.group({
      name: "A",
      userName: "",
      password: "",
      confirmPassword: ""
    })
  }

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl("B"),
      userName: new FormControl(),
      password: new FormControl(),
      confirmPassword: new FormControl()
    })
  }

  onSubmit(form: FormGroup){
    console.log(form);
    //this.registrationForm.controls['name'].setValue("newVal");
  }
}
