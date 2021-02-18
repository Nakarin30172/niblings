import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-screen',
  templateUrl: './view-screen.component.html',
  styleUrls: ['./view-screen.component.sass']
})
export class ViewScreenComponent implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private router: Router,
  ) {
    this.viewScreenForm = this.formBuilder.group({
      valBRFR: [''],
      valScreenID: [''],
      valScreenDes: ['']
    });
  }

  viewScreenForm;

  selectIdScreen:string;
  selectIdFR:string;

  preBRData = null;
  brData = null;
  preFRData = null;
  frData = null;
  preFRScreenData = null;
  frScreenData = null;
  preScreenData = null;
  screenData = null;

  frScreenRaw = null;

  mergeData :any = {};

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        this.selectIdScreen = params.idScreen;
        this.selectIdFR = params.idFR;
        if(this.selectIdScreen===undefined||this.selectIdFR==undefined){
          this.router.navigate(['requirement']);
        }
      }
    );
    this.afs.collection('BR').valueChanges().subscribe(resBR=>{
      if(this.preBRData==null){
        this.preBRData = resBR;
      }
      this.brData = resBR;
      this.mergeValue();
    });
    this.afs.collection('FR').valueChanges().subscribe(resFR=>{
      if(this.preFRData==null){
        this.preFRData = resFR;
      }
      this.frData = resFR;
      this.mergeValue();
    });
    this.afs.collection('FR_Screen').valueChanges().subscribe(resFRScreen=>{
      if(this.preFRScreenData==null){
        this.preFRScreenData = resFRScreen;
      }
      this.frScreenData = resFRScreen;
      this.mergeValue();
    });
    this.afs.doc('Screen/'+this.selectIdScreen).valueChanges().subscribe(resScreen=>{
      if(this.preScreenData==null){
        this.preScreenData = resScreen;
      }
      this.screenData = resScreen;
      this.mergeValue();
    });
    
  }

  mergeValue(){
    if(this.brData!==null&&this.frData!==null&&this.frScreenData!==null&&this.screenData!==null){
      if(Object.keys(this.mergeData).length==0){
        this.mergeData['ScreenID'] = this.screenData.ScreenID;
        this.mergeData['ScreenDes'] = this.screenData.ScreenDes;
        this.mergeData['ScreenURL'] = this.screenData.ScreenURL;
        this.preScreenData = this.screenData;
        this.preFRScreenData = this.frScreenData;
        for(let j in this.frData){
          if(this.frData[j].idFR == this.selectIdFR){
            this.mergeData['FRID'] = this.frData[j].FRID;
            this.mergeData['idBR'] = this.frData[j].idBR;
            this.preFRData = this.frData;
            break;
          }
        }
        for(let k in this.brData){
          if(this.brData[k].idBR == this.mergeData['idBR']){
            this.mergeData['BRID'] = this.brData[k].BRID;
            this.preBRData = this.brData;
            break;
          }
        }
        this.viewScreenForm.patchValue({
          valBRFR: 'BR_000'+this.mergeData['BRID']+'-FR_000'+this.mergeData['FRID'],
          valScreenID: 'SC_000'+this.mergeData['ScreenID'],
          valScreenDes: this.mergeData['ScreenDes']
        });
      }else{
        this.mergeData['ScreenDes'] = this.screenData.ScreenDes;
        this.viewScreenForm.controls['valScreenDes'].setValue(this.mergeData['ScreenDes']);
      }
    }
  }

  save(formScreenData) {
    if(this.mergeData['ScreenDes']===formScreenData.valScreenDes){
    }else{
      if(formScreenData.valScreenDes==''&&formScreenData.valScreenID==''&&formScreenData.valBRFR==''){
      }else{
        this.afs.doc('Screen/'+this.selectIdScreen).update({ScreenDes:formScreenData.valScreenDes});
        alert("Update Success!!!");
      }
    }
  }

}
