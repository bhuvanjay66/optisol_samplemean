import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../shared/api.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {

  loading:boolean
  confirmmsg: boolean=false;
  constructor(    private service: ApiService) { }

  ngOnInit() {
  }
  importFile(event) {
    debugger
    this.loading=true
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    this.service.getDetailsFromUploadedxls(formData)
    .subscribe(data => {
      debugger
      this.loading=false
      this.confirmmsg=true
      if (data.Status == 'valid') {
        
      }
      else if (data.Status == 'invalid') {
      
      }
      else {
       
      }
    });
  }

}
