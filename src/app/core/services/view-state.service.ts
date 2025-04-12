import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewStateService {
  private showErrorCase = true;

  toggleView() {
    this.showErrorCase = !this.showErrorCase;
    return this.showErrorCase;
  }
}
