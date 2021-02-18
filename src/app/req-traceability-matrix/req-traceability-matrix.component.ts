import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Component({
  selector: 'app-req-traceability-matrix',
  templateUrl: './req-traceability-matrix.component.html',
  styleUrls: ['./req-traceability-matrix.component.sass']
})
export class ReqTraceabilityMatrixComponent implements OnInit {

  constructor(private afs: AngularFirestore) { }

  ngOnInit() {
    this.afs.collection('BR').valueChanges().subscribe(resBR=>{
      this.brData = resBR;
      this.mergeValue();
    });
    this.afs.collection('FR').valueChanges().subscribe(resFR=>{
      this.frData = resFR;
      this.mergeValue();
    });
    this.afs.collection('TestCase').valueChanges().subscribe(resTC=>{
      this.TCData = resTC;
      this.mergeValue();
    });
  }

  brData = null;
  frData = null;
  TCData = null;

  mergeData = null;

  mergeValue(){
    if(this.brData!=null && this.frData!=null && this.TCData!=null){
      this.mergeData = this.buildData();
      console.log(this.mergeData);
    }
  }

  buildData(){
    let dataMerge = [];
    for(let i=0; i<this.TCData.length; i++){
      for(let j=0; j<this.frData.length; j++){
        if(this.TCData[i].idFR==this.frData[j].idFR && this.TCData[i].TCID!=""){
          for(let k=0; k<this.brData.length; k++){
            if(this.frData[j].idBR==this.brData[k].idBR){
              dataMerge.push({
                BRID: this.brData[k].BRID,
                FRID: this.frData[j].FRID,
                TCID: this.TCData[i].TCID
              });
              break;
            }
          }
        }
      }
    }
    return dataMerge.sort(this.compareAllData);
  }

  compareAllData(a,b){
    let i = 0;
    let result = 0;
    let sortBy = [{
      prop:'BRID',
      direction: 1
    },{
      prop:'FRID',
      direction: 1
    },{
      prop:'TCID',
      direction: 1
    }];
    while(i < sortBy.length && result === 0) {
      result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() === "" ? 1 : b[ sortBy[i].prop ].toString() === "" ? -1 : a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      //result = sortBy[i].direction*(a[ sortBy[i].prop ].toString() < b[ sortBy[i].prop ].toString() ? -1 : (a[ sortBy[i].prop ].toString() > b[ sortBy[i].prop ].toString() ? 1 : 0));
      i++;
    }
    return result;
  }

}
