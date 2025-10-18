import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service'; // importa o AuthService

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent {

  showPassword = false;

  credenciais = {
    email: '',
    senha: ''
  };

  mensagem = '';
  erro = '';

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService // injeta o AuthService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(event?: Event): void {
    if (event) event.preventDefault(); // evita reload de página

    this.mensagem = '';
    this.erro = '';

    this.http.post('http://localhost:8000/login', this.credenciais).subscribe({
      next: (res: any) => {
        console.log('Resposta do backend:', res);

        if (res && res.user) {
          // Armazena usuário no AuthService
          this.authService.login(res.user);

          this.mensagem = res.message || 'Login realizado com sucesso!';

          // Redireciona para o chatbot
          setTimeout(() => {
            this.router.navigate(['/chatbot']);
          }, 300);
        } else {
          this.erro = 'Usuário ou senha incorretos';
        }
      },
      error: (err) => {
        console.error('Erro no login:', err);
        this.erro = err.error?.error || 'Erro ao realizar login';
      }
    });
  }
}
