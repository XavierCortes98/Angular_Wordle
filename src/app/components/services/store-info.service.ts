import { Injectable } from '@angular/core';
import { Cell } from 'src/app/models/cell.model';

@Injectable({
  providedIn: 'root',
})
export class StoreInfoService {
  constructor() {}

  setGameState(resolved: boolean) {
    localStorage.setItem('resolved', JSON.stringify(resolved));
  }

  saveGuessesToCache(guesses: Cell[][]) {
    localStorage.setItem('guesses', JSON.stringify(guesses));
  }

  get guessesFromCache(): Cell[][] | null {
    const guesses = localStorage.getItem('guesses');
    return guesses ? JSON.parse(guesses) : null;
  }

  clear() {
    localStorage.removeItem('guesses');
    localStorage.removeItem('resolved');
  }
}
