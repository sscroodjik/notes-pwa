// Получаем элементы
const noteText = document.getElementById('noteText');
const addNoteBtn = document.getElementById('addNote');
const notesList = document.getElementById('notesList');
const status = document.getElementById('status');

// Функция для проверки онлайн/оффлайн состояния
function updateOnlineStatus() {
  if (navigator.onLine) {
    status.style.display = 'none';  // Если онлайн, скрыть статус
  } else {
    status.style.display = 'block'; // Если оффлайн, показать статус
  }
}

// Вешаем обработчики событий на события online и offline
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Выполняем сразу, чтобы проверить текущее состояние
updateOnlineStatus();

// Загрузка заметок при старте
window.onload = () => {
  updateOnlineStatus();
  loadNotes();
};

// Добавление заметки или её редактирование
addNoteBtn.addEventListener('click', () => {
  const text = noteText.value.trim();
  if (text) {
    // Если кнопка "Сохранить" нажата, редактируем заметку
    if (addNoteBtn.textContent === 'Сохранить') {
      const notes = getNotes();
      const note = notes.find(note => note.id === parseInt(noteText.dataset.editId));
      if (note) {
        note.text = text; // Обновляем текст заметки
        saveNotes(notes);
        noteText.value = ''; // Очищаем поле ввода
        addNoteBtn.textContent = 'Добавить'; // Возвращаем текст кнопки на "Добавить"
        loadNotes(); // Обновляем список заметок
      }
    } else {
      // Если кнопка "Добавить", добавляем новую заметку
      const notes = getNotes();
      notes.push({ id: Date.now(), text });
      saveNotes(notes);
      noteText.value = ''; // Очищаем поле ввода
      loadNotes(); // Обновляем список заметок
    }
  }
});

// Получение заметок из localStorage
function getNotes() {
  return JSON.parse(localStorage.getItem('notes')) || [];
}

// Сохранение заметок в localStorage
function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}

// Отображение всех заметок
function loadNotes() {
  const notes = getNotes();
  notesList.innerHTML = '';

  notes.forEach(note => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = note.text;

    // Кнопка редактирования
    const editBtn = document.createElement('button');
    editBtn.textContent = 'Редактировать';
    editBtn.onclick = () => {
      editNote(note.id);
    };

    // Кнопка удаления
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.onclick = () => {
      deleteNote(note.id);
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}

// Редактирование заметки
function editNote(id) {
  const notes = getNotes();
  const note = notes.find(note => note.id === id);
  if (note) {
    noteText.value = note.text; // Заполняем поле ввода текстом заметки
    addNoteBtn.textContent = 'Сохранить'; // Меняем текст кнопки на "Сохранить"
    noteText.dataset.editId = note.id; // Сохраняем ID заметки в data-атрибуте
  }
}

// Удаление заметки
function deleteNote(id) {
  const notes = getNotes().filter(note => note.id !== id);
  saveNotes(notes);
  loadNotes();
}

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(() => console.log('Service Worker зарегистрирован'))
      .catch(err => console.log('Ошибка Service Worker:', err));
  });
}
