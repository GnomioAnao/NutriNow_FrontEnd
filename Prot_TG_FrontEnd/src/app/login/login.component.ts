import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

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

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  credenciais = {
    email: '',
    senha: ''
  };

  mensagem = '';
  erro = '';

  constructor(private http: HttpClient) {}

  login(): void {
    this.mensagem = '';
    this.erro = '';

    this.http.post('http://localhost:5000/login', this.credenciais).subscribe({
      next: (res: any) => {
        this.mensagem = res.message || 'Login realizado com sucesso!';
      },
      error: (err) => {
        this.erro = err.error?.error || 'Erro ao realizar login';
      }
    });
  }
}
