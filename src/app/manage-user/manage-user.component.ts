import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.sass']
})
export class ManageUserComponent implements OnInit {

  detailUsers;

  constructor(
    private afs: AngularFirestore
  ) 
  {
    /*
    this.afs.collection('users').valueChanges().subscribe(resListUser =>{
      this.detailUsers = resListUser;
      console.log(resListUser);
    });
    */
    this.afs.collection('User').valueChanges().subscribe(resListUser =>{
      this.detailUsers = resListUser;
      console.log(resListUser);
    });
  }

  ngOnInit() {
  }

}
