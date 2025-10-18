import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  login(event?: Event): void {
    if (event) event.preventDefault();

    this.mensagem = '';
    this.erro = '';

    this.http.post('http://127.0.0.1:8000/login', this.credenciais, {
      withCredentials: true // ✅ essencial para cookies de sessão
    }).subscribe({
      next: (res: any) => {
        console.log('Resposta do backend:', res);

        if (res && res.user) {
          this.authService.login(res.user);
          this.mensagem = res.message || 'Login realizado com sucesso!';

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
