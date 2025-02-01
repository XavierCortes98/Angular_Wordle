import { Component } from '@angular/core';
import { Cell } from 'src/app/models/cell.model';
import { StoreInfoService } from '../../services/store-info.service';
import { WordService } from 'src/app/services/word.service';
import { Solution } from 'src/app/models/solution.model';
import { lastValueFrom } from 'rxjs';
import { MAX_GUESSES, WORD_COUNT } from 'src/app/constants';

@Component({
  selector: 'app-game-component',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent {
  solution: Solution = { solutionWord: '', endGame: false };
  headMsg = '';

  attemptIndex = 0;
  guessColumn = 0;
  guesses: Cell[][] = [];

  keyboardColors: Cell[] = [];

  constructor(
    private storeInfoService: StoreInfoService,
    private wordService: WordService
  ) {
    this.initGame();
  }

  initGame() {
    const storedSolution = this.storeInfoService.gameState;
    const cachedGuesses = this.storeInfoService.guessesFromCache;
    const cachedKeyboardColors = this.storeInfoService.keyboardStatus;

    if (storedSolution?.solutionWord) {
      this.solution = storedSolution;
      this.guesses = cachedGuesses || this.createEmptyBoard();
      this.attemptIndex = this.filledRows;
      this.keyboardColors = cachedKeyboardColors || [];
    } else {
      this.startNewGame();
    }
  }

  startNewGame() {
    this.solution = { solutionWord: '', endGame: false };
    this.keyboardColors = [];
    this.attemptIndex = 0;
    this.guessColumn = 0;
    this.headMsg = '';
    this.setNewWord();
    this.storeInfoService.clear();
    this.guesses = this.createEmptyBoard();
  }

  private setNewWord() {
    this.wordService.getWord().subscribe((word) => {
      this.solution.solutionWord = word;
      this.solution.endGame = false;
      this.storeInfoService.saveGameState(this.solution);
      console.log('solution: ', this.solution);
    });
  }

  private createEmptyBoard(): Cell[][] {
    return Array.from({ length: MAX_GUESSES }, () =>
      Array.from({ length: WORD_COUNT }, () => ({ letter: '', color: '' }))
    );
  }

  get currentWord(): string {
    return this.guesses[this.attemptIndex].map((cell) => cell.letter).join('');
  }

  get filledRows(): number {
    return this.guesses.filter((row) => row.every((cell) => cell.letter !== ''))
      .length;
  }

  addLetter(letter: string) {
    if (this.guessColumn >= WORD_COUNT || this.solution.endGame) {
      return;
    }

    this.guesses[this.attemptIndex][this.guessColumn].color = '';

    this.guesses[this.attemptIndex][this.guessColumn] = {
      color: '',
      letter: letter,
    };

    this.guessColumn++;
    if (this.guessColumn < WORD_COUNT) {
      this.guesses[this.attemptIndex][this.guessColumn].color = 'focusCell';
    }
  }

  removeLetter() {
    if (this.solution.endGame) {
      return;
    }

    if (this.guessColumn < WORD_COUNT) {
      this.guesses[this.attemptIndex][this.guessColumn].color = '';
    }

    this.guessColumn = Math.max(this.guessColumn - 1, 0);
    this.guesses[this.attemptIndex][this.guessColumn] = {
      color: 'focusCell',
      letter: '',
    };
  }

  async enter() {
    if (this.solution.endGame) {
      console.log('endgame');
      return;
    }

    if (this.guessColumn < WORD_COUNT) {
      return;
    }

    const isValid = await this.validateWord(this.currentWord.toLowerCase());

    if (!isValid) {
      this.headMsg = 'Word not exists';
      return;
    }

    this.headMsg = '';

    const newRow = [...this.validateAnswer()];
    this.guesses[this.attemptIndex] = newRow;
    this.attemptIndex++;

    this.guessColumn = 0;
    this.storeInfoService.saveGuessesToCache(this.guesses);
    this.storeInfoService.saveKeyboardStatus(this.keyboardColors);
  }

  validateWord(word: string): Promise<boolean> {
    return lastValueFrom(this.wordService.checkWord(word));
  }

  validateAnswer(): Cell[] {
    const guessArr = this.guesses[this.attemptIndex]
      .map((cell) => cell.letter)
      .join('')
      .toUpperCase()
      .split('');
    const solutionArr = this.solution.solutionWord.toUpperCase().split('');
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

    if (points === WORD_COUNT) {
      this.solution.endGame = true;
      this.storeInfoService.saveGameState(this.solution);
      this.headMsg = 'Has ganado';
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

    this.guessColumn = 0;

    if (this.attemptIndex >= MAX_GUESSES - 1) {
      this.solution.endGame = true;
      this.headMsg =
        'Has perdido, la solucion era: ' + this.solution.solutionWord;
      this.storeInfoService.saveGameState(this.solution);
    }
    this.keyboardColors = result;
    return result;
  }

  clear() {
    this.startNewGame();
  }
}
