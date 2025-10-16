import { useState, useEffect } from 'react';
import { getSystemSettings, updateSystemSettings } from '../lib/storage-simple';
import { SystemSettings } from '../lib/types';

export default function SystemSettingsManager() {
  const [settings, setSettings] = useState<SystemSettings>({
    categories: [],
    finishes: [],
    units: [],
    paymentTerms: [],
    priorities: [],
    processTypes: []
  });
  const [activeTab, setActiveTab] = useState<keyof SystemSettings>('categories');
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    setSettings(getSystemSettings());
  }, []);

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    
    const updatedSettings = {
      ...settings,
      [activeTab]: [...settings[activeTab], newItem.trim()]
    };
    
    setSettings(updatedSettings);
    updateSystemSettings({ [activeTab]: updatedSettings[activeTab] });
    setNewItem('');
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = settings[activeTab].filter((_, i) => i !== index);
    const updatedSettings = {
      ...settings,
      [activeTab]: updatedItems
    };
    
    setSettings(updatedSettings);
    updateSystemSettings({ [activeTab]: updatedItems });
  };

  const handleEditItem = (index: number, newValue: string) => {
    if (!newValue.trim()) return;
    
    const updatedItems = [...settings[activeTab]];
    updatedItems[index] = newValue.trim();
    const updatedSettings = {
      ...settings,
      [activeTab]: updatedItems
    };
    
    setSettings(updatedSettings);
    updateSystemSettings({ [activeTab]: updatedItems });
  };

  const tabs = [
    { key: 'categories' as keyof SystemSettings, label: 'Product Categories', description: 'Manage product categories' },
    { key: 'finishes' as keyof SystemSettings, label: 'Finishes', description: 'Manage product finishes and treatments' },
    { key: 'units' as keyof SystemSettings, label: 'Units', description: 'Manage measurement units' },
    { key: 'paymentTerms' as keyof SystemSettings, label: 'Payment Terms', description: 'Manage payment terms options' },
    { key: 'priorities' as keyof SystemSettings, label: 'Priorities', description: 'Manage priority levels' },
    { key: 'processTypes' as keyof SystemSettings, label: 'Process Types', description: 'Manage external processing types' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">System Settings</h2>
        <p className="text-muted-foreground">Customize dropdown options and system categories</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="card">
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {tabs.find(t => t.key === activeTab)?.label}
            </h3>
            <p className="text-muted-foreground">
              {tabs.find(t => t.key === activeTab)?.description}
            </p>
          </div>

          {/* Add new item */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              className="input flex-1"
              placeholder={`Add new ${activeTab.slice(0, -1)}`}
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddItem()}
            />
            <button
              className="btn btn-primary"
              onClick={handleAddItem}
              disabled={!newItem.trim()}
            >
              Add
            </button>
          </div>

          {/* Items list */}
          <div className="space-y-2">
            {settings[activeTab].length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No {activeTab} configured yet. Add your first item above.
              </div>
            ) : (
              settings[activeTab].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <EditableItem
                    value={item}
                    onSave={(newValue) => handleEditItem(index, newValue)}
                  />
                  <button
                    className="btn-danger text-sm px-3 py-1"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Usage info */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Usage Information</h4>
            <p className="text-sm text-blue-600 dark:text-blue-300">
              These {activeTab} will be available as dropdown options throughout the system. 
              Changes take effect immediately and will be reflected in forms and filters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface EditableItemProps {
  value: string;
  onSave: (newValue: string) => void;
}

function EditableItem({ value, onSave }: EditableItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    if (editValue.trim() && editValue !== value) {
      onSave(editValue.trim());
    }
    setIsEditing(false);
    setEditValue(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 flex-1">
        <input
          type="text"
          className="input flex-1"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          onBlur={handleSave}
          autoFocus
        />
        <button
          className="btn-secondary text-sm px-2 py-1"
          onClick={handleSave}
        >
          Save
        </button>
        <button
          className="btn-secondary text-sm px-2 py-1"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between flex-1">
      <span className="font-medium text-foreground">{value}</span>
      <button
        className="btn-secondary text-sm px-3 py-1"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
    </div>
  );
}