import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { DialogAddDefectComponent } from '../dialog-add-defect/dialog-add-defect.component';
import { DialogViewDefectComponent } from '../dialog-view-defect/dialog-view-defect.component';
import { DialogViewAddDefectComponent } from '../dialog-view-add-defect/dialog-view-add-defect.component';
import * as _ from "lodash";
import { UploadService } from '../uploads/shared/upload.service';
import { Upload, files } from '../uploads/shared/upload';

@Component({
  selector: 'app-testcase',
  templateUrl: './testcase.component.html',
  styleUrls: ['./testcase.component.sass']
})
export class TestcaseComponent implements OnInit {
  selectedFiles: FileList;
  currentUpload: Upload;
  dataFiles: files[];
  brData = null;
  preBRData = null;
  frData = null;
  preFRData = null;
  frScreenData = null;
  preFRScreenData = null;
  screenData = null;
  preScreenData = null;
  TCData = null;
  preTCData = null;
  TSData = null;
  preTSData = null;
  TEData = null;
  preTEData = null;
  TE_DData = null;
  preTE_DData = null;
  DFData = null;
  preDFData = null;

  preMergeData = null;
  mergeData = null;

  listSCSelect = null;

  listTCSelect = null;
  tcPlusData = null;

  timeoutTCID = null;
  timeoutTCDes = null;
  timeoutTSDes = null;
  timeoutTSE_R = null;

  imgSelectScreen = null;
  valImage = null;
  isUpload = false;

  constructor(
    private afs: AngularFirestore,
    private dialog: MatDialog,
    public upSvc: UploadService
  ) { }

  ngOnInit() {
    this.getFiles();
    this.afs.collection('BR').valueChanges().subscribe(resBR => {
      if (this.preBRData == null) {
        this.preBRData = resBR;
      }
      this.brData = resBR;
      this.mergeValue();
    });
    this.afs.collection('FR').valueChanges().subscribe(resFR => {
      if (this.preFRData == null) {
        this.preFRData = resFR;
      }
      this.frData = resFR;
      this.mergeValue();
    });
    this.afs.collection('FR_Screen').valueChanges().subscribe(resFRScreen => {
      if (this.preFRScreenData == null) {
        this.preFRScreenData = resFRScreen;
      }
      this.frScreenData = resFRScreen;
      this.mergeValue();
    });
    this.afs.collection('Screen').valueChanges().subscribe(resScreen => {
      if (this.preScreenData == null) {
        this.preScreenData = resScreen;
      }
      this.screenData = resScreen;
      this.getListDropdownSC();
      this.mergeValue();
    });
    this.afs.collection('TestCase').valueChanges().subscribe(resTC => {
      if (this.preTCData == null) {
        this.preTCData = resTC;
      }
      this.TCData = resTC;
      this.getPlusMaxTCID();
      this.mergeValue();
    });
    this.afs.collection('TestScript').valueChanges().subscribe(resTS => {
      if (this.preTSData == null) {
        this.preTSData = resTS;
      }
      this.TSData = resTS;
      this.mergeValue();
    });
    this.afs.collection('TestExecution').valueChanges().subscribe(resTE => {
      if (this.preTEData == null) {
        this.preTEData = resTE;
      }
      this.TEData = resTE;
      this.mergeValue();
    });
    this.afs.collection('TE_Defect').valueChanges().subscribe(resTE_D => {
      if (this.preTE_DData == null) {
        this.preTE_DData = resTE_D;
      }
      this.TE_DData = resTE_D;
      this.mergeValue();
    });
    this.afs.collection('Defect').valueChanges().subscribe(resDF => {
      if (this.preDFData == null) {
        this.preDFData = resDF;
      }
      this.DFData = resDF;
      this.mergeValue();
    });
  }

  mergeValue() {
    if (this.brData !== null && this.frData !== null && this.frScreenData !== null && this.screenData !== null &&
      this.TCData !== null && this.TSData !== null && this.TEData !== null && this.TE_DData !== null && this.DFData !== null) {
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
      this.getListDropdownBRFR();
    }
  }

  buildData() {
    var dataMerge = this.TSData;
    for (let i = 0; i < dataMerge.length; i++) {
      for (let n = 0; n < this.TEData.length; n++) {
        if (this.TEData[n].idTS == dataMerge[i].idTS) {
          let listDF = [];
          for (let o = 0; o < this.TE_DData.length; o++) {
            if (this.TE_DData[o].idTE == this.TEData[n].idTE) {
              listDF.push(this.TE_DData[o].idDef);
            }
          }
          let listDFDetail = [];
          for (let p = 0; p < listDF.length; p++) {
            for (let q = 0; q < this.DFData.length; q++) {
              if (this.DFData[q].idDef == listDF[p]) {
                listDFDetail.push({
                  idDef: this.DFData[q].idDef,
                  DefID: this.DFData[q].DefID,
                  DefDes: this.DFData[q].DefDes,
                  DefE_Result: this.DFData[q].DefE_Result,
                  DefStatus: this.DFData[q].DefStatus,
                  DefIncidentby: this.DFData[q].DefIncidentby,
                  DefAssignto: this.DFData[q].DefAssignto,
                  DefUpdatedate: this.DFData[q].DefUpdatedate,
                  DefUpdateby: this.DFData[q].DefUpdateby
                });
              }
            }
          }
          listDFDetail = listDFDetail.sort(this.compareDefID);
          if (this.TEData[n].Cycle == "1") {
            dataMerge[i].Cycle1 = {
              idTE: this.TEData[n].idTE,
              idTS: this.TEData[n].idTS,
              TEAdatefrom: this.TEData[n].TEAdatefrom,
              TEAdateto: this.TEData[n].TEAdateto,
              TEAssignto: this.TEData[n].TEAssignto,
              TEStatus: this.TEData[n].TEStatus,
              TEPdatefrom: this.TEData[n].TEPdatefrom,
              TEPdateto: this.TEData[n].TEPdateto,
              Cycle: this.TEData[n].Cycle,
              listDFDetail: listDFDetail
            }
          } else if (this.TEData[n].Cycle == "2") {
            dataMerge[i].Cycle2 = {
              idTE: this.TEData[n].idTE,
              idTS: this.TEData[n].idTS,
              TEAdatefrom: this.TEData[n].TEAdatefrom,
              TEAdateto: this.TEData[n].TEAdateto,
              TEAssignto: this.TEData[n].TEAssignto,
              TEStatus: this.TEData[n].TEStatus,
              TEPdatefrom: this.TEData[n].TEPdatefrom,
              TEPdateto: this.TEData[n].TEPdateto,
              Cycle: this.TEData[n].Cycle,
              listDFDetail: listDFDetail
            }
          } else if (this.TEData[n].Cycle == "3") {
            dataMerge[i].Cycle3 = {
              idTE: this.TEData[n].idTE,
              idTS: this.TEData[n].idTS,
              TEAdatefrom: this.TEData[n].TEAdatefrom,
              TEAdateto: this.TEData[n].TEAdateto,
              TEAssignto: this.TEData[n].TEAssignto,
              TEStatus: this.TEData[n].TEStatus,
              TEPdatefrom: this.TEData[n].TEPdatefrom,
              TEPdateto: this.TEData[n].TEPdateto,
              Cycle: this.TEData[n].Cycle,
              listDFDetail: listDFDetail
            }
          }
        }
      }

      for (let j = 0; j < this.TCData.length; j++) {
        if (dataMerge[i].idTC == this.TCData[j].idTC) {
          dataMerge[i].idFR = this.TCData[j].idFR;
          dataMerge[i].idScreen = this.TCData[j].idScreen;
          dataMerge[i].TCID = this.TCData[j].TCID;
          dataMerge[i].TCDes = this.TCData[j].TCDes;

          dataMerge[i].ScreenID = "";
          dataMerge[i].FRID = "";
          dataMerge[i].BRID = "";

          for (let m = 0; m < this.screenData.length; m++) {
            if (this.screenData[m].idScreen == dataMerge[i].idScreen) {
              dataMerge[i].ScreenID = this.screenData[m].ScreenID;
              for (let k = 0; k < this.frData.length; k++) {
                if (dataMerge[i].idFR == this.frData[k].idFR) {
                  dataMerge[i].FRID = this.frData[k].FRID;
                  for (let l = 0; l < this.brData.length; l++) {
                    if (this.brData[l].idBR == this.frData[k].idBR) {
                      dataMerge[i].idBR = this.brData[l].idBR;
                      dataMerge[i].BRID = this.brData[l].BRID;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return dataMerge.sort(this.compareAllData);
    /*
    var dataMerge = this.TCData;
    for(let i=0; i<this.TCData.length; i++){
      for(let j=0; j<this.frData.length; j++){
        if(this.TCData[i].idFR==this.frData[j].idFR){
          dataMerge[i].FRID = this.frData[j].FRID;
          for(let k=0; k<this.brData.length; k++){
            if(this.brData[k].idBR==this.frData[j].idBR){
              dataMerge[i].idBR = this.brData[k].idBR;
              dataMerge[i].BRID = this.brData[k].BRID;
              for(let l=0;l<this.screenData.length; l++){
                if(this.screenData[l].idScreen==this.TCData[i].idScreen){
                  dataMerge[i].ScreenID = this.screenData[l].ScreenID;
                  for(let m=0;m<this.TSData.length; m++){
                    if(this.TSData[m].idTC==dataMerge[i].idTC){
                      dataMerge[i].idTS = this.TSData[m].idTS;
                      dataMerge[i].TSID = this.TSData[m].TSID;
                      dataMerge[i].TSDes = this.TSData[m].TSDes;
                      dataMerge[i].TSE_Result = this.TSData[m].TSE_Result;
                      dataMerge[i].TSPdatefrom = this.TSData[m].TSPdatefrom;
                      dataMerge[i].TSPdateto = this.TSData[m].TSPdateto;
                      for(let n=0; n<this.TEData.length; n++){
                        if(this.TEData[n].idTS==dataMerge[i].idTS){
                          let listDF = [];
                          for(let o=0;o<this.TE_DData.length;o++){
                            if(this.TE_DData[o].idTE==this.TEData[n].idTE){
                              listDF.push(this.TE_DData[o].idDef);
                            }
                          }
                          let listDFDetail = [];
                          for(let p=0;p<listDF.length;p++){
                            for(let q=0;q<this.DFData.length;q++){
                              if(this.DFData[q].idDef==listDF[p]){
                                listDFDetail.push({
                                  idDef: this.DFData[q].idDef,
                                  DefID: this.DFData[q].DefID,
                                  DefDes: this.DFData[q].DefDes,
                                  DefE_Result: this.DFData[q].DefE_Result,
                                  DefStatus: this.DFData[q].DefStatus,
                                  DefIncidentby: this.DFData[q].DefIncidentby,
                                  DefAssignto: this.DFData[q].DefAssignto,
                                  DefUpdatedate: this.DFData[q].DefUpdatedate,
                                  DefUpdateby: this.DFData[q].DefUpdateby
                                });
                              }
                            }
                          }

                          if(this.TEData[n].Cycle==1){
                            dataMerge[i].Cycle1 = {
                              idTE : this.TEData[n].idTE,
                              idTS : this.TEData[n].idTS,
                              TEAdatefrom : this.TEData[n].TEAdatefrom,
                              TEAdateto : this.TEData[n].TEAdateto,
                              TEAssignto : this.TEData[n].TEAssignto,
                              TEStatus : this.TEData[n].TEStatus,
                              Cycle : this.TEData[n].Cycle,
                              listDFDetail : listDFDetail
                            }
                          }else if(this.TEData[n].Cycle==2){
                            dataMerge[i].Cycle2 = {
                              idTE : this.TEData[n].idTE,
                              idTS : this.TEData[n].idTS,
                              TEAdatefrom : this.TEData[n].TEAdatefrom,
                              TEAdateto : this.TEData[n].TEAdateto,
                              TEAssignto : this.TEData[n].TEAssignto,
                              TEStatus : this.TEData[n].TEStatus,
                              Cycle : this.TEData[n].Cycle,
                              listDFDetail : listDFDetail
                            }
                          }else if(this.TEData[n].Cycle==3){
                            dataMerge[i].Cycle3 = {
                              idTE : this.TEData[n].idTE,
                              idTS : this.TEData[n].idTS,
                              TEAdatefrom : this.TEData[n].TEAdatefrom,
                              TEAdateto : this.TEData[n].TEAdateto,
                              TEAssignto : this.TEData[n].TEAssignto,
                              TEStatus : this.TEData[n].TEStatus,
                              Cycle : this.TEData[n].Cycle,
                              listDFDetail : listDFDetail
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return dataMerge;
    */
  }

  updateValue(curData: any, preData: any) {

  }

  viewDef(selectDefID: string) {
    this.dialog.open(DialogViewDefectComponent, {
      data: {
        idDef: selectDefID
      },
      autoFocus: true,
      width: "60%",
      height: "auto",
    });
  }

  saveTCDes(selectIDTC: string, selectTCDesVal: string) {
    var thisafs = this;
    clearTimeout(this.timeoutTCDes);
    this.timeoutTCDes = setTimeout(function () {
      thisafs.afs.doc('TestCase/' + selectIDTC).update({ TCDes: selectTCDesVal });
      clearTimeout(this.timeoutTCDes);
      this.timeoutTCDes = null;
    }, 800);
  }

  saveTSDes(selectTSKey: string, selectTSDesVal) {
    var thisafs = this;
    clearTimeout(this.timeoutTSDes);
    this.timeoutTSDes = setTimeout(function () {
      thisafs.afs.doc('TestScript/' + selectTSKey).update({ TSDes: selectTSDesVal });
      clearTimeout(this.timeoutTSDes);
      this.timeoutTSDes = null;
    }, 800);
  }

  saveTSExpResult(selectTSKey: string, selectTSExpRVal) {
    var thisafs = this;
    clearTimeout(this.timeoutTSE_R);
    this.timeoutTSE_R = setTimeout(function () {
      thisafs.afs.doc('TestScript/' + selectTSKey).update({ TSE_Result: selectTSExpRVal });
      clearTimeout(this.timeoutTSE_R);
      this.timeoutTSE_R = null;
    }, 800);
  }

  selectTC(selectTCKey: string, selectTSKey: string, selectTCVal: string) {
    if (selectTCVal != "") {
      var valTS = this.getValTS(selectTCVal).toString();
      if (selectTCVal == this.tcPlusData) {
        this.afs.doc('TestCase/' + selectTCKey).update({ TCID: selectTCVal });
      } else {
        let oldTCKey = this.getTCData(selectTCVal);
        this.afs.doc('TestScript/' + selectTSKey).update({ idTC: oldTCKey });
        this.afs.collection("TestCase/").doc(selectTCKey).delete();
      }
      this.afs.doc('TestScript/' + selectTSKey).update({ TSID: valTS });
    }
  }

  getValTS(selectTCVal: string) {
    if (this.tcPlusData == selectTCVal) {
      return "1";
    }
    let listTSofSelectTC = [];
    for (let i = 0; i < this.mergeData.length; i++) {
      if (this.mergeData[i].TCID == selectTCVal) {
        listTSofSelectTC.push(this.mergeData[i].TSID);
      }
    }
    return Math.max.apply(null, listTSofSelectTC) + 1;
  }

  getTCData(selectTCVal: string) {
    for (let i = 0; i < this.TCData.length; i++) {
      if (this.TCData[i].TCID == selectTCVal) {
        return this.TCData[i].idTC;
      }
    }
  }

  getPlusMaxTCID() {
    var listTCID = [];
    for (let j = 0; j < this.TCData.length; j++) {
      if (this.TCData[j].TCID != "") {
        listTCID.push(this.TCData[j].TCID);
      }
    }
    if (listTCID.length != 0) {
      this.tcPlusData = Math.max.apply(null, listTCID) + 1;
    } else {
      this.tcPlusData = 1;
    }
    var setListTCID = new Set(listTCID);
    this.listTCSelect = Array.from(setListTCID);
    this.listTCSelect = this.listTCSelect.sort();
  }

  selectBRFR(valScreenidFR: any, currIDTC: any) {
    if (valScreenidFR != "") {
      for (let i = 0; i < this.mergeData.length; i++) {
        if (this.mergeData[i].idTC == currIDTC) {
          for (let j = 0; j < this.mergeData[i].listBRFR.length; j++) {
            if (this.mergeData[i].listBRFR[j].idFR == valScreenidFR) {
              this.mergeData[i].idBR = this.mergeData[i].listBRFR[j].idBR;
              this.mergeData[i].idFR = valScreenidFR;
              this.mergeData[i].BRID = this.mergeData[i].listBRFR[j].BRID;
              this.mergeData[i].FRID = this.mergeData[i].listBRFR[j].FRID;
              this.afs.doc('TestCase/' + currIDTC).update({ idFR: valScreenidFR });
              break;
            }
          }
        }
      }
    }
  }

  selectScreen(valScreenSelect: any, currIDTC: any) {
    for (let i = 0; i < this.mergeData.length; i++) {
      if (this.mergeData[i].idTC == currIDTC) {
        this.mergeData[i].ScreenID = valScreenSelect;
        for (let k = 0; k < this.screenData.length; k++) {
          if (this.screenData[k].ScreenID == valScreenSelect) {
            this.mergeData[i].idScreen = this.screenData[k].idScreen;
            this.afs.doc('TestCase/' + currIDTC).update({ idScreen: this.screenData[k].idScreen });
            break;
          }
        }
        if (this.mergeData[i].idFR == "") {
          var listFR = [];
          for (let j = 0; j < this.frScreenData.length; j++) {
            if (this.mergeData[i].idScreen == this.frScreenData[j].idScreen) {
              listFR.push(this.frScreenData[j].idFR);
            }
          }
          var listBRFR = [];
          for (let l = 0; l < this.frData.length; l++) {
            for (let p = 0; p < listFR.length; p++) {
              if (this.frData[l].idFR == listFR[p]) {
                for (let v = 0; v < this.brData.length; v++) {
                  if (this.brData[v].idBR == this.frData[l].idBR) {
                    listBRFR.push({
                      idFR: this.frData[l].idFR,
                      FRID: this.frData[l].FRID,
                      idBR: this.frData[l].idBR,
                      BRID: this.brData[v].BRID
                    });
                  }
                }
              }
            }
          }
          this.mergeData[i].listBRFR = listBRFR.sort(this.compareBRFRData);
        }
      }
    }
  }

  getListDropdownBRFR() {
    for (let i = 0; i < this.mergeData.length; i++) {
      if (this.mergeData[i].idScreen != "") {
        if (this.mergeData[i].idFR == "") {
          var listFR = [];
          for (let j = 0; j < this.frScreenData.length; j++) {
            if (this.mergeData[i].idScreen == this.frScreenData[j].idScreen) {
              listFR.push(this.frScreenData[j].idFR);
            }
          }
          var listBRFR = [];
          for (let l = 0; l < this.frData.length; l++) {
            for (let p = 0; p < listFR.length; p++) {
              if (this.frData[l].idFR == listFR[p]) {
                for (let v = 0; v < this.brData.length; v++) {
                  if (this.brData[v].idBR == this.frData[l].idBR) {
                    listBRFR.push({
                      idFR: this.frData[l].idFR,
                      FRID: this.frData[l].FRID,
                      idBR: this.frData[l].idBR,
                      BRID: this.brData[v].BRID
                    });
                  }
                }
              }
            }
          }
          this.mergeData[i].listBRFR = listBRFR.sort(this.compareBRFRData);
        }
      }
    }
  }

  selectStatusCycle(SelectCycleValue: string, keyIDTE: string) {
    if (SelectCycleValue != "") {
      this.afs.doc('TestExecution/' + keyIDTE).update({ TEStatus: SelectCycleValue });
    }
  }

  addViewDef(keyIDTE: string) {
    this.dialog.open(DialogViewAddDefectComponent, {
      data: {
        idTE: keyIDTE
      },
      autoFocus: true,
      width: "80%",
      height: "auto",
    });
  }

  addDef(keyIDTE: string) {
    this.dialog.open(DialogAddDefectComponent, {
      data: {
        idTE: keyIDTE
      },
      autoFocus: true,
      width: "60%",
      height: "auto",
    });
  }

  getListDropdownSC() {
    var listSCID = [];
    for (let j = 0; j < this.screenData.length; j++) {
      if (this.screenData[j].ScreenID != "") {
        listSCID.push(this.screenData[j].ScreenID);
      }
    }
    var setListSCID = new Set(listSCID);
    this.listSCSelect = Array.from(setListSCID);
    this.listSCSelect = this.listSCSelect.sort();
    console.log(this.listSCSelect);
  }

  addRow() {
    const user = JSON.parse(localStorage.getItem('user'));
    const idTS = this.afs.createId();
    const idTC = this.afs.createId();
    for (let i = 0; i < 3; i++) {
      const idTE = this.afs.createId();
      const teRef: AngularFirestoreDocument<any> = this.afs.doc('TestExecution/' + idTE);
      const teAddData = {
        idTE: idTE,
        idTS: idTS,
        TEAdatefrom: "",
        TEAdateto: "",
        TEAssignto: "",
        TEStatus: "0",
        TEPdatefrom: "",
        TEPdateto: "",
        Cycle: (i + 1).toString()
      };
      teRef.set(teAddData, {
        merge: true
      });
    }
    const tcRef: AngularFirestoreDocument<any> = this.afs.doc('TestCase/' + idTC);
    const tcAddData = {
      idTC: idTC,
      idFR: "",
      TCID: "",
      TCDes: "",
      TCWrittenby: user.idU,
      idScreen: ""
    };
    tcRef.set(tcAddData, {
      merge: true
    });

    const tsRef: AngularFirestoreDocument<any> = this.afs.doc('TestScript/' + idTS);
    const tsAddData = {
      idTS: idTS,
      idTC: idTC,
      TSID: "",
      TSDes: "",
      TSE_Result: ""
    };
    tsRef.set(tsAddData, {
      merge: true
    });
  }

  compareDefID(a, b) {
    if (a.DefID < b.DefID) {
      return -1;
    }
    if (a.DefID > b.DefID) {
      return 1;
    }
    return 0;
  }

  compareBRFRData(a, b) {
    let i = 0;
    let result = 0;
    let sortBy = [{
      prop: 'BRID',
      direction: 1
    }, {
      prop: 'FRID',
      direction: 1
    }];
    while (i < sortBy.length && result === 0) {
      result = sortBy[i].direction * (a[sortBy[i].prop].toString() === "" ? 1 : b[sortBy[i].prop].toString() === "" ? -1 : a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
      //result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      i++;
    }
    return result;
  }

  compareAllData(a, b) {
    let i = 0;
    let result = 0;
    let sortBy = [{
      prop: 'ScreenID',
      direction: 1
    }, {
      prop: 'BRID',
      direction: 1
    }, {
      prop: 'FRID',
      direction: 1
    }, {
      prop: 'TCID',
      direction: 1
    }, {
      prop: 'TSID',
      direction: 1
    }];
    while (i < sortBy.length && result === 0) {
      result = sortBy[i].direction * (a[sortBy[i].prop].toString() === "" ? 1 : b[sortBy[i].prop].toString() === "" ? -1 : a[sortBy[i].prop].toString() < b[sortBy[i].prop].toString() ? -1 : (a[sortBy[i].prop].toString() > b[sortBy[i].prop].toString() ? 1 : 0));
      //result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      i++;
    }
    return result;
  }
  detectFiles(event) {
    this.selectedFiles = event.target.files;
  }

  getFiles() {
    this.afs.collection('uploads').valueChanges().subscribe(resBR => {
      this.dataFiles = resBR as files[];
    });
  }

  uploadSingle() {
    let file = this.selectedFiles.item(0)
    this.currentUpload = new Upload(file);
    this.upSvc.uploadFiles(this.currentUpload);
  }

}
