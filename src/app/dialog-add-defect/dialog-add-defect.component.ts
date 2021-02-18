import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-defect',
  templateUrl: './dialog-add-defect.component.html',
  styleUrls: ['./dialog-add-defect.component.sass']
})
export class DialogAddDefectComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogAddDefectComponent>
  ) {
    this.addDefectForm = this.formBuilder.group({
      valDefectID: [''],
      valDefDes: [''],
      valDefExpR: [''],
      valStatusDef: ['Open'],
      valDefectIncidentBy: [''],
      valDefectAssignTo: ['']
    });
  }

  addDefectForm;

  DefPlusData = null;
  listDefectSelect = null;

  te_defData = null;
  dfData = null;
  userData = null;

  ngOnInit() {
    this.afs.collection('TE_Defect').valueChanges().subscribe(resTE_DF=>{
      this.te_defData = resTE_DF;
    });
    this.afs.collection('Defect').valueChanges().subscribe(resDF=>{
      this.dfData = resDF;
      this.getPlusDefectID();
      this.checkUpdate();
    });
    this.afs.collection('User').valueChanges().subscribe(resUser=>{
      this.userData = resUser;
    });
  }

  selectDef(selectDefVal){
    if(selectDefVal!=0){
      for(let i=0;i<this.dfData.length;i++){
        if(this.dfData[i].DefID==selectDefVal){
          this.addDefectForm.controls['valDefDes'].setValue(this.dfData[i].DefDes);
          this.addDefectForm.controls['valDefExpR'].setValue(this.dfData[i].DefE_Result);
          if(this.dfData[i].DefStatus=="1"||this.dfData[i].DefStatus=="2"||this.dfData[i].DefStatus=="3"){
            this.addDefectForm.controls['valStatusDef'].setValue('Reject from test');
          }else{
            this.addDefectForm.controls['valStatusDef'].setValue('Open');
          }
          this.addDefectForm.controls['valDefectIncidentBy'].setValue(this.dfData[i].DefIncidentby);
          this.addDefectForm.controls['valDefectAssignTo'].setValue(this.dfData[i].DefAssignto);
          break;
        }
      }
    }
  }

  getPlusDefectID(){
    var listDFID = [];
    for(let j=0; j<this.dfData.length; j++){
      if(this.dfData[j].DefID!=""){
        listDFID.push(this.dfData[j].DefID);
      }
    }
    if(listDFID.length==0){
      this.DefPlusData = 1;
    }else{
      this.DefPlusData = Math.max.apply(null,listDFID)+1;
      var setListDFID = new Set(listDFID);
      this.listDefectSelect = Array.from(setListDFID);
      this.listDefectSelect = this.listDefectSelect.sort();
    }
  }

  checkUpdate(){
    for(let i=0; i<this.dfData.length; i++){
      if(this.dfData[i].DefID==this.addDefectForm.controls['valDefectID'].value){
        if(this.addDefectForm.controls['valDefDes'].value!=this.dfData[i].DefDes){
          this.addDefectForm.controls['valDefDes'].setValue(this.dfData[i].DefDes);
        }
        if(this.addDefectForm.controls['valDefExpR'].value!=this.dfData[i].DefE_Result){
          this.addDefectForm.controls['valDefExpR'].setValue(this.dfData[i].DefE_Result);
        }
        if(this.addDefectForm.controls['valStatusDef'].value!=this.dfData[i].DefStatus){
          if(this.dfData[i].DefStatus==1||this.dfData[i].DefStatus==2||this.dfData[i].DefStatus==3){
            this.addDefectForm.controls['valStatusDef'].setValue('Reject from test');
          }else{
            this.addDefectForm.controls['valStatusDef'].setValue('Open');
          }
        }
        /*
        if(this.addDefectForm.controls['valDefectAssignTo'].value!=this.dfData[i].DefAssignto){
          this.addDefectForm.controls['valDefectAssignTo'].setValue(this.dfData[i].DefAssignto);
        }
        */
      }
    }
  }

  save(defAddData){
    let statusNum;
    if(defAddData.valStatusDef=="Open"){
      statusNum = "0";
    }else{
      statusNum = "2";
    }
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let todayFormat = dd + '/' + mm + '/' + yyyy;
    const user = JSON.parse(localStorage.getItem('user'));
    const idDef = this.afs.createId();
    const defRef: AngularFirestoreDocument<any> = this.afs.doc('Defect/'+idDef);
    const dfAddData = {
      idDef: idDef,
      DefID: defAddData.valDefectID,
      DefDes: defAddData.valDefDes,
      DefE_Result: defAddData.valDefExpR,
      DefStatus: statusNum,
      DefIncidentby: defAddData.valDefectIncidentBy,
      DefAssignto: defAddData.valDefectAssignTo,
      DefUpdatedate: todayFormat,
      DefUpdateby: user.idU
    };
    defRef.set(dfAddData, {
      merge: true
    });
    const idTEDef = this.afs.createId();
    const tedefRef: AngularFirestoreDocument<any> = this.afs.doc('TE_Defect/'+idTEDef);
    const tedefAddData = {
      idTE: this.data.idTE,
      idDef: idDef
    };
    tedefRef.set(tedefAddData, {
      merge: true
    });
    this.dialogRef.close();
  }

  close(){
    this.dialogRef.close();
  }

}
