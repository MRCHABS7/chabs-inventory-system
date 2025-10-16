import { useState, useMemo } from 'react';

interface SearchAndFilterProps<T> {
  data: T[];
  searchFields: (keyof T)[];
  filterOptions?: {
    field: keyof T;
    label: string;
    options: { value: string; label: string }[];
  }[];
  onResults: (results: T[]) => void;
  placeholder?: string;
}

export default function SearchAndFilter<T extends Record<string, any>>({
  data,
  searchFields,
  filterOptions = [],
  onResults,
  placeholder = "Search..."
}: SearchAndFilterProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortBy, setSortBy] = useState<keyof T | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedData = useMemo(() => {
    let results = data;

    // Apply search
    if (searchTerm) {
      results = results.filter(item =>
        searchFields.some(field => {
          const value = item[field];
          return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([field, value]) => {
      if (value) {
        results = results.filter(item => {
          const itemValue = item[field];
          return itemValue && itemValue.toString() === value;
        });
      }
    });

    // Apply sorting
    if (sortBy) {
      results = [...results].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        
        if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return results;
  }, [data, searchTerm, filters, sortBy, sortOrder, searchFields]);

  // Update parent component with results
  useMemo(() => {
    onResults(filteredAndSortedData);
  }, [filteredAndSortedData, onResults]);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({});
    setSortBy('');
    setSortOrder('asc');
  };

  return (
    <div className="card p-4 space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* Search Input */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input
              type="text"
              placeholder={placeholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
              aria-label="Search"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        {filterOptions.map(option => (
          <div key={option.field.toString()} className="min-w-32">
            <select
              value={filters[option.field.toString()] || ''}
              onChange={(e) => handleFilterChange(option.field.toString(), e.target.value)}
              className="input"
              aria-label={`Filter by ${option.label}`}
            >
              <option value="">{option.label}</option>
              {option.options.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Sort Options */}
        <div className="flex gap-2">
          <select
            value={sortBy.toString()}
            onChange={(e) => setSortBy(e.target.value as keyof T)}
            className="input"
            aria-label="Sort by"
          >
            <option value="">Sort by...</option>
            {searchFields.map(field => (
              <option key={field.toString()} value={field.toString()}>
                {field.toString()}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="btn btn-secondary px-3"
            aria-label={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
            title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="btn btn-secondary"
          aria-label="Clear all filters"
        >
          Clear
        </button>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredAndSortedData.length} of {data.length} results
        {searchTerm && ` for "${searchTerm}"`}
      </div>
    </div>
  );
}