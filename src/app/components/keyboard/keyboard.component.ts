import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Cell } from 'src/app/models/cell.model';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent implements OnChanges {
  @Output() letterClicked = new EventEmitter<string>();
  @Output() enterClicked = new EventEmitter<void>();
  @Output() backspaceClicked = new EventEmitter<void>();
  @Input() keyboardColors: Cell[] = [];

  row1: Cell[] = [
    { letter: 'Q', color: '' },
    { letter: 'W', color: '' },
    { letter: 'E', color: '' },
    { letter: 'R', color: '' },
    { letter: 'T', color: '' },
    { letter: 'Y', color: '' },
    { letter: 'U', color: '' },
    { letter: 'I', color: '' },
    { letter: 'O', color: '' },
    { letter: 'P', color: '' },
  ];
  row2: Cell[] = [
    { letter: 'A', color: '' },
    { letter: 'S', color: '' },
    { letter: 'D', color: '' },
    { letter: 'F', color: '' },
    { letter: 'G', color: '' },
    { letter: 'H', color: '' },
    { letter: 'J', color: '' },
    { letter: 'K', color: '' },
    { letter: 'L', color: '' },
    { letter: 'Ñ', color: '' },
  ];

  row3: Cell[] = [
    { letter: 'Z', color: '' },
    { letter: 'X', color: '' },
    { letter: 'C', color: '' },
    { letter: 'V', color: '' },
    { letter: 'B', color: '' },
    { letter: 'N', color: '' },
    { letter: 'M', color: '' },
  ];

  ngOnChanges(): void {
    if (this.keyboardColors.length > 0) this.updateKeyboardColors();
    else this.resetKeyboardColors();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    const key = event.key.toUpperCase();

    if (this.isValidKey(key)) {
      this.addLetter(key);
    }

    if (event.key === 'Backspace') {
      this.removeLetter();
    }

    if (event.key === 'Enter') {
      this.enter();
    }
    (document.activeElement as HTMLElement)?.blur();
  }

  isValidKey(key: string): boolean {
    return (
      this.row1.some((cell) => cell.letter === key) ||
      this.row2.some((cell) => cell.letter === key) ||
      this.row3.some((cell) => cell.letter === key)
    );
  }

  addLetter(letter: string) {
    this.letterClicked.emit(letter);
  }

  enter() {
    this.enterClicked.emit();
  }

  removeLetter() {
    this.backspaceClicked.emit();
  }

  updateKeyboardColors(): void {
    this.keyboardColors.forEach(({ letter, color }) => {
      [this.row1, this.row2, this.row3].forEach((row) => {
        const cell = row.find((c) => c.letter === letter);
        if (cell) {
          cell.color = color;
        }
      });
    });
  }

  resetKeyboardColors(): void {
    [this.row1, this.row2, this.row3].forEach((row) => {
      row.forEach((cell) => {
        cell.color = '';
      });
    });
  }
}
