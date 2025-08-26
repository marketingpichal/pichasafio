import { useState } from 'react';

interface PoseFilters {
  difficulty: string;
  category: string;
  minPopularity: number;
  searchTerm: string;
}

interface PoseFilterProps {
  filters: PoseFilters;
  onFiltersChange: (filters: PoseFilters) => void;
  categories: string[];
  difficulties: string[];
  totalPoses: number;
  filteredCount: number;
}

export default function PoseFilter({
  filters,
  onFiltersChange,
  categories,
  difficulties,
  totalPoses,
  filteredCount
}: PoseFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);


  const updateFilter = (key: keyof PoseFilters, value: string | number) => {
    const newFilters = { ...filters, [key]: value };
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: PoseFilters = {
      difficulty: '',
      category: '',
      minPopularity: 0,
      searchTerm: ''
    };
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.difficulty || filters.category || filters.minPopularity > 0 || filters.searchTerm;

  const getFilterCount = () => {
    let count = 0;
    if (filters.difficulty) count++;
    if (filters.category) count++;
    if (filters.minPopularity > 0) count++;
    if (filters.searchTerm) count++;
    return count;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Header compacto */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
            
            {/* Contador de resultados */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium text-pink-600">{filteredCount}</span>
              <span>de</span>
              <span className="font-medium">{totalPoses}</span>
              <span>poses</span>
            </div>
            
            {/* Indicador de filtros activos */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2">
                <div className="bg-pink-100 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">
                  {getFilterCount()} filtro{getFilterCount() !== 1 ? 's' : ''} activo{getFilterCount() !== 1 ? 's' : ''}
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs text-gray-500 hover:text-gray-700 underline"
                >
                  Limpiar
                </button>
              </div>
            )}
          </div>
          
          {/* Botón expandir/contraer */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span>{isExpanded ? 'Contraer' : 'Expandir'}</span>
            <svg 
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        {/* Filtros rápidos en el header */}
        {!isExpanded && (
          <div className="flex flex-wrap items-center gap-3 mt-3">
            {/* Búsqueda rápida */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar poses..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Filtros rápidos */}
            <select
              value={filters.difficulty}
              onChange={(e) => updateFilter('difficulty', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todas las dificultades</option>
              {difficulties.map(difficulty => (
                <option key={difficulty} value={difficulty}>{difficulty}</option>
              ))}
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => updateFilter('category', e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      
      {/* Panel expandido */}
      {isExpanded && (
        <div className="p-6 space-y-6">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Buscar poses
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre o descripción..."
                value={filters.searchTerm}
                onChange={(e) => updateFilter('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {filters.searchTerm && (
                <button
                  onClick={() => updateFilter('searchTerm', '')}
                  className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 hover:text-gray-600"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          
          {/* Filtros principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dificultad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Nivel de dificultad
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="difficulty"
                    value=""
                    checked={filters.difficulty === ''}
                    onChange={(e) => updateFilter('difficulty', e.target.value)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Todas</span>
                </label>
                {difficulties.map(difficulty => {
                  const getDifficultyColor = (level: string) => {
                    switch (level) {
                      case 'Principiante': return 'text-green-600';
                      case 'Intermedio': return 'text-yellow-600';
                      case 'Avanzado': return 'text-red-600';
                      default: return 'text-gray-600';
                    }
                  };
                  
                  return (
                    <label key={difficulty} className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value={difficulty}
                        checked={filters.difficulty === difficulty}
                        onChange={(e) => updateFilter('difficulty', e.target.value)}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      />
                      <span className={`ml-2 text-sm font-medium ${getDifficultyColor(difficulty)}`}>
                        {difficulty}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Categoría
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={filters.category === ''}
                    onChange={(e) => updateFilter('category', e.target.value)}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Todas</span>
                </label>
                {categories.map(category => (
                  <label key={category} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category}
                      checked={filters.category === category}
                      onChange={(e) => updateFilter('category', e.target.value)}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Popularidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Popularidad mínima
              </label>
              <div className="space-y-3">
                {[0, 3, 4, 5].map(rating => {
                  const getStars = (count: number) => {
                    const stars = [];
                    for (let i = 0; i < 5; i++) {
                      stars.push(
                        <svg
                          key={i}
                          className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      );
                    }
                    return stars;
                  };
                  
                  return (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="popularity"
                        value={rating}
                        checked={filters.minPopularity === rating}
                        onChange={(e) => updateFilter('minPopularity', parseInt(e.target.value))}
                        className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                      />
                      <div className="ml-2 flex items-center gap-2">
                        <div className="flex">{getStars(rating)}</div>
                        <span className="text-sm text-gray-700">
                          {rating === 0 ? 'Todas' : `${rating}+ estrellas`}
                        </span>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Acciones */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Mostrando <span className="font-medium text-pink-600">{filteredCount}</span> de <span className="font-medium">{totalPoses}</span> poses
            </div>
            
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Limpiar filtros
                </button>
              )}
              
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 text-sm bg-pink-500 hover:bg-pink-600 text-white rounded-lg transition-colors"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}