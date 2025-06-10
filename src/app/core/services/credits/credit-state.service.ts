import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreditDto } from '../../dtos/Credits/credits';

export interface CreditState {
  selectedCredit: CreditDto | null;
  isEditMode: boolean;
  isLoading: boolean;
  error: string | null;
}

const etatInitial: CreditState = {
  selectedCredit: null,
  isEditMode: false,
  isLoading: false,
  error: null
};

@Injectable({
  providedIn: 'root'
})
export class CreditStateService implements OnDestroy {
  private destroy$ = new Subject<void>();
  private state = new BehaviorSubject<CreditState>(etatInitial);
  state$ = this.state.asObservable();

  selectedCredit$ = new BehaviorSubject<CreditDto | null>(null);
  isEditMode$ = new BehaviorSubject<boolean>(false);
  isLoading$ = new BehaviorSubject<boolean>(false);
  error$ = new BehaviorSubject<string | null>(null);

  constructor() {
    this.state$
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.selectedCredit$.next(state.selectedCredit);
        this.isEditMode$.next(state.isEditMode);
        this.isLoading$.next(state.isLoading);
        this.error$.next(state.error);
      });
  }

  setSelectedCredit(credit: CreditDto | null): void {
    this.updateState({ selectedCredit: credit });
  }

  getSelectedCredit(): Observable<CreditDto | null> {
    return this.selectedCredit$;
  }

  setEditMode(isEdit: boolean): void {
    this.updateState({ isEditMode: isEdit });
  }

  setLoading(isLoading: boolean): void {
    this.updateState({ isLoading });
  }

  setError(error: string | null): void {
    this.updateState({ error });
  }

  clearSelectedCredit(): void {
    this.updateState({ selectedCredit: null, isEditMode: false });
  }

  resetState(): void {
    this.state.next(etatInitial);
  }

  private updateState(partialState: Partial<CreditState>): void {
    this.state.next({
      ...this.state.value,
      ...partialState
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}