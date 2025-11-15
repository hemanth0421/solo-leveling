import { useState } from 'react';
import { awardXP, applyPenalty } from '../utils/gameLogic';
import { saveUserData } from '../utils/storage';

export default function Todos({ userData, updateUserData, addNotification }) {
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoXP, setNewTodoXP] = useState(20);
  const [newTodoPenalty, setNewTodoPenalty] = useState(0);

  const handleTodoComplete = (todoId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      const todo = updated.todos.find(t => t.id === todoId);
      
      if (todo && !todo.completed) {
        todo.completed = true;
        
        if (todo.xpReward > 0) {
          const result = awardXP(updated, todo.xpReward, {});
          Object.assign(updated, result);
          
          updated.logs = updated.logs || [];
          updated.logs.unshift({
            timestamp: new Date().toISOString(),
            type: 'TODO_COMPLETE',
            message: `Completed: ${todo.text}`,
            deltaXP: result.xpGained,
          });
          
          addNotification({
            timestamp: new Date().toISOString(),
            type: 'ALERT',
            message: `Completed: ${todo.text}`,
            deltaXP: result.xpGained,
          });
        }
      }
      
      saveUserData(updated);
      return updated;
    });
  };

  const handleAddTodo = () => {
    if (!newTodoText.trim()) return;
    
    updateUserData(prev => {
      const updated = { ...prev };
      updated.todos = updated.todos || [];
      updated.todos.push({
        id: `todo-${Date.now()}`,
        text: newTodoText,
        xpReward: parseInt(newTodoXP) || 20,
        penaltyIfMissed: parseInt(newTodoPenalty) || 0,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      saveUserData(updated);
      return updated;
    });
    
    setNewTodoText('');
    setNewTodoXP(20);
    setNewTodoPenalty(0);
    setShowAddTodo(false);
  };

  const handleDeleteTodo = (todoId) => {
    updateUserData(prev => {
      const updated = { ...prev };
      updated.todos = (updated.todos || []).filter(t => t.id !== todoId);
      saveUserData(updated);
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neon-blue">To-Do List</h2>
        <button
          onClick={() => setShowAddTodo(!showAddTodo)}
          className="px-4 py-2 bg-neon-blue text-navy-dark rounded-lg hover:bg-neon-blue-dark transition-colors text-sm font-semibold"
        >
          {showAddTodo ? 'Cancel' : '+ Add Todo'}
        </button>
      </div>

      {showAddTodo && (
        <div className="bg-gray-900/50 rounded-lg border border-neon-blue/20 p-6">
          <h3 className="text-lg font-semibold text-neon-blue mb-4">Add New Todo</h3>
          <div className="space-y-3">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Todo text"
              className="w-full px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={newTodoXP}
                onChange={(e) => setNewTodoXP(e.target.value)}
                placeholder="XP Reward"
                className="px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
              />
              <input
                type="number"
                value={newTodoPenalty}
                onChange={(e) => setNewTodoPenalty(e.target.value)}
                placeholder="Penalty if missed"
                className="px-3 py-2 bg-gray-800 border border-neon-blue/30 rounded text-white"
              />
            </div>
            <button
              onClick={handleAddTodo}
              className="w-full px-4 py-2 bg-neon-blue text-navy-dark rounded hover:bg-neon-blue-dark transition-colors font-semibold"
            >
              Add Todo
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {userData.todos && userData.todos.length > 0 ? (
          userData.todos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border ${
                todo.completed
                  ? 'border-green-500/30 bg-green-500/5'
                  : 'border-neon-blue/20'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={todo.completed || false}
                  onChange={() => handleTodoComplete(todo.id)}
                  className="w-5 h-5 text-neon-blue rounded focus:ring-neon-blue"
                />
                <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                  {todo.text}
                </span>
                {todo.xpReward > 0 && (
                  <span className="text-sm text-neon-blue">+{todo.xpReward} XP</span>
                )}
                {todo.penaltyIfMissed > 0 && (
                  <span className="text-xs text-red-400">-{todo.penaltyIfMissed} if missed</span>
                )}
              </div>
              <button
                onClick={() => handleDeleteTodo(todo.id)}
                className="ml-2 px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">No todos yet</p>
        )}
      </div>
    </div>
  );
}

