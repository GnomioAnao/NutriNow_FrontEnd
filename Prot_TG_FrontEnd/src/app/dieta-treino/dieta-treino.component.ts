import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Item {
  id: number;
  title: string;
  description: string;
  time?: string;
}

@Component({
  selector: 'app-dieta-treino',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dieta-treino.component.html',
  styleUrls: ['./dieta-treino.component.css']
})
export class DietaTreinoComponent {
  activeTab: 'treinos' | 'dietas' = 'treinos';
  workouts: Item[] = [];
  meals: Item[] = [];
  editingItem: Item | null = null;

  // Modal controls
  mostrarModal = false;
  inputTitle = '';
  inputDescription = '';
  inputTime = '';

  // --- Métodos de abas ---
  switchTab(tab: 'treinos' | 'dietas') {
    this.activeTab = tab;
    this.editingItem = null;
  }

  // --- Modal ---
  openModal() {
    this.mostrarModal = true;
    this.clearForm();
  }

  closeModal() {
    this.mostrarModal = false;
    this.clearForm();
    this.editingItem = null;
  }

  clearForm() {
    this.inputTitle = '';
    this.inputDescription = '';
    this.inputTime = '';
  }

  get modalTitle() {
    const action = this.editingItem ? 'Editar' : 'Adicionar';
    const type = this.activeTab === 'treinos' ? 'Treino' : 'Refeição';
    return `${action} ${type}`;
  }

  get buttonText() {
    return this.editingItem ? 'Atualizar' : 'Adicionar';
  }

  // --- Adicionar / Editar ---
  handleSubmit() {
    const title = this.inputTitle.trim();
    const description = this.inputDescription.trim();
    const time = this.inputTime.trim();

    if (!title || !description) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (this.editingItem) {
      this.updateItem(title, description, time);
    } else {
      this.addItem(title, description, time);
    }

    this.closeModal();
  }

  addItem(title: string, description: string, time: string) {
    const newItem: Item = { id: Date.now(), title, description, time };

    if (this.activeTab === 'treinos') {
      this.workouts.push(newItem);
    } else {
      this.meals.push(newItem);
    }
  }

  updateItem(title: string, description: string, time: string) {
    if (!this.editingItem) return;

    const items = this.activeTab === 'treinos' ? this.workouts : this.meals;
    const index = items.findIndex(item => item.id === this.editingItem!.id);

    if (index !== -1) {
      items[index] = { ...items[index], title, description, time };
    }
  }

  editItem(item: Item) {
    this.editingItem = item;
    this.inputTitle = item.title;
    this.inputDescription = item.description;
    this.inputTime = item.time || '';
    this.mostrarModal = true;
  }

  deleteItem(id: number) {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      if (this.activeTab === 'treinos') {
        this.workouts = this.workouts.filter(w => w.id !== id);
      } else {
        this.meals = this.meals.filter(m => m.id !== id);
      }
    }
  }

  // --- Auxiliares ---
  get currentItems(): Item[] {
    return this.activeTab === 'treinos' ? this.workouts : this.meals;
  }

  get emptyText() {
    return this.activeTab === 'treinos'
      ? 'Nenhum treino cadastrado ainda'
      : 'Nenhuma refeição cadastrada ainda';
  }

  get addButtonText() {
    return this.activeTab === 'treinos' ? 'Adicionar Treino' : 'Adicionar Refeição';
  }
}
