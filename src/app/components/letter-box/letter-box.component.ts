import { Component, Input } from '@angular/core';
import { Cell } from 'src/app/models/cell.model';

@Component({
  selector: 'app-letter-box',
  templateUrl: './letter-box.component.html',
  styleUrls: ['./letter-box.component.scss'],
})
export class LetterBoxComponent {
  @Input() cell: Cell = {
    letter: '',
    color: '',
  };
}
