import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-defect',
  templateUrl: './dialog-view-defect.component.html',
  styleUrls: ['./dialog-view-defect.component.sass']
})
export class DialogViewDefectComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogViewDefectComponent>
  ) {
    this.viewDefectForm = this.formBuilder.group({
      valDefectID: [''],
      valDefDes: [''],
      valDefExpR: [''],
      valStatusDef: [''],
      valDefectIncidentBy: [''],
      valDefectIncidentByShow: [''],
      valDefectAssignTo: [''],
      valDefectUpdateDate: [''],
      valDefectUpdateBy: [''],
      valDefectUpdateByShow: ['']
    });
   }

  viewDefectForm;
  
  dfData = null;
  userData = null

  ngOnInit() {
    this.afs.collection('User').valueChanges().subscribe(resUser=>{
      this.userData = resUser;
      this.checkUpdate();
    });
    this.afs.collection('Defect').valueChanges().subscribe(resDF=>{
      this.dfData = resDF;
      this.checkUpdate();
    });
    
  }

  checkUpdate(){
    if(this.dfData!=null && this.userData!=null){
      for(let i=0; i<this.dfData.length; i++){
        if(this.dfData[i].idDef==this.data.idDef){
          if(this.viewDefectForm.controls['valDefectID'].value!=this.dfData[i].DefID){
            this.viewDefectForm.controls['valDefectID'].setValue("DF_000"+this.dfData[i].DefID);
          }
          if(this.viewDefectForm.controls['valDefDes'].value!=this.dfData[i].DefDes){
            this.viewDefectForm.controls['valDefDes'].setValue(this.dfData[i].DefDes);
          }
          if(this.viewDefectForm.controls['valDefExpR'].value!=this.dfData[i].DefE_Result){
            this.viewDefectForm.controls['valDefExpR'].setValue(this.dfData[i].DefE_Result);
          }
          if(this.viewDefectForm.controls['valStatusDef'].value!=this.dfData[i].DefStatus){
            this.viewDefectForm.controls['valStatusDef'].setValue(this.dfData[i].DefStatus);
          }
          if(this.viewDefectForm.controls['valDefectIncidentBy'].value!=this.dfData[i].DefIncidentby){
            this.viewDefectForm.controls['valDefectIncidentBy'].setValue(this.dfData[i].DefIncidentby);
            for(let i=0; i<this.userData.length; i++){
              if(this.dfData[i].DefIncidentby==this.userData[i].idU){
                this.viewDefectForm.controls['valDefectIncidentByShow'].setValue(this.userData[i].UName);
                break;
              }
            }
          }
          if(this.viewDefectForm.controls['valDefectAssignTo'].value!=this.dfData[i].DefAssignto){
            this.viewDefectForm.controls['valDefectAssignTo'].setValue(this.dfData[i].DefAssignto);
          }
          if(this.viewDefectForm.controls['valDefectUpdateDate'].value!=this.dfData[i].DefUpdatedate){
            this.viewDefectForm.controls['valDefectUpdateDate'].setValue(this.dfData[i].DefUpdatedate);
          }
          if(this.viewDefectForm.controls['valDefectUpdateBy'].value!=this.dfData[i].DefUpdateby){
            this.viewDefectForm.controls['valDefectUpdateBy'].setValue(this.dfData[i].DefUpdateby);
            for(let i=0; i<this.userData.length; i++){
              if(this.dfData[i].DefIncidentby==this.userData[i].idU){
                this.viewDefectForm.controls['valDefectUpdateByShow'].setValue(this.userData[i].UName);
                break;
              }
            }
          }
        }
      }
    }
  }

  close(){
    this.dialogRef.close();
  }

  save(defUpdateData){
    console.log(defUpdateData);
    for(let i=0; i<this.dfData.length; i++){
      if(this.dfData[i].idDef==this.data.idDef){
        if(defUpdateData.valDefDes!=this.dfData[i].DefDes){
          this.afs.doc('Defect/'+this.data.idDef).update({DefDes: defUpdateData.valDefDes});
        }
        if(defUpdateData.valDefExpR!=this.dfData[i].DefE_Result){
          this.afs.doc('Defect/'+this.data.idDef).update({DefE_Result: defUpdateData.valDefExpR});
        }
        if(defUpdateData.valStatusDef!=this.dfData[i].DefStatus){
          this.afs.doc('Defect/'+this.data.idDef).update({DefStatus: defUpdateData.valStatusDef});
        }
        if(defUpdateData.valDefectAssignTo!=this.dfData[i].DefAssignto){
          this.afs.doc('Defect/'+this.data.idDef).update({DefAssignto: defUpdateData.valDefectAssignTo});
        }
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = today.getFullYear();
        let todayFormat = dd + '/' + mm + '/' + yyyy;
        const user = JSON.parse(localStorage.getItem('user'));
        this.afs.doc('Defect/'+this.data.idDef).update({
          DefUpdatedate: todayFormat,
          DefUpdateby: user.idU
        });
        alert("Update Success!!!");
        break;
      }
    }
    this.dialogRef.close();
  }

}
