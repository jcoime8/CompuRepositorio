import { Component, OnInit } from '@angular/core';
import { pcs } from './interface/computadora';
import { Computadora } from './services/computadora';
import { Card } from "./card/card";
import { ChatBot } from "./chat-bot/chat-bot";

@Component({
  selector: 'app-inicio',
  imports: [Card, ChatBot],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  computadoras:pcs | undefined;

  constructor(
    private computadorService:Computadora
  ){}

  ngOnInit(): void {
    this.computadorService.getcomputadoras().subscribe(data=>{
      this.computadoras = data
    })
  }
  

}
