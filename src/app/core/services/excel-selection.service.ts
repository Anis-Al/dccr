import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ExcelMetadonneesDto } from '../dtos/Excel/excel-metadonnees-dto';

@Injectable({
  providedIn: 'root'
})
export class ExcelSelectionService {
  private selectedExcelSubject = new BehaviorSubject<ExcelMetadonneesDto|null>(null);
  selectedExcel$ = this.selectedExcelSubject.asObservable();

  selectExcel(excel: ExcelMetadonneesDto|null) {
    this.selectedExcelSubject.next(excel);
  }

  getSelectedExcel(): ExcelMetadonneesDto|null {
    return this.selectedExcelSubject.value;
  }
}