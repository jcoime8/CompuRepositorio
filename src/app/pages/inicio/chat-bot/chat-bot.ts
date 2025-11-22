import { Component, ElementRef, ViewChild } from '@angular/core';
import { Computadora } from '../services/computadora';
import { PC } from '../interface/computadora';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface ChatOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-chat-bot',
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.css'
})
export class ChatBot {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages: { text: string, sender: 'user' | 'bot', timestamp: Date }[] = [];
  isOpen: boolean = false;
  loading: boolean = false;

  pcs: PC[] = [];
  showOptions: boolean = true;
  currentOptions: ChatOption[] = [];

  constructor(private computadoraService: Computadora) { }

  ngOnInit(): void {
    this.cargarComputadoras();

    // Mensaje inicial
    this.addBotMessage('¡Hola! Soy tu asistente virtual. Selecciona una opción para consultar:');

    // Opciones principales
    this.currentOptions = [
      { label: 'Ver por marca', value: 'marca' },
      { label: 'Ver por categoría', value: 'categoria' },
      { label: 'Ver por RAM', value: 'ram' },
      { label: 'Ver por almacenamiento', value: 'almacenamiento' },
      { label: 'Ver por procesador', value: 'procesador' }
    ];
  }

  cargarComputadoras(): void {
    this.computadoraService.getcomputadoras().subscribe({
      next: (data) => this.pcs = data.pcs,
      error: () => this.addBotMessage('Lo siento, estoy teniendo problemas para acceder a la información de productos.')
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  selectOption(option: ChatOption): void {
    this.addUserMessage(option.label);
    this.showOptions = false;
    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.handleOption(option.value);
    }, 500);
  }

  handleOption(optionValue: string): void {
    switch (optionValue) {
      case 'marca':
        this.addBotMessage('Selecciona la marca que deseas consultar:');
        this.currentOptions = [
          { label: 'Dell', value: 'dell' },
          { label: 'Apple', value: 'apple' },
          { label: 'Lenovo', value: 'lenovo' },
          { label: 'ASUS', value: 'asus' },
          { label: 'Acer', value: 'acer' },
          { label: 'MSI', value: 'msi' },
          { label: 'HP', value: 'hp' }
        ];
        this.showOptions = true;
        break;

      case 'categoria':
        this.addBotMessage('Selecciona la categoría:');
        this.currentOptions = [
          { label: 'Ultrabook', value: 'ultrabook' },
          { label: 'Gaming', value: 'gaming' },
          { label: 'Profesional', value: 'profesional' },
          { label: 'Business', value: 'business' },
          { label: 'Básico', value: 'básico' }
        ];
        this.showOptions = true;
        break;

      case 'ram':
        this.addBotMessage('Selecciona la cantidad de RAM:');
        this.currentOptions = [
          { label: '8GB', value: '8' },
          { label: '16GB', value: '16' }
        ];
        this.showOptions = true;
        break;

      case 'almacenamiento':
        this.addBotMessage('Selecciona el almacenamiento:');
        this.currentOptions = [
          { label: '256GB', value: '256' },
          { label: '512GB', value: '512' },
          { label: '1TB', value: '1000' }
        ];
        this.showOptions = true;
        break;

      case 'procesador':
        this.addBotMessage('Selecciona el tipo de procesador:');
        this.currentOptions = [
          { label: 'Intel', value: 'intel' },
          { label: 'AMD', value: 'amd' },
          { label: 'Apple', value: 'apple' }
        ];
        this.showOptions = true;
        break;

      default:
        this.respondWithFilter(optionValue);
        break;
    }
  }

  private addBotMessageHtml(html: string): void {
    this.messages.push({ text: html, sender: 'bot', timestamp: new Date() });
    this.scrollToBottom();
  }


  respondWithFilter(value: string): void {
    let filteredPcs: PC[] = [];

    if (['dell', 'apple', 'lenovo', 'asus', 'acer', 'msi', 'hp'].includes(value)) {
      filteredPcs = this.pcs.filter(pc => pc.marca.toLowerCase() === value);
    } else if (['ultrabook', 'gaming', 'profesional', 'business', 'básico'].includes(value)) {
      filteredPcs = this.pcs.filter(pc => pc.categoria.toLowerCase() === value);
    } else if (['8', '16'].includes(value)) {
      filteredPcs = this.pcs.filter(pc => pc.ram === parseInt(value));
    } else if (['256', '512', '1000'].includes(value)) {
      filteredPcs = this.pcs.filter(pc => pc.almacenamiento === parseInt(value));
    } else if (['intel', 'amd', 'apple'].includes(value)) {
      filteredPcs = this.pcs.filter(pc => pc.procesador.toLowerCase().includes(value));
    }

    if (filteredPcs.length > 0) {
      // Crear tarjetas HTML
      let responseHtml = filteredPcs.map(pc => `
        <div class="card mb-3 pc-card" style="max-width: 540px;">
          <div class="row g-0">
            <div class="col-md-4">
              <img src="${pc.imagenUrl}" class="img-fluid rounded-start imagenMess" alt="${pc.marca} ${pc.modelo}">
            </div>
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${pc.marca} ${pc.modelo}</h5>
                <p class="card-text"><strong>Procesador:</strong> ${pc.procesador}</p>
                <p class="card-text"><strong>RAM:</strong> ${pc.ram}GB</p>
                <p class="card-text"><strong>Almacenamiento:</strong> ${pc.almacenamiento}GB SSD</p>
                <p class="card-text"><strong>Categoría:</strong> ${pc.categoria}</p>
              </div>
            </div>
          </div>
        </div>
      `).join('');

      this.addBotMessageHtml(responseHtml);
    } else {
      this.addBotMessage('No encontramos resultados para esa opción.');
    }

    // Volver a menú principal
    this.currentOptions = [
      { label: 'Ver por marca', value: 'marca' },
      { label: 'Ver por categoría', value: 'categoria' },
      { label: 'Ver por RAM', value: 'ram' },
      { label: 'Ver por almacenamiento', value: 'almacenamiento' },
      { label: 'Ver por procesador', value: 'procesador' }
    ];
    this.showOptions = true;
  }

  private addUserMessage(text: string): void {
    this.messages.push({ text, sender: 'user', timestamp: new Date() });
    this.scrollToBottom();
  }

  private addBotMessage(text: string): void {
    this.messages.push({ text, sender: 'bot', timestamp: new Date() });
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }, 100);
    } catch (err) { }
  }
}
