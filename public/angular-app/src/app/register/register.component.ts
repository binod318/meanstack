import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { UserDataService } from '../user-data.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  hasSuccess:boolean = false;
  hasError:boolean = false;
  successMessage!:string;
  errorMessage!:string;

  registrationForm!:FormGroup;

  name_label:string = environment.name_label;
  username_label:string = environment.username_label;
  password_label:string = environment.password_label;
  confirm_label:string = environment.confirm_label;
  register_label:string = environment.register_label;
  reset_label:string = environment.reset_label;

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
    const user = new User(this.registrationForm.value.name, 
                          this.registrationForm.value.userName, 
                          this.registrationForm.value.password,
                          this.registrationForm.value.confirmPassword);

    this._userService.createUser(user).subscribe({
      next: () => {
        this.hasSuccess = true;
        this.hasError = false;
        this.successMessage = environment.user_register_success_message;
      },
      error: () => {
        this.hasSuccess = false;
        this.hasError = true;
        this.errorMessage = environment.user_register_fail_message;
      },
      complete: () => {
        setTimeout(() => {
          this.initializeForm();
        },200);
      }
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
