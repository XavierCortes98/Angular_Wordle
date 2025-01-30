import { Component, Input } from '@angular/core';
import { Cell } from 'src/app/models/cell.model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent {
  @Input() guesses: Cell[][] = [];
}
