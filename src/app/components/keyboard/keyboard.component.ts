import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
  selector: 'app-keyboard',
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss'],
})
export class KeyboardComponent {
  @Output() letterClicked = new EventEmitter<string>();
  @Output() enterClicked = new EventEmitter<void>();
  @Output() backspaceClicked = new EventEmitter<void>();

  row1: string[] = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  row2: string[] = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'];
  row3: string[] = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

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
  }

  isValidKey(key: string): boolean {
    return (
      this.row1.includes(key) ||
      this.row2.includes(key) ||
      this.row3.includes(key)
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
}
