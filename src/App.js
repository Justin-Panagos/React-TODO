import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './App.css';

function SortableTodo({ todo, index, onToggle }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between p-2 bg-gray-700 rounded mb-2"
    >
      <div className="flex items-center">
        <span {...listeners} className="drag-handle mr-2 text-primary">
          ☰
        </span>
        <span className="ml-2" style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
          {todo.text}
        </span>
      </div>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="checkbox checkbox-xl checkbox-primary "
      />
    </li>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const addTodo = () => {
    if (inputValue.trim() === '') return;
    setTodos([...todos, { id: Date.now().toString(), text: inputValue, completed: false }]);
    setInputValue('');
  };

  const onToggle = (id) => {
    setTodos((todos) =>
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const isUndone = !todos.find((todo) => todo.id === active.id)?.completed;
    const isOverUndone = !todos.find((todo) => todo.id === over.id)?.completed;
    if (isUndone !== isOverUndone) return; // Prevent dragging between done and undone

    const oldIndex = todos.findIndex((todo) => todo.id === active.id);
    const newIndex = todos.findIndex((todo) => todo.id === over.id);
    setTodos((todos) => arrayMove(todos, oldIndex, newIndex));
  };

  const undoneTodos = todos.filter((todo) => !todo.completed);
  const doneTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-300 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl resizable-card">
        <div className="card-body">
          <h1 className="card-title text-3xl  font-bold text-center">Todo App</h1>
          <div className="form-control">
            <div className="input-group flex">
              <input
                id="id_todo_input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add a todo"
                className="input input-bordered w-full"
              />
              <button onClick={addTodo} className="btn btn-primary w-40">
                Add
              </button>
            </div>
          </div>
          <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
            <SortableContext items={undoneTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
              <ul className="mt-4 space-y-2">
                <div class="divider divider-start">Undone Todos</div>
                {undoneTodos.map((todo, index) => (
                  <SortableTodo key={todo.id} todo={todo} index={index} onToggle={onToggle} />
                ))}
              </ul>
            </SortableContext>
            <SortableContext items={doneTodos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
              <ul className="mt-4 space-y-2">
                <div class="divider divider-start">Done Todos</div>
                {doneTodos.map((todo, index) => (
                  <SortableTodo key={todo.id} todo={todo} index={index} onToggle={onToggle} />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
}

export default App;