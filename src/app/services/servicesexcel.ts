import { Injectable } from '@angular/core';
import * as FileSaver from 'filesaver'
import * as XLSX from 'xlsx';
import  * as moment from 'moment';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
// Let's make some changes to this empty array

@Injectable()
export class ExcelService {
constructor() { }
mappedJson = [];
public exportAsExcelFile(json: any[], excelFileName: string): void {
/****************
* Let's make some changes in our data
*/
this.mappedJson = json.map(item => {
return {
Eid: item.eid,
Ename: item.ename,
EDate: item.edate ? moment(item.edate).format('YYYY-MM-DD') : 'N/A'
}
})

/********************
* We passed in our mappedJson after customizing it
*/
const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.mappedJson);
const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
this.saveAsExcelFile(excelBuffer, excelFileName);
}
private saveAsExcelFile(buffer: any, fileName: string): void {
   const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
/***********
*YOUR EXCEL FILE'S NAME
*/
FileSaver.saveAs(data, fileName + moment(Date.now()).format('YYYY_MM_DD')  + EXCEL_EXTENSION);
}
}