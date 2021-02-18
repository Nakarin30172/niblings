import { Component, OnInit, Inject } from '@angular/core';
import {MAT_DIALOG_DATA,MatDialogRef} from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-dialog-add-screen',
  templateUrl: './dialog-add-screen.component.html',
  styleUrls: ['./dialog-add-screen.component.sass']
})
export class DialogAddScreenComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DialogAddScreenComponent>,
    private spinnerService: Ng4LoadingSpinnerService
  ) { 
    this.addScreenForm = this.formBuilder.group({
      valBRFR: ['BR_000'+data.BRID+'-FR_000'+data.FRID],
      valScreenID: [''],
      valScreenURL: [''],
      valScreenDes: ['']
    });
  }

  addScreenForm;

  preFRScreenData = null;
  frScreenData = null;
  preScreenData = null;
  screenData = null;
  mergeData = [];

  ScreenPlusData = null;
  listSCSelect = null;

  imgSelectScreen = null;
  foundUrlStatus = true;

  isUpload = false;
  valImage = null;

  ngOnInit() {
    this.afs.collection('FR_Screen').valueChanges().subscribe(resFRScreen=>{
      /*
      if(this.preFRScreenData==null){
        this.preFRScreenData = resFRScreen;
      }
      */
      this.frScreenData = resFRScreen;
      this.mergeValue();
    });
    this.afs.collection('Screen').valueChanges().subscribe(resScreen=>{
      /*
      if(this.preScreenData==null){
        this.preScreenData = resScreen;
      }
      */
      this.screenData = resScreen;
      this.mergeValue();
      this.checkUpdateDes();
    });
  }

  mergeValue(){
    if(this.frScreenData!=null&&this.screenData!=null){
      this.mergeData = this.buildData();
      this.getPlusScreenID();
      console.log(this.mergeData);
    }
  }
  
  buildData(){
    var dataMerge = [];
    let listScreenSelectFR = [];
    for(let i=0; i<this.frScreenData.length; i++){
      if(this.frScreenData[i].idFR==this.data.idFR){
        listScreenSelectFR.push(this.frScreenData[i].idScreen);
      }
    }
    for(let k=0; k<listScreenSelectFR.length; k++){
      for(let j=0; j<this.screenData.length; j++){
        if(listScreenSelectFR[k]==this.screenData[j].idScreen){
          dataMerge.push(this.screenData[j]);
          break;
        }
      }
    }
    return dataMerge.sort();
  }

  checkUpdateDes(){
    for(let i=0; i<this.screenData.length; i++){
      if(this.screenData[i].ScreenID==this.addScreenForm.controls['valScreenID'].value){
        if(this.addScreenForm.controls['valScreenDes'].value!=this.screenData[i].ScreenDes){
          this.addScreenForm.controls['valScreenDes'].setValue(this.screenData[i].ScreenDes);
        }
      }
    }
  }

  getPlusScreenID(){
    var listSCID = [];
    for(let j=0; j<this.mergeData.length; j++){
      if(this.mergeData[j].ScreenID!=""){
        listSCID.push(this.mergeData[j].ScreenID);
      }
    }
    var setListSCID = new Set(listSCID);
    var listSCinFR = Array.from(setListSCID);
    console.log(listSCinFR);
    this.filterListSC(listSCinFR);
  }

  /*
  getPlusScreenID(){
    var listSCID = [];
    for(let j=0; j<this.screenData.length; j++){
      if(this.screenData[j].ScreenID!=""){
        listSCID.push(this.screenData[j].ScreenID);
      }
    }
    if(listSCID.length==0){
      this.ScreenPlusData = 1;
    }else{
      this.ScreenPlusData = Math.max.apply(null,listSCID)+1;
      var setListSCID = new Set(listSCID);
      this.listSCSelect = Array.from(setListSCID);
      this.listSCSelect = this.listSCSelect.sort();
    }
  }
  */

  filterListSC(listSCinFR){
    let listAllSC = [];
    for(let i=0; i<this.screenData.length; i++){
      if(this.screenData[i].ScreenID!=""){
        listAllSC.push(this.screenData[i].ScreenID);
      }
    }
    console.log(listAllSC);
    if(listAllSC.length!=0){
      this.ScreenPlusData = Math.max.apply(null,listAllSC)+1;
    }else{
      this.ScreenPlusData = 1;
    }
    for(let j=0; j<listSCinFR.length; j++){
      let index = listAllSC.indexOf(listSCinFR[j]);
      if(index >-1){
        listAllSC.splice(index,1);
      }
    }
    console.log(listAllSC);
    this.listSCSelect = listAllSC.sort();
  }

  selectSC(selectScreenVal){
    if(selectScreenVal!=""){
      this.foundUrlStatus = false;
      for(let i=0;i<this.screenData.length;i++){
        if(this.screenData[i].ScreenID==selectScreenVal){
          this.imgSelectScreen = this.screenData[i].ScreenURL;
          this.foundUrlStatus = true;
          this.addScreenForm.controls['valScreenDes'].setValue(this.screenData[i].ScreenDes);
          break;
        }
      }
      if(this.foundUrlStatus==false){
        this.imgSelectScreen = "";
      }
    }else{
      this.foundUrlStatus = true;
      this.imgSelectScreen = "";
    }
  }

    save(screenAddData){
    if(screenAddData.valScreenID==this.ScreenPlusData){
      this.spinnerService.show();
      const ref  = this.afStorage.ref('/ScreenDesign');
      const metadata = {
        contentType: 'image/jpeg',
      };
      const task = ref.child(this.valImage.name).put(this.valImage,metadata);
      task
      .then(snapshot => snapshot.ref.getDownloadURL())
      .then((url) => {
        const idSC = this.afs.createId();
        const scRef: AngularFirestoreDocument<any> = this.afs.doc('Screen/'+idSC);
        const scAddData = {
          ScreenID: screenAddData.valScreenID,
          ScreenDes: screenAddData.valScreenDes,
          ScreenURL: url,
          idScreen: idSC
        };
        scRef.set(scAddData, {
          merge: true
        });
        const idFRSC = this.afs.createId();
        const frscRef: AngularFirestoreDocument<any> = this.afs.doc('FR_Screen/'+idFRSC);
        const frscAddData = {
          idFR: this.data.idFR,
          idScreen: idSC
        };
        frscRef.set(frscAddData, {
          merge: true
        });
        this.spinnerService.hide();
      })
      .catch(() => {
        console.error();
        this.spinnerService.hide();
      })
    }else{
      console.log(this.screenData);
      for(let i = 0; i<this.screenData.length; i++){
        if(this.screenData[i].ScreenID==screenAddData.valScreenID){
          if(this.screenData[i].ScreenDes!=screenAddData.valScreenDes){
            this.afs.doc('Screen/'+this.screenData[i].idScreen).update({ScreenDes:screenAddData.valScreenDes});
          }
          const idFRSC = this.afs.createId();
          const frscRef: AngularFirestoreDocument<any> = this.afs.doc('FR_Screen/'+idFRSC);
          const frscAddData = {
            idFR: this.data.idFR,
            idScreen: this.screenData[i].idScreen
          };
          frscRef.set(frscAddData, {
            merge: true
          });
        }
      }  
    }
    this.dialogRef.close();
  }

  close(){
    this.dialogRef.close();
  }

  showUploadImg(valImage){
    var reader = new FileReader();
    reader.readAsDataURL(valImage[0]); 
    this.valImage = valImage[0];
    reader.onload = (_event) => { 
      this.imgSelectScreen = reader.result; 
    }
    this.isUpload = true;
  }

}
