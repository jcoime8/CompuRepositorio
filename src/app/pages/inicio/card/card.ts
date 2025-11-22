import { Component, Input, input } from '@angular/core';
import { pcs } from '../interface/computadora';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {
  @Input() computadora: pcs | undefined;
}
