'use client';

import { useState, useEffect } from 'react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  category: 'work' | 'personal' | 'project';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId?: number;
}

interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
}

interface RoadmapItem {
  id: number;
  title: string;
  description: string;
  status: 'planned' | 'in-progress' | 'completed';
  targetDate?: string;
  projectId?: number;
  priority: 'low' | 'medium' | 'high';
}

export default function TodoPage() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'Personal', description: 'Personal tasks and goals', color: 'blue' },
    { id: 2, name: 'Work', description: 'Work-related tasks and projects', color: 'purple' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '', color: 'blue' });
  const [newRoadmapItem, setNewRoadmapItem] = useState<{
    title: string;
    description: string;
    status: 'planned' | 'in-progress' | 'completed';
    targetDate: string;
    projectId: number;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    description: '',
    status: 'planned',
    targetDate: '',
    projectId: 1,
    priority: 'medium',
  });
  const [activeTab, setActiveTab] = useState<'todos' | 'roadmap' | 'projects'>('todos');
  const [todoPriority, setTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [todoDueDate, setTodoDueDate] = useState('');
  const [todoProjectId, setTodoProjectId] = useState(1);
  const [todoCategory, setTodoCategory] = useState<'work' | 'personal' | 'project'>('personal');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [filterProject, setFilterProject] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'priority' | 'dueDate' | 'title'>('priority');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    const savedRoadmap = localStorage.getItem('roadmap');
    const savedProjects = localStorage.getItem('projects');
    
    if (savedTodos) setTodos(JSON.parse(savedTodos));
    if (savedRoadmap) setRoadmapItems(JSON.parse(savedRoadmap));
    if (savedProjects) setProjects(JSON.parse(savedProjects));
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('roadmap', JSON.stringify(roadmapItems));
  }, [roadmapItems]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          category: todoCategory,
          priority: todoPriority,
          dueDate: todoDueDate || undefined,
          projectId: todoProjectId,
        },
      ]);
      setNewTodo('');
      setTodoDueDate('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const addProject = () => {
    if (newProject.name.trim()) {
      const newProjectItem = {
        id: Date.now(),
        ...newProject,
      };
      setProjects([...projects, newProjectItem]);
      setNewProject({ name: '', description: '', color: 'blue' });
    }
  };

  const deleteProject = (id: number) => {
    setProjects(projects.filter(project => project.id !== id));
    // Update todos and roadmap items to remove references to this project
    setTodos(todos.map(todo => 
      todo.projectId === id ? { ...todo, projectId: undefined } : todo
    ));
    setRoadmapItems(roadmapItems.map(item => 
      item.projectId === id ? { ...item, projectId: undefined } : item
    ));
  };

  const addRoadmapItem = () => {
    if (newRoadmapItem.title.trim()) {
      setRoadmapItems([
        ...roadmapItems,
        {
          id: Date.now(),
          ...newRoadmapItem,
        },
      ]);
      setNewRoadmapItem({
        title: '',
        description: '',
        status: 'planned',
        targetDate: '',
        projectId: 1,
        priority: 'medium',
      });
    }
  };

  const updateRoadmapStatus = (id: number, status: 'planned' | 'in-progress' | 'completed') => {
    setRoadmapItems(
      roadmapItems.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const deleteRoadmapItem = (id: number) => {
    setRoadmapItems(roadmapItems.filter(item => item.id !== id));
  };

  const getProjectById = (id: number | undefined) => {
    return projects.find(project => project.id === id) || { name: 'Unassigned', color: 'gray' };
  };

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityBgColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low': return 'bg-green-900/30';
      case 'medium': return 'bg-yellow-900/30';
      case 'high': return 'bg-red-900/30';
      default: return 'bg-gray-800';
    }
  };

  const getProjectColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-400';
      case 'purple': return 'text-purple-400';
      case 'green': return 'text-green-400';
      case 'red': return 'text-red-400';
      case 'yellow': return 'text-yellow-400';
      case 'pink': return 'text-pink-400';
      default: return 'text-gray-400';
    }
  };

  const getProjectBgColor = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-900/30';
      case 'purple': return 'bg-purple-900/30';
      case 'green': return 'bg-green-900/30';
      case 'red': return 'bg-red-900/30';
      case 'yellow': return 'bg-yellow-900/30';
      case 'pink': return 'bg-pink-900/30';
      default: return 'bg-gray-800';
    }
  };

  const filteredTodos = todos.filter(todo => {
    const matchesStatus = filterStatus === 'all' || todo.completed === (filterStatus === 'completed');
    const matchesPriority = filterPriority === 'all' || todo.priority === filterPriority;
    const matchesProject = filterProject === null || todo.projectId === filterProject;
    const matchesSearch = searchQuery === '' || 
      todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesPriority && matchesProject && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return sortOrder === 'asc' 
        ? priorityOrder[a.priority] - priorityOrder[b.priority]
        : priorityOrder[b.priority] - priorityOrder[a.priority];
    } else if (sortBy === 'dueDate') {
      if (!a.dueDate) return sortOrder === 'asc' ? 1 : -1;
      if (!b.dueDate) return sortOrder === 'asc' ? -1 : 1;
      return sortOrder === 'asc' 
        ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
    } else {
      return sortOrder === 'asc'
        ? a.text.localeCompare(b.text)
        : b.text.localeCompare(a.text);
    }
  });

  const filteredRoadmapItems = roadmapItems.filter(item => {
    if (filterProject !== null && item.projectId !== filterProject) return false;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Project Dashboard
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Organize your tasks, plan your roadmap, and manage your projects all in one place.
        </p>
      </div>
      
      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-xl bg-gray-800 p-1 shadow-lg">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
              activeTab === 'todos'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Roadmap
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-lg text-sm font-medium transition-all flex items-center ${
              activeTab === 'projects'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-md'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Projects
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="mb-6 bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <label className="text-gray-300 mr-2 text-sm font-medium">Status:</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed')}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100 text-sm"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="text-gray-300 mr-2 text-sm font-medium">Priority:</label>
            <select 
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value as 'all' | 'low' | 'medium' | 'high')}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100 text-sm"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="text-gray-300 mr-2 text-sm font-medium">Project:</label>
            <select 
              value={filterProject === null ? 'all' : filterProject}
              onChange={(e) => setFilterProject(e.target.value === 'all' ? null : Number(e.target.value))}
              className="px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100 text-sm"
            >
              <option value="all">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Todo List Section */}
      {activeTab === 'todos' && (
        <section className="mb-12 bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-100">Tasks</h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100 placeholder-gray-400"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'priority' | 'dueDate' | 'title')}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
              >
                <option value="priority">Sort by Priority</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="title">Sort by Title</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 text-gray-400 hover:text-gray-200"
                title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortOrder === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                </svg>
              </button>
            </div>
          </div>
          <div className="space-y-4 mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Add a new task..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && addTodo()}
              />
              <button
                onClick={addTodo}
                className="px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors flex items-center shadow-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Category</label>
                <select
                  value={todoCategory}
                  onChange={(e) => setTodoCategory(e.target.value as 'work' | 'personal' | 'project')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="project">Project</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Priority</label>
                <select
                  value={todoPriority}
                  onChange={(e) => setTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Project</label>
                <select
                  value={todoProjectId}
                  onChange={(e) => setTodoProjectId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Due Date</label>
                <input
                  type="date"
                  value={todoDueDate}
                  onChange={(e) => setTodoDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-100"
                />
              </div>
            </div>
          </div>
          
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium">No tasks found</p>
              <p className="text-sm mt-1">Add your first task above!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center gap-3 p-4 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                      className="w-5 h-5 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                    />
                    <div className="ml-3 flex-1">
                      <span className={`block ${todo.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                        {todo.text}
                      </span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBgColor(todo.priority)} ${getPriorityColor(todo.priority)}`}>
                          {todo.priority}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getProjectBgColor(getProjectById(todo.projectId).color)} ${getProjectColor(getProjectById(todo.projectId).color)}`}>
                          {getProjectById(todo.projectId).name}
                        </span>
                        {todo.dueDate && (
                          <span className="text-xs text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
                    aria-label="Delete todo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* Roadmap Section */}
      {activeTab === 'roadmap' && (
        <section className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Roadmap
          </h2>
          <div className="space-y-4 mb-6">
            <input
              type="text"
              value={newRoadmapItem.title}
              onChange={(e) =>
                setNewRoadmapItem({ ...newRoadmapItem, title: e.target.value })
              }
              placeholder="Title"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
            />
            <textarea
              value={newRoadmapItem.description}
              onChange={(e) =>
                setNewRoadmapItem({ ...newRoadmapItem, description: e.target.value })
              }
              placeholder="Description"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Status</label>
                <select
                  value={newRoadmapItem.status}
                  onChange={(e) =>
                    setNewRoadmapItem({
                      ...newRoadmapItem,
                      status: e.target.value as 'planned' | 'in-progress' | 'completed',
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-100"
                >
                  <option value="planned">Planned</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Priority</label>
                <select
                  value={newRoadmapItem.priority}
                  onChange={(e) =>
                    setNewRoadmapItem({
                      ...newRoadmapItem,
                      priority: e.target.value as 'low' | 'medium' | 'high',
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-100"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Project</label>
                <select
                  value={newRoadmapItem.projectId}
                  onChange={(e) =>
                    setNewRoadmapItem({
                      ...newRoadmapItem,
                      projectId: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-100"
                >
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Target Date</label>
                <input
                  type="date"
                  value={newRoadmapItem.targetDate}
                  onChange={(e) =>
                    setNewRoadmapItem({ ...newRoadmapItem, targetDate: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-gray-100"
                />
              </div>
              
              <div className="md:col-span-2">
                <button
                  onClick={addRoadmapItem}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors flex items-center justify-center shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Roadmap Item
                </button>
              </div>
            </div>
          </div>
          
          {filteredRoadmapItems.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg font-medium">No roadmap items yet</p>
              <p className="text-sm mt-1">Add your first item above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredRoadmapItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-100">{item.title}</h3>
                    <button 
                      onClick={() => deleteRoadmapItem(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
                      aria-label="Delete roadmap item"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-gray-300 mt-2">{item.description}</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => updateRoadmapStatus(item.id, 'planned')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'planned'
                            ? 'bg-gray-600 text-gray-200'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-600'
                        }`}
                      >
                        Planned
                      </button>
                      <button 
                        onClick={() => updateRoadmapStatus(item.id, 'in-progress')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'in-progress'
                            ? 'bg-yellow-900 text-yellow-200'
                            : 'bg-gray-800 text-gray-400 hover:bg-yellow-900'
                        }`}
                      >
                        In Progress
                      </button>
                      <button 
                        onClick={() => updateRoadmapStatus(item.id, 'completed')}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'completed'
                            ? 'bg-green-900 text-green-200'
                            : 'bg-gray-800 text-gray-400 hover:bg-green-900'
                        }`}
                      >
                        Completed
                      </button>
                    </div>
                    
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBgColor(item.priority)} ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                    
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getProjectBgColor(getProjectById(item.projectId).color)} ${getProjectColor(getProjectById(item.projectId).color)}`}>
                      {getProjectById(item.projectId).name}
                    </span>
                    
                    {item.targetDate && (
                      <span className="text-xs text-gray-400 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Target: {new Date(item.targetDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
      
      {/* Projects Section */}
      {activeTab === 'projects' && (
        <section className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
          <h2 className="text-2xl font-semibold mb-6 text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Projects
          </h2>
          
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Project Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="Project name"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Description</label>
                <input
                  type="text"
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="Project description"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-100 placeholder-gray-400"
                />
              </div>
              
              <div>
                <label className="text-gray-300 text-sm block mb-1 font-medium">Color</label>
                <select
                  value={newProject.color}
                  onChange={(e) => setNewProject({ ...newProject, color: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-gray-100"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                  <option value="pink">Pink</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={addProject}
              className="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-colors flex items-center justify-center shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Project
            </button>
          </div>
          
          {projects.length === 0 ? (
            <div className="text-center py-12 text-gray-400 bg-gray-700/30 rounded-lg border border-dashed border-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="text-lg font-medium">No projects yet</p>
              <p className="text-sm mt-1">Add your first project above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="p-5 bg-gray-700 rounded-lg border border-gray-600 hover:shadow-md transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className={`text-lg font-semibold ${getProjectColor(project.color)}`}>{project.name}</h3>
                      <p className="text-gray-300 mt-1">{project.description}</p>
                    </div>
                    <button 
                      onClick={() => deleteProject(project.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
                      aria-label="Delete project"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400">
                      {todos.filter(todo => todo.projectId === project.id).length} tasks
                    </span>
                    <span className="text-xs text-gray-400">
                      {roadmapItems.filter(item => item.projectId === project.id).length} roadmap items
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
} 