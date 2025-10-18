import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../services/auth.service';
import { ChatService, ChatResponse } from './../services/chat.service';
import { Subscription } from 'rxjs';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  currentMessage = '';
  currentUser: User | null = null;
  loading = false;
  private subscription = new Subscription();
  private sessionId: string | null = null;

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  constructor(
    private authService: AuthService,
    private chatService: ChatService,
    private router: Router
  ) {}

  ngOnInit() {
    // Autenticação
    this.subscription.add(
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (!user) {
          this.router.navigate(['/login']);
        }
      })
    );

    // Recupera ou gera sessionId
    this.sessionId = this.chatService.getSessionId();
    if (!this.sessionId) {
      this.sessionId = this.generateSessionId();
      this.chatService.setSessionId(this.sessionId);
    }

    // Carrega histórico do chat
    this.loadChatHistory();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private generateSessionId(): string {
    const existing = localStorage.getItem('nutrinow_session_id');
    if (existing) return existing;

    const sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('nutrinow_session_id', sid);
    return sid;
  }

  private loadChatHistory() {
    if (!this.sessionId) return;

    this.chatService.getChatHistory(this.sessionId).subscribe({
      next: (response) => {
        if (response.success && response.history?.length > 0) {
          this.messages = response.history.map(msg => ({
            text: msg.content,
            isUser: msg.role === 'user',
            timestamp: new Date()
          }));
          this.scrollToBottom();
        }
      },
      error: (err) => console.error('Erro ao carregar histórico:', err)
    });
  }

  sendMessage() {
    if (!this.currentMessage.trim() || this.loading) return;

    const userMessage: Message = {
      text: this.currentMessage,
      isUser: true,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const messageText = this.currentMessage;
    this.currentMessage = '';
    this.loading = true;
    this.scrollToBottom();

    this.chatService.sendMessage(messageText).subscribe({
      next: (response: ChatResponse) => {
        this.loading = false;
        if (response.success) {
          this.chatService.setSessionId(response.session_id);
          const botMessage: Message = {
            text: response.response,
            isUser: false,
            timestamp: new Date()
          };
          this.messages.push(botMessage);
        } else {
          this.messages.push({
            text: response.error || 'Erro ao enviar mensagem',
            isUser: false,
            timestamp: new Date()
          });
        }
        this.scrollToBottom();
      },
      error: () => {
        this.loading = false;
        this.messages.push({
          text: 'Erro de conexão com o servidor',
          isUser: false,
          timestamp: new Date()
        });
        this.scrollToBottom();
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const userMessage: Message = {
      text: `📸 Imagem enviada: ${file.name}`,
      isUser: true,
      timestamp: new Date()
    };
    this.messages.push(userMessage);
    this.loading = true;
    this.scrollToBottom();

    this.chatService.analyzeImage(file, this.sessionId!).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          const botMessage: Message = {
            text: response.response,
            isUser: false,
            timestamp: new Date()
          };
          this.messages.push(botMessage);
        } else {
          this.messages.push({
            text: response.error || 'Erro ao analisar a imagem',
            isUser: false,
            timestamp: new Date()
          });
        }
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Erro ao enviar imagem:', err);
        this.loading = false;
        this.messages.push({
          text: 'Erro ao enviar imagem.',
          isUser: false,
          timestamp: new Date()
        });
        this.scrollToBottom();
      }
    });
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.messagesContainer?.nativeElement) {
        this.messagesContainer.nativeElement.scrollTop =
          this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  logout() {
    // Apenas limpa o usuário local e redireciona
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
