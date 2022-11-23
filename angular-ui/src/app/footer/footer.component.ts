import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  year!: Date;
  copyright_message:string = environment.copyright_message;

  constructor() { 
    this.year = new Date();
  }

  ngOnInit(): void {
  }

}
