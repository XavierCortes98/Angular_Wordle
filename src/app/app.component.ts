import { Component, HostListener } from '@angular/core';
import { Cell } from './models/cell.model';
import wordList from 'an-array-of-spanish-words';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }), // Empieza invisible
        animate('0.3s', style({ opacity: 1 })), // Se desvanece a visible
      ]),
    ]),
  ],
})
export class AppComponent {
  private words: Set<string>;

  MAX_GUESSES = 5;
  title = 'wordle';
  wordSolution = 'Arroz';
  errorMsg = '';

  attemptIndex = 0;
  guessColumn = 0;
  wordCount = 5;
  guesses: Cell[][] = [];

  constructor() {
    this.words = new Set(wordList);

    this.initMatrix();
  }

  initMatrix() {
    for (let i = 0; i < this.MAX_GUESSES; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < this.wordCount; j++) {
        row.push({ color: '', letter: '' });
      }
      this.guesses.push(row);
    }
  }

  row1 = 'QWERTYUIOP'.split('');
  row2 = 'ASDFGHJKLÑ'.split('');
  row3 = 'ZXCVBNM'.split('');

  addLetter(letter: string) {
    if (this.guessColumn >= this.wordCount) {
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
    if (this.guessColumn < this.wordCount) {
      this.guesses[this.attemptIndex][this.guessColumn].color = '';
    }

    this.guessColumn = Math.max(this.guessColumn - 1, 0);
    this.guesses[this.attemptIndex][this.guessColumn] = {
      color: 'focusCell',
      letter: '',
    };
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key.toUpperCase();

    // Verificar si la tecla presionada es una letra que existe en el teclado
    if (this.isValidKey(key)) {
      this.addLetter(key);
    }

    // Si se presiona la tecla "Backspace"
    if (event.key === 'Backspace') {
      this.removeLetter();
    }

    // Si se presiona "Enter"
    if (event.key === 'Enter') {
      this.enter();
    }
  }

  isValidKey(key: string): boolean {
    return (
      this.row1.includes(key) ||
      this.row2.includes(key) ||
      this.row3.includes(key)
    );
  }

  get currentWord(): string {
    return this.guesses[this.attemptIndex].map((cell) => cell.letter).join('');
  }

  enter() {
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
    this.guessColumn = 0;
    return result;
  }
}
