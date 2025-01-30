import { Component } from '@angular/core';
import { Cell } from 'src/app/models/cell.model';
import wordList from 'an-array-of-spanish-words';
import { StoreInfoService } from '../services/store-info.service';
@Component({
  selector: 'app-game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  private words: Set<string>;
  private endGame = false;

  MAX_GUESSES = 5;
  title = 'wordle';
  wordSolution = 'Arroz';
  errorMsg = '';

  attemptIndex = 0;
  guessColumn = 0;
  wordCount = 5;
  guesses: Cell[][] = [];

  constructor(private storeInfoService: StoreInfoService) {
    this.words = new Set(wordList);

    const cachedGuesses = this.storeInfoService.guessesFromCache;
    if (cachedGuesses) {
      this.guesses = cachedGuesses;
      this.attemptIndex = this.filledRows;
    } else {
      this.initMatrix();
    }
  }

  get currentWord(): string {
    return this.guesses[this.attemptIndex].map((cell) => cell.letter).join('');
  }

  get filledRows(): number {
    return this.guesses.filter((row) => row.every((cell) => cell.letter !== ''))
      .length;
  }

  initMatrix() {
    this.guesses = [];
    for (let i = 0; i < this.MAX_GUESSES; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < this.wordCount; j++) {
        row.push({ color: '', letter: '' });
      }
      this.guesses.push(row);
    }
  }

  addLetter(letter: string) {
    if (this.guessColumn >= this.wordCount || this.endGame) {
      return;
    }

    this.guesses[this.attemptIndex][this.guessColumn].color = '';

    this.guesses[this.attemptIndex][this.guessColumn] = {
      color: '',
      letter: letter,
    };

    this.guessColumn++;
    if (this.guessColumn < this.wordCount) {
      this.guesses[this.attemptIndex][this.guessColumn].color = 'focusCell';
    }
  }

  removeLetter() {
    if (this.endGame) {
      return;
    }

    if (this.guessColumn < this.wordCount) {
      this.guesses[this.attemptIndex][this.guessColumn].color = '';
    }

    this.guessColumn = Math.max(this.guessColumn - 1, 0);
    this.guesses[this.attemptIndex][this.guessColumn] = {
      color: 'focusCell',
      letter: '',
    };
  }

  enter() {
    if (this.endGame) {
      console.log('endgame');
      return;
    }

    if (this.guessColumn < this.wordCount) {
      this.errorMsg = 'Too short';
      return;
    }

    if (!this.validateWord(this.currentWord.toLowerCase())) {
      this.errorMsg = 'Word not exists';
      return;
    }

    this.errorMsg = '';
    this.guesses[this.attemptIndex] = this.validateAnswer();
    console.log('guesses', this.guesses);
    this.storeInfoService.saveGuessesToCache(this.guesses);
  }

  validateWord(word: string) {
    return this.words.has(word);
  }

  validateAnswer(): Cell[] {
    const guessArr = this.guesses[this.attemptIndex]
      .map((cell) => cell.letter)
      .join('')
      .toUpperCase()
      .split('');

    const solutionArr = this.wordSolution.toUpperCase().split('');
    const solutionCopy = [...solutionArr];

    const result: Cell[] = [];

    let points = 0;

    guessArr.forEach((letter, index) => {
      if (letter === solutionArr[index]) {
        result.push({ letter, color: 'correctLetter' });
        points++;
        solutionCopy[index] = null as any;
      } else {
        result.push({ letter, color: 'absentLetter' });
      }
    });

    if (points === 5) {
      this.endGame = true;
      this.storeInfoService.setGameState(true);
      this.errorMsg = 'Has ganado';
    }

    result.forEach((entry, index) => {
      if (
        entry.color === 'absentLetter' &&
        solutionCopy.includes(entry.letter)
      ) {
        entry.color = 'presentLetter';
        solutionCopy[solutionCopy.indexOf(entry.letter)] = null as any;
      }
    });

    this.attemptIndex++;
    console.log('intento: ', this.attemptIndex);
    this.guessColumn = 0;

    if (this.attemptIndex >= 5) {
      this.endGame = true;
      this.errorMsg = 'you lose';
      this.storeInfoService.setGameState(true);
    }
    return result;
  }

  clear() {
    this.attemptIndex = 0;
    this.guessColumn = 0;

    this.endGame = false;
    this.initMatrix();
    this.storeInfoService.clear();
  }
}
