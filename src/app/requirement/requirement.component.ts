import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogAddScreenComponent } from '../dialog-add-screen/dialog-add-screen.component';

@Component({
  selector: 'app-requirement',
  templateUrl: './requirement.component.html',
  styleUrls: ['./requirement.component.sass']
})
export class RequirementComponent implements OnInit {

  brData = null;
  preBRData = null;
  frData = null;
  preFRData = null;
  frScreenData = null;
  preFRScreenData = null;
  screenData = null;
  preScreenData = null;

  brPlusData = null;
  
  preMergeData = null;
  mergeData = null;

  listBRSelect = null;
  //listFRDropdown = {};
  listFRDropdown = [];

  //notSetFirst = false;

  timeoutBRID = null;
  timeoutFRID = null;

  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.afs.collection('BR').valueChanges().subscribe(resBR=>{
      if(this.preBRData==null){
        this.preBRData = resBR;
      }
      this.brData = resBR;
      this.getPlusMaxBRID();
      this.mergeValue();
      /*
      if(this.notSetFirst){
        this.setListFR();
      }
      */
    });
    this.afs.collection('FR').valueChanges().subscribe(resFR=>{
      if(this.preFRData==null){
        this.preFRData = resFR;
      }
      this.frData = resFR;
      this.mergeValue();
      /*
      if(this.notSetFirst){
        this.setListFR();
      }
      */
    });
    this.afs.collection('FR_Screen').valueChanges().subscribe(resFRScreen=>{
      if(this.preFRScreenData==null){
        this.preFRScreenData = resFRScreen;
      }
      this.frScreenData = resFRScreen;
      this.mergeValue();
    });
    this.afs.collection('Screen').valueChanges().subscribe(resScreen=>{
      if(this.preScreenData==null){
        this.preScreenData = resScreen;
      }
      this.screenData = resScreen;
      this.mergeValue();
    });
    /*
    this.afs.collection('BR').snapshotChanges()
    .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const idBR = a.payload.doc.id;
        return { idBR, ...data };
      }))
    ).subscribe(resBR=>{
      if(this.preBRData==null){
        this.preBRData = resBR;
      }
      this.brData = resBR;
      this.getPlusMaxBRID();
      this.mergeValue();
    });
    this.afs.collection('Req').snapshotChanges()
    .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const idReq = a.payload.doc.id;
        return { idReq, ...data };
      }))
    ).subscribe(resReq=>{
      if(this.preReqScreenData==null){
        this.preReqScreenData = resReq;
      }
      this.reqData = resReq;
      this.mergeValue();
    });
    this.afs.collection('Req_Screen').snapshotChanges()
    .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const idReqScreen = a.payload.doc.id;
        return { idReqScreen, ...data };
      }))
    ).subscribe(resReqScreen=>{
      if(this.preReqScreenData==null){
        this.preReqScreenData = resReqScreen;
      }
      this.reqScreenData = resReqScreen;
      this.mergeValue();
    });
    this.afs.collection('Screen').snapshotChanges()
    .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const idScreen = a.payload.doc.id;
        return { idScreen, ...data };
      }))
    ).subscribe(resScreen=>{
      if(this.preScreenData==null){
        this.preScreenData = resScreen;
      }
      this.screenData = resScreen;
      this.mergeValue();
    });
    */
  }

  setListFR(){
    for(let i = 0; i<this.mergeData.length; i++){
      if(this.mergeData[i].BRID!=""&&this.mergeData[i].FRID==""){
        
        let notFound = true;
        for(let j = 0; j<this.listFRDropdown.length ; j++){
          if(this.listFRDropdown[j].keyBR==this.mergeData[i].idBR){

            let listFRofCurBR = [];
            for(let k = 0; k<this.mergeData.length; k++){
              if(this.mergeData[k].BRID==this.mergeData[i].BRID){
                listFRofCurBR.push(this.mergeData[k].FRID);
              }
            }
            let valFR = "";
            if(listFRofCurBR.length==0){
              valFR = "1";
            }else{
              valFR = Math.max.apply(null,listFRofCurBR)+1;
            }

            this.listFRDropdown[j].FRdropdown = valFR;
            notFound = false;
            break;
            
          }
        }
        
        /*
        if(this.listFRDropdown.hasOwnProperty(this.mergeData[i].idBR)){
          let listFRofCurBR = [];
          for(let k = 0; k<this.mergeData.length; k++){
            if(this.mergeData[k].BRID==this.mergeData[i].BRID){
              listFRofCurBR.push(this.mergeData[k].FRID);
            }
          }
          let valFR = "";
          if(listFRofCurBR.length==0){
            valFR = "1";
          }else{
            valFR = Math.max.apply(null,listFRofCurBR)+1;
          }
          this.listFRDropdown[this.mergeData[i].idBR]["FRdropdown"] = valFR;
        }else{
          let listFRofCurBR = [];
          for(let k = 0; k<this.mergeData.length; k++){
            if(this.mergeData[k].BRID==this.mergeData[i].BRID){
              listFRofCurBR.push(this.mergeData[k].FRID);
            }
          }
          let valFR = "";
          if(listFRofCurBR.length==0){
            valFR = "1";
          }else{
            valFR = Math.max.apply(null,listFRofCurBR)+1;
          }
          this.listFRDropdown[this.mergeData[i].idBR] = {
            keyBR : this.mergeData[i].idBR,
            keyFR : this.mergeData[i].idFR,
            FRdropdown : valFR
          };
        }
        */

        
        if(notFound==true){
          let listFRofCurBR = [];
          for(let k = 0; k<this.mergeData.length; k++){
            if(this.mergeData[k].BRID==this.mergeData[i].BRID){
              listFRofCurBR.push(this.mergeData[k].FRID);
            }
          }
          let valFR = "";
          if(listFRofCurBR.length==0){
            valFR = "1";
          }else{
            valFR = Math.max.apply(null,listFRofCurBR)+1;
          }

          this.listFRDropdown.push({
            keyBR: this.mergeData[i].idBR ,
            FRdropdown: valFR
          });
          
        }
        

      }
      /*else if(this.mergeData[i].BRID==""&&this.mergeData[i].FRID==""){
        this.listFRDropdown[this.mergeData[i].idBR] = {
          keyBR : this.mergeData[i].idBR,
          keyFR : this.mergeData[i].idFR,
          FRdropdown: ""
        };
      }
      */
    }
    console.log(this.listFRDropdown);
  }

  addRow(){
    /*
        const idBR = this.afs.createId();
        const brRef: AngularFirestoreDocument<any> = this.afs.doc('BR/'+idBR);
        const brAddData = {
          BRID: "",
          BRDes: "",
          idBR: idBR
        };
        brRef.set(brAddData, {
          merge: true
        });
    */
        const idFR = this.afs.createId();
        const frRef: AngularFirestoreDocument<any> = this.afs.doc('FR/'+idFR);
        const frAddData = {
          FRID: "",
          FRDes: "",
          idBR: "",
          idFR: idFR
        };
        frRef.set(frAddData, {
          merge: true
        });
  }

  getPlusMaxBRID(){
    var listBRID = [];
    for(let j=0; j<this.brData.length; j++){
      if(this.brData[j].BRID!=""){
        listBRID.push(this.brData[j].BRID);
      }
    }
    if(listBRID.length!=0){
      this.brPlusData = Math.max.apply(null,listBRID)+1;
    }else{
      this.brPlusData = 1;
    }
    var setListBRID = new Set(listBRID);
    this.listBRSelect = Array.from(setListBRID);
    this.listBRSelect = this.listBRSelect.sort();
  }

  buildData(){
    var dataMerge = this.frData;
    for(let i=0; i<this.frData.length; i++){
      var listScreen = [];
      dataMerge[i].BRID = "";
      dataMerge[i].BRDes = "";
      for(let j=0; j<this.brData.length; j++){
        if(dataMerge[i].idBR==this.brData[j].idBR){
          dataMerge[i].BRID = this.brData[j].BRID;
          dataMerge[i].BRDes = this.brData[j].BRDes;
        }
      }
      for(let k=0; k<this.frScreenData.length; k++){
        if(dataMerge[i].idFR==this.frScreenData[k].idFR){
          for(let l=0; l<this.screenData.length; l++){
            if(this.screenData[l].idScreen==this.frScreenData[k].idScreen){
              listScreen.push({
                idScreen:this.screenData[l].idScreen,
                ScreenID:this.screenData[l].ScreenID
              });
              listScreen.sort(this.compareScreenData);
              break;
            }
          }
        }
      }
      dataMerge[i].ListScreen = listScreen.reverse();
    }
    return dataMerge.sort(this.compareReqData);
  }

  mergeValue(){
    if(this.brData!==null&&this.frData!==null&&this.frScreenData!==null&&this.screenData!==null){
      /*
      if(this.mergeData==null){
        this.mergeData = this.buildData();
      }else{
        var curData = this.buildData();
        this.updateValue(curData,this.preMergeData);
      }
      this.preMergeData = this.mergeData;
      */
      this.mergeData = this.buildData();
      console.log(this.mergeData);
    }
  }

  updateValue(curData:any,preData:any){
    if(curData.length>preData.length){

    }else if(curData.length<preData.length){

    }else if(curData.length==preData.length){
      for(let i = 0 ; i<curData.length ; i++){
        if(curData[i].idBR==preData[i].idBR){
          if(curData[i].BRDes !== preData[i].BRDes){
            this.mergeData[i].BRDes = curData[i].BRDes;
          }
          if(curData[i].FRDes !== preData[i].FRDes){
            this.mergeData[i].FRDes = curData[i].FRDes;
          }
        }
      }
    }
  }

  showAddScreen(idFR,BRID,FRID){
    this.dialog.open(DialogAddScreenComponent,{
      data: {
              idFR : idFR ,
              BRID : BRID ,
              FRID : FRID
            },
      autoFocus: true,
      width: "60%",
      height: "auto",
    });
  }

  selectBR(selectBRKey:string,selectBRVal:string,selectFRKey:string){
    if(selectBRVal!=""){
      var valFR = (this.getValFR(selectBRVal)).toString();
      if(this.brPlusData==selectBRVal){
        const idBR = this.afs.createId();
        const brRef: AngularFirestoreDocument<any> = this.afs.doc('BR/'+idBR);
        const brAddData = {
          BRID: selectBRVal,
          BRDes: "",
          idBR: idBR
        };
        brRef.set(brAddData, {
          merge: true
        });
        this.afs.doc('FR/'+selectFRKey).update({idBR:idBR});
      }else{
        var idOldBR = this.getIDBR(selectBRVal);
        //this.afs.doc('BR/'+selectBRKey).update({BRID:selectBRVal});
        this.afs.doc('FR/'+selectFRKey).update({idBR:idOldBR});
      }
      this.afs.doc('FR/'+selectFRKey).update({FRID:valFR});
    }
  }

  getIDBR(selectBRVal:string){
    for(let i=0; i<this.brData.length; i++){
      if(this.brData[i].BRID == selectBRVal){
        return this.brData[i].idBR;
      }
    }
  }

  getValFR(selectBRVal:string){
    if(this.brPlusData==selectBRVal){
      return "1";
    }
    let listFRofSelectBR = [];
    for(let i = 0; i<this.mergeData.length; i++){
      if(this.mergeData[i].BRID==selectBRVal){
        listFRofSelectBR.push(this.mergeData[i].FRID);
      }
    }
    return Math.max.apply(null,listFRofSelectBR)+1;
  }

  /*
  selectFR(selectFRKey:string,selectFRVal:string){
    if(selectFRKey!=""){
      this.afs.doc('FR/'+selectFRKey).update({FRID:selectFRVal});
    }
  }
  */

  compareBRIDData(a,b) {
    if (a.BRID < b.BRID){
      return 1;
    }
    if (a.BRID > b.BRID){
      return -1;
    }
    return 0;
  }

  compareScreenData(a,b) {
    if (a.ScreenID < b.ScreenID){
      return 1;
    }
    if (a.ScreenID > b.ScreenID){
      return -1;
    }
    return 0;
  }

  compareReqData(a,b){
    let i = 0;
    let result = 0;
    let sortBy = [{
      prop:'BRID',
      direction: 1
    },{
      prop:'FRID',
      direction: 1
    }];
    while(i < sortBy.length && result === 0) {
      result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() === "" ? 1 : b[ sortBy[i].prop ].toString() === "" ? -1 : a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      //result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      i++;
    }
    return result;
  }

  saveBRDes(selectIDBR:string,selectBRDesVal:string){
    var thisafs = this;
    clearTimeout(this.timeoutBRID);
    this.timeoutBRID = setTimeout(function(){
      thisafs.afs.doc('BR/'+selectIDBR).update({BRDes:selectBRDesVal});
      clearTimeout(this.timeoutBRID);
      this.timeoutBRID=null;
    }, 800);
  }

  saveFRDes(selectIDFR:string,selectFRDesVal:string){
    var thisafs = this;
    clearTimeout(this.timeoutFRID);
    this.timeoutFRID = setTimeout(function(){
      thisafs.afs.doc('FR/'+selectIDFR).update({FRDes:selectFRDesVal});
      clearTimeout(this.timeoutFRID);
      this.timeoutFRID=null;
    }, 800);
  }

}
