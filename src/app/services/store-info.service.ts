import { Injectable } from '@angular/core';
import { Cell } from 'src/app/models/cell.model';
import { Solution } from '../models/solution.model';

@Injectable({
  providedIn: 'root',
})
export class StoreInfoService {
  constructor() {}

  saveGameState(solution: Solution) {
    localStorage.setItem('solution', JSON.stringify(solution));
  }

  saveGuessesToCache(guesses: Cell[][]) {
    localStorage.setItem('guesses', JSON.stringify(guesses));
  }

  saveKeyboardStatus(keyboard: Cell[]) {
    localStorage.setItem('keyboardStatus', JSON.stringify(keyboard));
  }

  get guessesFromCache(): Cell[][] | null {
    const guesses = localStorage.getItem('guesses');
    return guesses ? JSON.parse(guesses) : null;
  }

  get gameState(): Solution | null {
    const solution = localStorage.getItem('solution');
    return solution ? JSON.parse(solution) : null;
  }

  get keyboardStatus(): Cell[] | null {
    const keyboardStatus = localStorage.getItem('keyboardStatus');
    return keyboardStatus ? JSON.parse(keyboardStatus) : null;
  }

  clear() {
    localStorage.removeItem('guesses');
    localStorage.removeItem('solution');
    localStorage.removeItem('keyboardStatus');
  }
}
