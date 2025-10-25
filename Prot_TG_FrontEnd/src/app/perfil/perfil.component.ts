import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Import necessário para ngModel
import { CommonModule } from '@angular/common'; // ✅ Necessário para *ngIf e outros

@Component({
  selector: 'app-perfil',
  standalone: true, // ✅ indica que é um componente standalone
  imports: [CommonModule, FormsModule], // ✅ módulos que o template usa
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent {
  // Dados do perfil
  nome: string = 'Nome do Usuário';
  foto: string = 'U';
  email: string = 'usuario@email.com';
  dataNascimento: string = '--/--/----';
  meta: string = 'Não definida';
  alturaPeso: string = '-- / --';

  // Controle do modal
  mostrarModal: boolean = false;

  // Inputs temporários
  nomeInput: string = '';
  emailInput: string = '';
  dataInput: string = '';
  metaInput: string = '';
  alturaInput: string = '';
  pesoInput: string = '';

  abrirModal(): void {
    this.mostrarModal = true;
    this.nomeInput = this.nome;
    this.emailInput = this.email;
    this.dataInput = this.dataNascimento;
    this.metaInput = this.meta;

    const [altura, peso] = this.alturaPeso.split(' / ');
    this.alturaInput = altura.replace('m', '').trim();
    this.pesoInput = peso.replace('kg', '').trim();
  }

  fecharModal(): void {
    this.mostrarModal = false;
  }

  salvarPerfil(): void {
    if (this.nomeInput.trim()) {
      this.nome = this.nomeInput.trim();

      // Gera iniciais
      const nomes = this.nome.split(' ').filter(n => n.length > 0);
      if (nomes.length >= 2) {
        this.foto = (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
      } else {
        this.foto = nomes[0][0].toUpperCase();
      }
    }

    if (this.emailInput.trim()) this.email = this.emailInput.trim();
    if (this.dataInput.trim()) this.dataNascimento = this.dataInput.trim();
    if (this.metaInput.trim()) this.meta = this.metaInput.trim();

    if (this.alturaInput.trim() && this.pesoInput.trim()) {
      this.alturaPeso = `${this.alturaInput}m / ${this.pesoInput}kg`;
    }

    this.fecharModal();
  }

  excluirConta(): void {
    if (confirm('Tem certeza que deseja excluir a conta?')) {
      this.nome = 'Nome do Usuário';
      this.foto = 'U';
      this.email = 'usuario@email.com';
      this.dataNascimento = '--/--/----';
      this.meta = 'Não definida';
      this.alturaPeso = '-- / --';
      alert('Conta excluída');
    }
  }
}
