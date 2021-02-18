import { Component, Inject } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-filter.html',
})
export class DialogOverviewExampleComponent {

  filterForm: FormGroup;


  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.initForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public clearForm() {
    this.filterForm.reset();
  }
 
  public initForm() {
    this.filterForm = this.formBuilder.group({
      TCID: ['',Validators.required],
      TEPdatefrom: [''],
      TEPdateto: ['' ],
      TEAdatefrom: ['' ],
      TEAdateto: [''],
      TEAssignto: [''],
      statusCycle1: [''],
      percentCycle1: ['']
    });
    console.log("tEST")
  }

  public prepareData(): any {
    if (this.filterForm.valid) {
      return this.data = this.filterForm.value;
    } 
    else {
      return this.data = false;
    }
  }
  public cancel(): any {
    return this.data = false;
  }



}
