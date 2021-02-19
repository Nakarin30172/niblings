import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogOverviewExampleComponent } from './component/dialog-filter';
import { isNullOrUndefined, isUndefined } from 'util';

@Component({
  selector: 'app-plan-test-execution',
  templateUrl: './plan-test-execution.component.html',
  styleUrls: ['./plan-test-execution.component.sass']
})
export class PlanTestExecutionComponent implements OnInit {

  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,

  ) {
  }

  ngOnInit() {
    this.afs.collection('User').valueChanges().subscribe(resUser => {
      this.userData = resUser;
      if (this.isFilter === false) {
        this.mergeValue();
      } else {

      }
    });
    this.afs.collection('TestCase').valueChanges().subscribe(resTC => {
      this.TCData = resTC;
      if (this.isFilter === false) {
        this.mergeValue();
      } else {

      }
    });
    this.afs.collection('TestScript').valueChanges().subscribe(resTS => {
      this.TSData = resTS;
      if (this.isFilter === false) {
        this.mergeValue();
      } else {

      }
    });
    this.afs.collection('BR').valueChanges().subscribe(resBR=>{
      this.brData = resBR;
      this.mergeValue();
    });
    this.afs.collection('FR').valueChanges().subscribe(resFR=>{
      this.frData = resFR;
      this.mergeValue();
    });
    this.afs.collection('TestExecution').valueChanges().subscribe(resTE => {
      this.TEData = resTE;
      if (this.isFilter === false) {
        this.mergeValue();
      } else {

      }
    });
  }
  brData = null;
  frData = null;

  cycleSelected = "1";
  TCData = null;
  TSData = null;
  TEData: Array<any>;
  userData = null;
  mergeData = [];
  tempMergeData = [];
  dataFilter: any;
  txt = 0;
  public isFilter: boolean = false;

  public openDialog(): void {

    // open modal
    const dialogRef = this.dialog.open(DialogOverviewExampleComponent);

    // resposn modal 
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result !== undefined) {
        if (result !== false) {
          this.claerFilterCondition();
          this.isFilter = true;
          this.dataFilter = result;
          const filterData = this.filterCondition(result);
          this.mergeData = [];
          if (!filterData) {
            // if a is negative,undefined,null,empty value then...
            this.mergeData = [];
          } else {
            this.mergeData.push(filterData);
          }
        }
      }
    });


  }

  public filterCondition(data: any): any {
    let filterConditionOut = [];

    if (data.TCID !== '') {
        this.txt = data.TCID.substring(6);
        filterConditionOut = this.mergeData.find(call => call.TCID.includes(data.TCID));


    }
    // if (data.TEPdatefrom !== '') {
    //   console.log('TEPdatefrom');
    //   console.log(filterConditionOut.find(call => call.Cycle1[0].TEPdatefrom === data.TEPdatefrom));
    //   // filterConditionOut = filterConditionOut.find(call => call.Cycle1[0].TEPdatefrom === data.TEPdatefrom);
    // }
    return filterConditionOut;

  }

  public claerFilterCondition() {
    this.isFilter = false;
    this.mergeValue();
  }

  selectCycle(selectCycleVal: string) {
    this.cycleSelected = selectCycleVal;
  }

  mergeValue() {
    if (this.TCData != null && this.TSData != null && this.TEData != null && this.userData != null &&this.brData!=null && this.frData!=null ) {
      this.mergeData = this.buildData();
      this.tempMergeData = this.mergeData;
      console.log(this.mergeData);
    }
  }

  buildData() {
    var dataMerge = this.TCData;
    for (let i = 0; i < dataMerge.length; i++) {
      //var listTSTE = [];
      dataMerge[i].Cycle1 = [];
      dataMerge[i].Cycle2 = [];
      dataMerge[i].Cycle3 = [];
      var numAllInCycle1 = 0;
      var numChangeInCycle1 = 0;
      var numAllInCycle2 = 0;
      var numChangeInCycle2 = 0;
      var numAllInCycle3 = 0;
      var numChangeInCycle3 = 0;

      var numstatus00 = 0;
      var numstatus01 = 0;
      var numstatus02 = 0;
      var numstatus03 = 0;
      var numstatus04 = 0;
      var numstatus05 = 0;

      var numstatus10 = 0;
      var numstatus11 = 0;
      var numstatus12 = 0;
      var numstatus13 = 0;
      var numstatus14 = 0;
      var numstatus15 = 0;
      
      var numstatus20 = 0;
      var numstatus21 = 0;
      var numstatus22 = 0;
      var numstatus23 = 0;
      var numstatus24 = 0;
      var numstatus25 = 0;

      var sumAllstatus1 = 0;
      var sumAllstatus2 = 0;
      var sumAllstatus3 = 0;
      var numStatusCycle1 = 0;
      var numStatusCycle2 = 0;
      var numStatusCycle3 = 0;

      var Finish1 = 0;
      var Finish2 = 0;
      var Finish3 = 0;

      for (let j = 0; j < this.TSData.length; j++) {
        if (dataMerge[i].idTC == this.TSData[j].idTC) {
          for (let n = 0; n < this.TEData.length; n++) {
            if (this.TSData[j].idTS == this.TEData[n].idTS) {
              if (this.TEData[n].Cycle == "1") {
                dataMerge[i].Cycle1.push({
                  idTE: this.TEData[n].idTE,
                  idTS: this.TEData[n].idTS,
                  TEAdatefrom: this.TEData[n].TEAdatefrom,
                  TEAdateto: this.TEData[n].TEAdateto,
                  TEAssignto: this.TEData[n].TEAssignto,
                  TEStatus: this.TEData[n].TEStatus,
                  TEPdatefrom: this.TEData[n].TEPdatefrom,
                  TEPdateto: this.TEData[n].TEPdateto,
                  Cycle: this.TEData[n].Cycle
                });
                if (this.TEData[n].TEStatus == 0) {
                  numstatus00 = numstatus00 + 1;
                  numStatusCycle1=0;                       // No Run
                  console.log(numstatus00)
                  console.log("status0",numStatusCycle1)
                }

                if(this.TEData[n].TEStatus == 1) {
                  numstatus01 = numstatus01 + 1;
                  numStatusCycle1=1;                      // status Passed
                  console.log(numstatus01)
                  console.log("status1",numStatusCycle1)
                }
                if(this.TEData[n].TEStatus == 2) {
                  numstatus02 = numstatus02 + 1;
                  console.log(numstatus02)
                }
                if(this.TEData[n].TEStatus == 3) {
                  numstatus03 = numstatus03 + 1;
                  console.log(numstatus03)
                }
                if(this.TEData[n].TEStatus == 4) {
                  numstatus04 = numstatus04 + 1;
                  numStatusCycle1=4;                 // status Cancelled
                  console.log(numstatus04)
                }
                if(this.TEData[n].TEStatus == 5) {
                  numstatus05 = numstatus05 + 1;   
                  console.log(numstatus05)
                }
                // else {
                //   numStatusCycle3=6;                 // status No Status
                // }


                if (numstatus02 > 0) {
                  numStatusCycle1=2;              // status No Fail
                }
                if (numstatus03 > 0) {
                  numStatusCycle1=3;              // status  Stopper
                }
                
                if (numstatus05 > 0) {
                  numStatusCycle1=5;              // status  Not Completed
                }

                if (numstatus05 > 0 && numstatus00 > 0 ) {
                  numStatusCycle1=5;              // status  Not Completed
                } 
                
                if (numstatus04 > 0 && numstatus00 > 0 ) {
                  numStatusCycle1=0;              // status  Not run
                } 
                
                if (numstatus04 > 0 && numstatus01 > 0 ) {
                  numStatusCycle1=1;              // status  passed
                } 
                Finish1 = numstatus02+numstatus03+numstatus05;
                sumAllstatus1     = numstatus01+numstatus02+numstatus03+numstatus05+numstatus00+numstatus04;
                numChangeInCycle1 = numstatus01+numstatus02+numstatus03+numstatus05;
                numAllInCycle1    = numstatus01+numstatus02+numstatus03+numstatus05+numstatus00+numstatus04;
                /*
                this.TSData[j].Cycle1 = {
                  idTE: this.TEData[n].idTE,
                  idTS: this.TEData[n].idTS,
                  TEAdatefrom: this.TEData[n].TEAdatefrom,
                  TEAdateto: this.TEData[n].TEAdateto,
                  TEAssignto: this.TEData[n].TEAssignto,
                  TEStatus: this.TEData[n].TEStatus,
                  TEPdatefrom: this.TEData[n].TEPdatefrom,
                  TEPdateto: this.TEData[n].TEPdateto,
                  Cycle: this.TEData[n].Cycle
                }
                */
              }
               else if (this.TEData[n].Cycle == "2") {
                dataMerge[i].Cycle2.push({
                  idTE: this.TEData[n].idTE,
                  idTS: this.TEData[n].idTS,
                  TEAdatefrom: this.TEData[n].TEAdatefrom,
                  TEAdateto: this.TEData[n].TEAdateto,
                  TEAssignto: this.TEData[n].TEAssignto,
                  TEStatus: this.TEData[n].TEStatus,
                  TEPdatefrom: this.TEData[n].TEPdatefrom,
                  TEPdateto: this.TEData[n].TEPdateto,
                  Cycle: this.TEData[n].Cycle
                });
                if (this.TEData[n].TEStatus == 0) {
                  numstatus10 = numstatus10 + 1;
                  numStatusCycle2=0;                       // No Run
                  console.log(numstatus10)
                  console.log("status0",numStatusCycle2)
                }

                if(this.TEData[n].TEStatus == 1) {
                  numstatus11 = numstatus11 + 1;
                  numStatusCycle2=1;                      // status Passed
                  console.log(numstatus11)
                  console.log("status1",numStatusCycle2)
                }
                if(this.TEData[n].TEStatus == 2) {
                  numstatus12 = numstatus12 + 1;
                  console.log(numstatus12)
                }
                if(this.TEData[n].TEStatus == 3) {
                  numstatus13 = numstatus13 + 1;
                  console.log(numstatus13)
                }
                if(this.TEData[n].TEStatus == 4) {
                  numstatus14 = numstatus14 + 1;
                  numStatusCycle2=4;                 // status Cancelled
                  console.log(numstatus14)
                }
                if(this.TEData[n].TEStatus == 5) {
                  numstatus15 = numstatus15 + 1;   
                  console.log(numstatus15)
                }
                // else {
                //   numStatusCycle3=6;                 // status No Status
                // }


                if (numstatus12 > 0) {
                  numStatusCycle2=2;              // status No Fail
                }
                if (numstatus13 > 0) {
                  numStatusCycle2=3;              // status  Stopper
                }
                
                if (numstatus15 > 0) {
                  numStatusCycle2=5;              // status  Not Completed
                }

                if (numstatus15 > 0 && numstatus10 > 0 ) {
                  numStatusCycle2=5;              // status  Not Completed
                } 
                
                if (numstatus14 > 0 && numstatus10 > 0 ) {
                  numStatusCycle2=0;              // status  Not run
                } 
                
                if (numstatus14 > 0 && numstatus11 > 0 ) {
                  numStatusCycle2=1;              // status  passed
                } 
                Finish2 = numstatus12+numstatus13+numstatus15;
                sumAllstatus2     = numstatus11+numstatus12+numstatus13+numstatus15+numstatus10+numstatus14;
                numChangeInCycle2 = numstatus11+numstatus12+numstatus13+numstatus15;
                numAllInCycle2    = numstatus11+numstatus12+numstatus13+numstatus15+numstatus10+numstatus14;
                /*
                this.TSData[j].Cycle2 = {
                  idTE: this.TEData[n].idTE,
                  idTS: this.TEData[n].idTS,
                  TEAdatefrom: this.TEData[n].TEAdatefrom,
                  TEAdateto: this.TEData[n].TEAdateto,
                  TEAssignto: this.TEData[n].TEAssignto,
                  TEStatus: this.TEData[n].TEStatus,
                  TEPdatefrom: this.TEData[n].TEPdatefrom,
                  TEPdateto: this.TEData[n].TEPdateto,
                  Cycle: this.TEData[n].Cycle
                }
                */
              } 
              else if (this.TEData[n].Cycle == "3") {
                dataMerge[i].Cycle3.push({
                  idTE: this.TEData[n].idTE,
                  idTS: this.TEData[n].idTS,
                  TEAdatefrom: this.TEData[n].TEAdatefrom,
                  TEAdateto: this.TEData[n].TEAdateto,
                  TEAssignto: this.TEData[n].TEAssignto,
                  TEStatus: this.TEData[n].TEStatus,
                  TEPdatefrom: this.TEData[n].TEPdatefrom,
                  TEPdateto: this.TEData[n].TEPdateto,
                  Cycle: this.TEData[n].Cycle
                });

                if (this.TEData[n].TEStatus == 0) {
                  numstatus20 = numstatus20 + 1;
                  numStatusCycle3=0;                       // No Run
                  console.log("status0",numstatus20)
                  console.log("status0",numStatusCycle3)
                }

                if(this.TEData[n].TEStatus == 1) {
                  numstatus21 = numstatus21 + 1;
                  numStatusCycle3=1;                      // status Passed
                  console.log("status1",numstatus21)
                  console.log("status1",numStatusCycle3)
                }
                if(this.TEData[n].TEStatus == 2) {
                  numstatus22 = numstatus22 + 1;
                  console.log("status2",numstatus22)
                  console.log("status2",numStatusCycle3)
                }
                if(this.TEData[n].TEStatus == 3) {
                  numstatus23 = numstatus23 + 1;
                  console.log("status3",numstatus23)
                  console.log("status3",numStatusCycle3)
                }
                if(this.TEData[n].TEStatus == 4) {
                  numstatus24 = numstatus24 + 1;
                  numStatusCycle3=4;                 // status Cancelled
                  console.log("status4",numstatus24)
                  console.log("status4",numStatusCycle3)
                }
                if(this.TEData[n].TEStatus == 5) {
                  numstatus25 = numstatus25 + 1;   
                  console.log("status5",numstatus25)
                  console.log("status5",numStatusCycle3)
                }
                // else {
                //   numStatusCycle3=6;                 // status No Status
                // }


                if (numstatus22 > 0) {
                  numStatusCycle3=2;              // status No Fail
                }
                if (numstatus23 > 0) {
                  numStatusCycle3=3;              // status  Stopper
                }
                
                if (numstatus25 > 0) {
                  numStatusCycle3=5;              // status  Not Completed
                }

                if (numstatus25 > 0 && numstatus20 > 0 ) {
                  numStatusCycle3=5;              // status  Not Completed
                } 
                
                if (numstatus24 > 0 && numstatus20 > 0 ) {
                  numStatusCycle3=0;              // status  Not run
                } 
                
                if (numstatus24 > 0 && numstatus21 > 0 ) {
                  numStatusCycle3=1;              // status  passed
                } 
                Finish3 = numstatus22+numstatus23+numstatus25;
                sumAllstatus3     = numstatus21+numstatus22+numstatus23+numstatus25+numstatus20+numstatus24;
                numChangeInCycle3 = numstatus21+numstatus22+numstatus23+numstatus25;
                numAllInCycle3    = numstatus21+numstatus22+numstatus23+numstatus25+numstatus20+numstatus24;

                // if (numstatus5 > 0) {
                //   numStatusCycle3=5;              // status  Not Completed
                // }

                //  {
                //   numStatusCycle3=5;
                //   console.log("status6",numStatusCycle3)                 // status No Status
                // }

                /*
                this.TSData[j].Cycle3 = {
                  idTE: this.TEData[n].idTE,
                  idTS: this.TEData[n].idTS,
                  TEAdatefrom: this.TEData[n].TEAdatefrom,
                  TEAdateto: this.TEData[n].TEAdateto,
                  TEAssignto: this.TEData[n].TEAssignto,
                  TEStatus: this.TEData[n].TEStatus,
                  TEPdatefrom: this.TEData[n].TEPdatefrom,
                  TEPdateto: this.TEData[n].TEPdateto,
                  Cycle: this.TEData[n].Cycle
                }
                */
              }
            }
          }
          /*
          listTSTE.push(
            this.TSData[j]
          );
          */
        }
      }
      dataMerge[i].percentCycle1 = Math.round((100 * numChangeInCycle1) / numAllInCycle1);
      dataMerge[i].percentCycle2 = Math.round((100 * numChangeInCycle2) / numAllInCycle2);
      dataMerge[i].percentCycle3 = Math.round((100 * numChangeInCycle3) / numAllInCycle3);
      dataMerge[i].statusCycle1 = numStatusCycle1;
      dataMerge[i].statusCycle2 = numStatusCycle2;
      dataMerge[i].statusCycle3 = numStatusCycle3;
      dataMerge[i].sumAllstatus1 = sumAllstatus1;      
      dataMerge[i].sumAllstatus2 = sumAllstatus2;      
      dataMerge[i].sumAllstatus3 = sumAllstatus3;      
      dataMerge[i].numstatus00 = numstatus00;   
      dataMerge[i].numstatus01 = numstatus01;
      dataMerge[i].numstatus02 = numstatus02;        
      dataMerge[i].numstatus03 = numstatus03;        
      dataMerge[i].numstatus04 = numstatus04;  
      dataMerge[i].numstatus05 = numstatus05; 

      dataMerge[i].numstatus10 = numstatus10;   
      dataMerge[i].numstatus11 = numstatus11;
      dataMerge[i].numstatus12 = numstatus12;        
      dataMerge[i].numstatus13 = numstatus13;        
      dataMerge[i].numstatus14 = numstatus14;  
      dataMerge[i].numstatus15 = numstatus15; 

      dataMerge[i].numstatus20 = numstatus20;   
      dataMerge[i].numstatus21 = numstatus21;
      dataMerge[i].numstatus22 = numstatus22;        
      dataMerge[i].numstatus23 = numstatus23;        
      dataMerge[i].numstatus24 = numstatus24;  
      dataMerge[i].numstatus25 = numstatus25;    

      dataMerge[i].Finish3 = Finish3;        
      dataMerge[i].Finish2 = Finish2;  
      dataMerge[i].Finish1 = Finish1;    

      //dataMerge[i].listTSTE = listTSTE;
    }
    /*
    var dataMerge = this.TSData;
    for (let i = 0; i < dataMerge.length; i++) {
      for (let n = 0; n < this.TEData.length; n++) {
        if (this.TEData[n].idTS == dataMerge[i].idTS) {
          if (this.TEData[n].Cycle == 1) {
            dataMerge[i].Cycle1 = {
              idTE: this.TEData[n].idTE,
              idTS: this.TEData[n].idTS,
              TEAdatefrom: this.TEData[n].TEAdatefrom,
              TEAdateto: this.TEData[n].TEAdateto,
              TEAssignto: this.TEData[n].TEAssignto,
              TEStatus: this.TEData[n].TEStatus,
              Cycle: this.TEData[n].Cycle
            }
          } else if (this.TEData[n].Cycle == 2) {
            dataMerge[i].Cycle2 = {
              idTE: this.TEData[n].idTE,
              idTS: this.TEData[n].idTS,
              TEAdatefrom: this.TEData[n].TEAdatefrom,
              TEAdateto: this.TEData[n].TEAdateto,
              TEAssignto: this.TEData[n].TEAssignto,
              TEStatus: this.TEData[n].TEStatus,
              Cycle: this.TEData[n].Cycle
            }
          } else if (this.TEData[n].Cycle == 3) {
            dataMerge[i].Cycle3 = {
              idTE: this.TEData[n].idTE,
              idTS: this.TEData[n].idTS,
              TEAdatefrom: this.TEData[n].TEAdatefrom,
              TEAdateto: this.TEData[n].TEAdateto,
              TEAssignto: this.TEData[n].TEAssignto,
              TEStatus: this.TEData[n].TEStatus,
              Cycle: this.TEData[n].Cycle,
            }
          }
        }
      }
      for (let j = 0; j < this.TCData.length; j++) {
        if (dataMerge[i].idTC == this.TCData[j].idTC) {
          dataMerge[i].TCID = this.TCData[j].TCID;
          dataMerge[i].TCDes = this.TCData[j].TCDes;
        }
      }
    }
    */
    return dataMerge.sort(this.compareTCID);;
  }

  compareTCID(a, b) {
    if (a.TCID < b.TCID) {
      return -1;
    }
    if (a.TCID > b.TCID) {
      return 1;
    }
    return 0;
  }

  getListTEInCycle(selectTCID: string) {
    for (let i = 0; i < this.mergeData.length; i++) {
      if (this.mergeData[i].idTC == selectTCID) {
        var listIDTE = [];
        var listTEInCycle = [];
        if (this.cycleSelected == "1") {
          listTEInCycle = this.mergeData[i].Cycle1;
        } else if (this.cycleSelected == "2") {
          listTEInCycle = this.mergeData[i].Cycle2;
        } else {
          listTEInCycle = this.mergeData[i].Cycle3;
        }
        for (let j = 0; j < listTEInCycle.length; j++) {
          listIDTE.push(listTEInCycle[j].idTE);
        }
        return listIDTE;
      }
    }
  }

  selectAssignto(selectTCID: string, selectAssignID: string) {
    if (selectAssignID !== "") {
      var listIDTE = this.getListTEInCycle(selectTCID);
      for (let i = 0; i < listIDTE.length; i++) {
        this.afs.doc('TestExecution/' + listIDTE[i]).update({ TEAssignto: selectAssignID });
      }
    }
  }

  selectPDateFrom(selectTCID: string, selectPDateFrom) {
    if (selectPDateFrom !== "") {
      var listIDTE = this.getListTEInCycle(selectTCID);
      for (let i = 0; i < listIDTE.length; i++) {
        this.afs.doc('TestExecution/' + listIDTE[i]).update({ TEPdatefrom: selectPDateFrom });
      }
    }
  }

  selectPDateTo(selectTCID: string, selectPDateTo) {
    if (selectPDateTo !== "") {
      var listIDTE = this.getListTEInCycle(selectTCID);
      for (let i = 0; i < listIDTE.length; i++) {
        this.afs.doc('TestExecution/' + listIDTE[i]).update({ TEPdateto: selectPDateTo });
      }
    }
  }

  selectADateFrom(selectTCID: string, selectADateFrom) {
    if (selectADateFrom !== "") {
      var listIDTE = this.getListTEInCycle(selectTCID);
      for (let i = 0; i < listIDTE.length; i++) {
        this.afs.doc('TestExecution/' + listIDTE[i]).update({ TEAdatefrom: selectADateFrom });
      }
    }
  }

  selectADateTo(selectTCID: string, selectADateTo) {
    if (selectADateTo !== "") {
      var listIDTE = this.getListTEInCycle(selectTCID);
      for (let i = 0; i < listIDTE.length; i++) {
        this.afs.doc('TestExecution/' + listIDTE[i]).update({ TEAdateto: selectADateTo });
      }
    }
  }

}
