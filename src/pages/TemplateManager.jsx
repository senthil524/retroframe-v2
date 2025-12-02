import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Star, StarOff, Layout as LayoutIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import AdminAuthGuard from '@/components/admin/AdminAuthGuard';

function TemplateManagerContent() {
  const [templates, setTemplates] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    page_format: 'a4',
    orientation: 'landscape',
    grid_columns: 3,
    grid_rows: 2,
    margin_top: 0,
    margin_bottom: 0,
    margin_left: 0,
    margin_right: 0,
    crop_marks_enabled: true,
    crop_mark_length: 10,
    crop_mark_thickness: 0.5,
    item_width: 101.6,
    item_height: 88.9,
    is_default: false
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    const data = await base44.entities.Template.list();
    setTemplates(data);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      page_format: 'a4',
      orientation: 'landscape',
      grid_columns: 3,
      grid_rows: 2,
      margin_top: 0,
      margin_bottom: 0,
      margin_left: 0,
      margin_right: 0,
      crop_marks_enabled: true,
      crop_mark_length: 10,
      crop_mark_thickness: 0.5,
      item_width: 101.6,
      item_height: 88.9,
      is_default: false
    });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (formData.is_default) {
        // Remove default from all others
        const defaults = templates.filter(t => t.is_default && t.id !== editing?.id);
        for (let t of defaults) {
          await base44.entities.Template.update(t.id, { is_default: false });
        }
      }

      if (editing) {
        await base44.entities.Template.update(editing.id, formData);
        toast.success('Template updated');
      } else {
        await base44.entities.Template.create(formData);
        toast.success('Template created');
      }
      
      await loadTemplates();
      resetForm();
    } catch (error) {
      toast.error('Failed to save template');
    }
  };

  const handleEdit = (template) => {
    setFormData(template);
    setEditing(template);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this template?')) return;
    
    try {
      await base44.entities.Template.delete(id);
      toast.success('Template deleted');
      await loadTemplates();
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const toggleDefault = async (template) => {
    try {
      if (!template.is_default) {
        const defaults = templates.filter(t => t.is_default);
        for (let t of defaults) {
          await base44.entities.Template.update(t.id, { is_default: false });
        }
      }
      
      await base44.entities.Template.update(template.id, { is_default: !template.is_default });
      toast.success(template.is_default ? 'Default removed' : 'Set as default');
      await loadTemplates();
    } catch (error) {
      toast.error('Failed to update template');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF8F5] to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#2B2B2B] mb-2">Print Templates</h1>
            <p className="text-gray-600">Create and manage custom print layouts</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#FF6B9D] hover:bg-[#FF5589] rounded-full"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Template
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-[#2B2B2B] mb-6">
              {editing ? 'Edit Template' : 'New Template'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Template Name *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g., Standard A4 Landscape"
                    required
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Optional description"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Page Format</Label>
                  <Select value={formData.page_format} onValueChange={(v) => setFormData({...formData, page_format: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="a3">A3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Orientation</Label>
                  <Select value={formData.orientation} onValueChange={(v) => setFormData({...formData, orientation: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landscape">Landscape</SelectItem>
                      <SelectItem value="portrait">Portrait</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Columns</Label>
                  <Input
                    type="number"
                    value={formData.grid_columns}
                    onChange={(e) => setFormData({...formData, grid_columns: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
                <div>
                  <Label>Rows</Label>
                  <Input
                    type="number"
                    value={formData.grid_rows}
                    onChange={(e) => setFormData({...formData, grid_rows: parseInt(e.target.value)})}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Margin Top (mm)</Label>
                  <Input
                    type="number"
                    value={formData.margin_top}
                    onChange={(e) => setFormData({...formData, margin_top: parseFloat(e.target.value)})}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label>Margin Bottom (mm)</Label>
                  <Input
                    type="number"
                    value={formData.margin_bottom}
                    onChange={(e) => setFormData({...formData, margin_bottom: parseFloat(e.target.value)})}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label>Margin Left (mm)</Label>
                  <Input
                    type="number"
                    value={formData.margin_left}
                    onChange={(e) => setFormData({...formData, margin_left: parseFloat(e.target.value)})}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label>Margin Right (mm)</Label>
                  <Input
                    type="number"
                    value={formData.margin_right}
                    onChange={(e) => setFormData({...formData, margin_right: parseFloat(e.target.value)})}
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Item Width (mm)</Label>
                  <Input
                    type="number"
                    value={formData.item_width}
                    onChange={(e) => setFormData({...formData, item_width: parseFloat(e.target.value)})}
                    step="0.1"
                  />
                </div>
                <div>
                  <Label>Item Height (mm)</Label>
                  <Input
                    type="number"
                    value={formData.item_height}
                    onChange={(e) => setFormData({...formData, item_height: parseFloat(e.target.value)})}
                    step="0.1"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="crop_marks"
                    checked={formData.crop_marks_enabled}
                    onChange={(e) => setFormData({...formData, crop_marks_enabled: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label htmlFor="crop_marks">Enable Crop Marks</Label>
                </div>
                <div>
                  <Label>Crop Mark Length (mm)</Label>
                  <Input
                    type="number"
                    value={formData.crop_mark_length}
                    onChange={(e) => setFormData({...formData, crop_mark_length: parseFloat(e.target.value)})}
                    step="0.1"
                    disabled={!formData.crop_marks_enabled}
                  />
                </div>
                <div>
                  <Label>Crop Mark Thickness</Label>
                  <Input
                    type="number"
                    value={formData.crop_mark_thickness}
                    onChange={(e) => setFormData({...formData, crop_mark_thickness: parseFloat(e.target.value)})}
                    step="0.1"
                    disabled={!formData.crop_marks_enabled}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({...formData, is_default: e.target.checked})}
                  className="w-4 h-4"
                />
                <Label htmlFor="is_default">Set as default template</Label>
              </div>

              <div className="flex gap-3 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-[#FF6B9D] hover:bg-[#FF5589]">
                  {editing ? 'Update' : 'Create'} Template
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Template List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#FFF5F0] rounded-lg flex items-center justify-center">
                    <LayoutIcon className="w-5 h-5 text-[#FF6B9D]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2B2B2B]">{template.name}</h3>
                    {template.is_default && (
                      <span className="text-xs text-[#FF6B9D] font-semibold">DEFAULT</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => toggleDefault(template)}
                  className="text-gray-400 hover:text-[#FF6B9D]"
                >
                  {template.is_default ? <Star className="w-5 h-5 fill-[#FF6B9D] text-[#FF6B9D]" /> : <StarOff className="w-5 h-5" />}
                </button>
              </div>

              {template.description && (
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              )}

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex justify-between">
                  <span>Format:</span>
                  <span className="font-semibold">{template.page_format.toUpperCase()} {template.orientation}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grid:</span>
                  <span className="font-semibold">{template.grid_columns} × {template.grid_rows}</span>
                </div>
                <div className="flex justify-between">
                  <span>Item Size:</span>
                  <span className="font-semibold">{template.item_width} × {template.item_height} mm</span>
                </div>
                <div className="flex justify-between">
                  <span>Crop Marks:</span>
                  <span className="font-semibold">{template.crop_marks_enabled ? 'Yes' : 'No'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleEdit(template)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(template.id)}
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}

          {templates.length === 0 && !showForm && (
            <div className="col-span-full text-center py-12">
              <LayoutIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No templates yet</p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-[#FF6B9D] hover:bg-[#FF5589] rounded-full"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Template
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TemplateManager() {
  return (
    <AdminAuthGuard>
      <TemplateManagerContent />
    </AdminAuthGuard>
  );
}