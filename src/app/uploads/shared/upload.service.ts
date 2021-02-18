import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Upload } from './upload';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private basePath:string = '/uploads';
  // uploads: FirebaseListObservable<Upload[]>;

   // Writes the file details to the realtime db


  constructor(private db: AngularFireDatabase,private afs: AngularFirestore,) {
    // this.afs.collection('uploads').valueChanges().subscribe(resFRScreen=>{
    //   // this.frScreenData = resFRScreen;
    // });
   }
  private saveFileData(upload: Upload) {
    // console.log(upload);
    let dataUpload = {
      url:upload.url,
      name:upload.file.name,
    }
    const idSC = this.afs.createId();
    const scRef: AngularFirestoreDocument<any> = this.afs.doc('uploads/'+idSC);
    scRef.set(dataUpload, {
      merge: true
    });
  }

  uploadFiles(upload: Upload) {
    console.log(upload);
    
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child(`${this.basePath}/${upload.file.name}`).put(upload.file);

    // uploadTask.on(firebase.storage.StringFormat.DATA_URL,
    //   (snapshot) =>  {
    //     // upload in progress
    //     upload.progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
    //     console.log(snapshot.downloadURL);
        
    //   },
      uploadTask.then(snapshot => snapshot.ref.getDownloadURL())
      .then((url) => {
        const idSC = this.afs.createId();
        const scRef: AngularFirestoreDocument<any> = this.afs.doc('Screen/'+idSC);
        const imageUrl = url;
        upload.url = imageUrl;
        upload.name = upload.file.name
        console.log('URL:' + imageUrl);
        // this.saveFileData(upload)

      })
    //   .snapshot.ref.getDownloadURL().then(downloadURL => {
    //     const imageUrl = downloadURL;
    //     upload.url = imageUrl;
    //     upload.name = upload.file.name
    //     console.log('URL:' + imageUrl);
    //     this.saveFileData(upload)
    //   });
    //   (error) => {
    //     // upload failed
    //     console.log(error)
    //   },
    //   () => {
    //     upload success
    //     console.log(upload);
        
    //     upload.url = uploadTask.snapshot.downloadURL
    //   }
    // );


}
}