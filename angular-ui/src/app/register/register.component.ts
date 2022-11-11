import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UserDataService } from '../user-data.service';

export class User {
  #_id!:string;
  #name!: string;
  #username!: string;
  #password!: string;
  #confirmPassword!: string;

  get _id(): string {
    return this.#_id;
  }

  constructor(name:string,username:string,password:string,confirmPassword:string){
    this.#name = name;
    this.#username = username;
    this.#password = password;
    this.#confirmPassword = confirmPassword;
  }

  ToJson(){
    return {
      name: this.#name,
      username: this.#username,
      password: this.#password
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registrationForm!:FormGroup;

  constructor(private _formBuilder: FormBuilder, private _userService:UserDataService) {}

  ngOnInit(): void {
    this.initializeForm();
    // this.registrationForm = new FormGroup({
    //   name: new FormControl(),
    //   userName: new FormControl(),
    //   password: new FormControl(),
    //   confirmPassword: new FormControl()
    // })
  }

  onSubmit(){
    const user = new User(this.registrationForm.controls['name'].value, 
                          this.registrationForm.controls['userName'].value, 
                          this.registrationForm.controls['password'].value,
                          this.registrationForm.controls['confirmPassword'].value);

    this._userService.createUser(user).subscribe(user => {
      if(user._id)
        this.initializeForm();
    });
  }

  initializeForm(){
    this.registrationForm = this._formBuilder.group({
      name: "",
      userName: "",
      password: "",
      confirmPassword: ""
    })
  }
}
