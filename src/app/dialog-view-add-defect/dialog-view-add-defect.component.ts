import { Component, OnInit ,Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-view-add-defect',
  templateUrl: './dialog-view-add-defect.component.html',
  styleUrls: ['./dialog-view-add-defect.component.sass']
})
export class DialogViewAddDefectComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afs: AngularFirestore,
    private dialogRef: MatDialogRef<DialogViewAddDefectComponent>
  ) { }

  dfData = null;
  userData = null;
  mergeData = null;
  te_dData = null;

  dfPlusData = null;
  listDFSelect = [];

  timeoutDefcom = null;
  timeoutDefDes = null;
  timeoutDefER = null;
  timeoutDefTitle = null;

  ngOnInit() {
    this.afs.collection('User').valueChanges().subscribe(resUser=>{
      this.userData = resUser;
      this.mergeValue();
    });
    this.afs.collection('Defect').valueChanges().subscribe(resDF=>{
      this.dfData = resDF;
      this.mergeValue();
    });
    this.afs.collection('TE_Defect').valueChanges().subscribe(resTE_D=>{
      this.te_dData = resTE_D;
      this.mergeValue();
    });
  }

  mergeValue(){
    if(this.dfData!=null&&this.userData!=null&&this.te_dData!=null){
      this.mergeData = this.buildData();
      this.getPlusMaxDFID();
      console.log(this.mergeData);
    }
  }

  buildData(){
    var dataMerge = [];
    let listDefSelectTE = [];
    for(let i=0; i<this.te_dData.length; i++){
      if(this.te_dData[i].idTE==this.data.idTE){
        listDefSelectTE.push(this.te_dData[i].idDef);
      }
    }
    for(let k=0; k<listDefSelectTE.length; k++){
      for(let j=0; j<this.dfData.length; j++){
        if(listDefSelectTE[k]==this.dfData[j].idDef){
          dataMerge.push(this.dfData[j]);
          break;
        }
      }
    }
    return dataMerge.sort(this.compareDefID);
  }

  getPlusMaxDFID(){
    var listDFID = [];
    for(let j=0; j<this.mergeData.length; j++){
      if(this.mergeData[j].DefID!=""){
        listDFID.push(this.mergeData[j].DefID);
      }
    }
    var setListDFID = new Set(listDFID);
    var listDFinTE = Array.from(setListDFID);
    console.log(listDFinTE);
    this.filterListDF(listDFinTE);
  }

  filterListDF(listDFinTE){
    let listAllDF = [];
    for(let i=0; i<this.dfData.length; i++){
      if(this.dfData[i].DefID!=""){
        listAllDF.push(this.dfData[i].DefID);
      }
    }
    console.log(listAllDF);
    if(listAllDF.length!=0){
      this.dfPlusData = Math.max.apply(null,listAllDF)+1;
    }else{
      this.dfPlusData = 1;
    }
    for(let j=0; j<listDFinTE.length; j++){
      let index = listAllDF.indexOf(listDFinTE[j]);
      if(index >-1){
        listAllDF.splice(index,1);
      }
    }
    console.log(listAllDF);
    this.listDFSelect = listAllDF.sort();
  }

  compareDefID(a,b){
    let i = 0;
    let result = 0;
    let sortBy = [{
      prop:'DefID',
      direction: 1
    }];
    while(i < sortBy.length && result === 0) {
      result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() === "" ? 1 : b[ sortBy[i].prop ].toString() === "" ? -1 : a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      //result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      i++;
    }
    return result;
  }

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

  selectIncident(selectIDDef:string,selectIncidentVal:string){
    if(selectIncidentVal!=""){
      this.afs.doc('Defect/'+selectIDDef).update({DefIncidentby:selectIncidentVal});
      this.updateDateAndUser(selectIDDef);
    }
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

  addRow(){
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
      DefID: "",
      DefDes: "",
      DefTitle: "",
      Defcom: "",
      DefE_Result: "",
      DefStatus : "0",
      DefType : "0",
      DefSource: "0",
      DefServerity: "0",
      DefIncidentby: "",
      DefAssignto: "",
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
  }

}
