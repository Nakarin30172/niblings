import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { columnSelectionBegin } from '@syncfusion/ej2-angular-grids';
// import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-defect1_datail',
  templateUrl: './defect1-detail.component.html',
  styleUrls: ['./defect1-detail.component.sass']
})
export class Defect1DetailComponent implements OnInit {

  constructor(
    // @Inject() public data: any,
    private afs: AngularFirestore,
    private formBuilder: FormBuilder,

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
  data=null;
  addDefectForm;
  timeoutDefER=null
  DefPlusData = null;
  listDefectSelect = null;
  timeoutDefDes = null;
  te_defData = null;
  dfData = null;
  userData = null;
  dfPlusData=null;
  a=null;

  timeoutDefTitle=null;
  timeoutDefcom=null;

  ngOnInit() {
    this.afs.collection('TE_Defect').valueChanges().subscribe(resTE_DF=>{
      this.te_defData = resTE_DF;
    });
    this.afs.collection('Defect').valueChanges().subscribe(resDF=>{
      this.dfData = resDF;
      console.log(this.dfData)
      // this.getPlusDefectID();
      // this.checkUpdate();
    });
    this.afs.collection('User').valueChanges().subscribe(resUser=>{
      this.userData = resUser;
    });

    // console.log(this.a.keys(this.dfData));
    // this.dfData = this.a.sortBy(this.dfData, function(avatar) {return avatar.userInfo.buddy_name.toLowerCase();});
    // console.log(this.a.keys(this.dfData));
  }
  // Colleections.sort(dfData);

  saveDefDes(selectIDDEF:string,selectDefDesVal:string){
    var thisafs = this;
    clearTimeout(this.timeoutDefDes);
    this.timeoutDefDes = setTimeout(function(){
      thisafs.afs.doc('Defect/'+selectIDDEF).update({DefDes:selectDefDesVal});
      clearTimeout(this.timeoutDefDes);
      this.timeoutDefDes=null;
    }, 800);
  }
  saveDefTitle(selectIDDEF:string,selectDefTitleVal:string){
    var thisafs = this;
    clearTimeout(this.timeoutDefTitle);
    this.timeoutDefTitle = setTimeout(function(){
      thisafs.afs.doc('Defect/'+selectIDDEF).update({DefTitle:selectDefTitleVal});
      clearTimeout(this.timeoutDefTitle);
      this.timeoutDefTitle=null;
    }, 800);
  }
  saveDefcom(selectIDDEF:string,selectDefcomVal:string){
    var thisafs = this;
    clearTimeout(this.timeoutDefcom);
    this.timeoutDefcom = setTimeout(function(){
      thisafs.afs.doc('Defect/'+selectIDDEF).update({Defcom:selectDefcomVal});
      clearTimeout(this.timeoutDefcom);
      this.timeoutDefcom=null;
    }, 800);
  }
  saveDefER(selectIDDEF:string,selectDefERVal:string){
    var thisafs = this;
    clearTimeout(this.timeoutDefER);
    this.timeoutDefER = setTimeout(function(){
      thisafs.afs.doc('Defect/'+selectIDDEF).update({DefE_Result:selectDefERVal});
      clearTimeout(this.timeoutDefER);
      this.timeoutDefER=null;
    }, 800);
  }

  selectDF(selectIDDef:string,selectValDefID:string){
    if(selectIDDef!=""){
      if(selectValDefID==this.dfPlusData){
        this.afs.doc('Defect/'+selectIDDef).update({DefID:selectValDefID});
        this.updateDateAndUser(selectIDDef);
      }else{
        for(let i=0; i<this.dfData.length; i++){
          if(selectValDefID==this.dfData[i].DefID){
            const idTEDef = this.afs.createId();
            const tedefRef: AngularFirestoreDocument<any> = this.afs.doc('TE_Defect/'+idTEDef);
            const tedefAddData = {
              idTE: this.data.idTE,
              idDef: this.dfData[i].idDef
            };
            tedefRef.set(tedefAddData, {
              merge: true
            });
            if(this.dfData[i].DefStatus!="0"){
              this.afs.doc('Defect/'+this.dfData[i].idDef).update({DefStatus:"2"});
              this.updateDateAndUser(this.dfData[i].idDef);
            }
            this.afs.collection("Defect/").doc(selectIDDef).delete();
            break;
          }
        }
      }
    }
  }

  selectStatus(selectIDDef:string,selectStatusVal:string){
    this.afs.doc('Defect/'+selectIDDef).update({DefStatus:selectStatusVal});
    this.updateDateAndUser(selectIDDef);
    console.log(selectStatusVal)
  }

  selectIncident(selectIDDef:string,selectIncidentVal:string){
    if(selectIncidentVal!=""){
      this.afs.doc('Defect/'+selectIDDef).update({DefIncidentby:selectIncidentVal});
      this.updateDateAndUser(selectIDDef);
    }
  }
  selectType(selectIDDef:string,selectTypeVal:string){
    this.afs.doc('Defect/'+selectIDDef).update({DefType:selectTypeVal});
    this.updateDateAndUser(selectIDDef);
    console.log(selectTypeVal)
  }
  selectSource(selectIDDef:string,selectSourceVal:string){
    this.afs.doc('Defect/'+selectIDDef).update({DefSource:selectSourceVal});
    this.updateDateAndUser(selectIDDef);
  }
  selectServerity(selectIDDef:string,selectServeritysVal:string){
    this.afs.doc('Defect/'+selectIDDef).update({DefServerity:selectServeritysVal});
    this.updateDateAndUser(selectIDDef);
  }

  selectAssignto(selectIDDef:string,selectAssignVal:string){
    if(selectAssignVal!=""){
      this.afs.doc('Defect/'+selectIDDef).update({DefAssignto:selectAssignVal});
      this.updateDateAndUser(selectIDDef);
    }
  }
  updateDateAndUser(selectIDDef:string){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0');
    let yyyy = today.getFullYear();
    let todayFormat = yyyy + '-' + mm + '-' + dd;
    const user = JSON.parse(localStorage.getItem('user'));
    this.afs.doc('Defect/'+selectIDDef).update({DefUpdatedate:todayFormat});
    this.afs.doc('Defect/'+selectIDDef).update({DefUpdateby:user.idU});
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
  myFunction1() {
    var x = document.getElementById("myDIV1");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }
  myFunction2() {
    var x = document.getElementById("myDIV2");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
    }
  }  
  myFunction3() {
    var x = document.getElementById("myDIV3");
    if (x.style.display === "none") {
      x.style.display = "block";
    } else {
      x.style.display = "none";
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
  //     }
  //   }
  // }

  // save(defAddData){
  //   let statusNum;
  //   if(defAddData.valStatusDef=="Open"){
  //     statusNum = "0";
  //   }else{
  //     statusNum = "2";
  //   }
  //   let today = new Date();
  //   let dd = String(today.getDate()).padStart(2, '0');
  //   let mm = String(today.getMonth() + 1).padStart(2, '0');
  //   let yyyy = today.getFullYear();
  //   let todayFormat = dd + '/' + mm + '/' + yyyy;
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   const idDef = this.afs.createId();
  //   const defRef: AngularFirestoreDocument<any> = this.afs.doc('Defect/'+idDef);
  //   const dfAddData = {
  //     idDef: idDef,
  //     DefID: defAddData.valDefectID,
  //     DefDes: defAddData.valDefDes,
  //     DefE_Result: defAddData.valDefExpR,
  //     DefStatus: statusNum,
  //     DefIncidentby: defAddData.valDefectIncidentBy,
  //     DefAssignto: defAddData.valDefectAssignTo,
  //     DefUpdatedate: todayFormat,
  //     DefUpdateby: user.idU
  //   };
  //   defRef.set(dfAddData, {
  //     merge: true
  //   });
  //   const idTEDef = this.afs.createId();
  //   const tedefRef: AngularFirestoreDocument<any> = this.afs.doc('TE_Defect/'+idTEDef);
  //   const tedefAddData = {
  //     idTE: this.data.idTE,
  //     idDef: idDef
  //   };
  //   tedefRef.set(tedefAddData, {
  //     merge: true
  //   });
  //   this.dialogRef.close();
  // }

  // close(){
  //   this.dialogRef.close();
  // }


    }}}}