// state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, distinctUntilChanged, shareReplay } from 'rxjs/operators';

export interface AppState {
  user: UserState | null;
  loading: boolean;
  connected: boolean;
  error: string | null;
  [key: string]: any;
}

export interface UserState {
  id: number | null;
  email: string;
  role: string;
  permissions: string[];
  token: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly initialState: AppState = {
    user: null,
    connected: false,
    loading: false,
    error: null
  };

  getInitialUserState(): UserState {
    return {
      id: null,
      email: '',
      role: '',
      permissions: [],
      token: null
    };
  }

  getInitialState(): AppState {
    return this.initialState;
  }

  private state$ = new BehaviorSubject<AppState>(this.initialState);
  private destroy$ = new Subject<void>();

  // Public observables
  public readonly state: Observable<AppState> = this.state$.asObservable().pipe(
    shareReplay(1)
  );

  // Select specific state slices
  select<K extends keyof AppState>(key: K): Observable<AppState[K]> {
    return this.state$.pipe(
      map(state => state[key]),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  // Get current state snapshot (use sparingly)
  getState(): AppState {
    return this.state$.getValue();
  }

  // Update state immutably
  setState(partialState: Partial<AppState>): void {
    const currentState = this.getState();
    this.state$.next({
      ...currentState,
      ...partialState
    });
  }

  // Reset state
  resetState(): void {
    this.state$.next(this.initialState);
  }

  // Cleanup
  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}