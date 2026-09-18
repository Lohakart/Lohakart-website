import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Minus, Edit, Trash2 } from 'lucide-react';

interface PriceIndex {
  id: string;
  product_name: string;
  price: number;
  change_percent: number | null;
  date: string;
}

export default function AdminPricing() {
  const [pricing, setPricing] = useState<PriceIndex[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PriceIndex | null>(null);
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    change_percent: '',
  });

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    const { data, error } = await supabase
      .from('pricing_index')
      .select('*')
      .order('date', { ascending: false });
    
    if (!error && data) setPricing(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceData = {
      product_name: formData.product_name,
      price: parseFloat(formData.price),
      change_percent: formData.change_percent ? parseFloat(formData.change_percent) : null,
    };

    if (editingItem) {
      const { error } = await supabase
        .from('pricing_index')
        .update(priceData)
        .eq('id', editingItem.id);
      
      if (!error) {
        toast.success('Price updated successfully');
        fetchPricing();
        resetForm();
      } else {
        toast.error('Failed to update price');
      }
    } else {
      const { error } = await supabase
        .from('pricing_index')
        .insert([priceData]);
      
      if (!error) {
        toast.success('Price added successfully');
        fetchPricing();
        resetForm();
      } else {
        toast.error('Failed to add price');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this price entry?')) return;
    
    const { error } = await supabase
      .from('pricing_index')
      .delete()
      .eq('id', id);
    
    if (!error) {
      toast.success('Price deleted');
      fetchPricing();
    } else {
      toast.error('Failed to delete price');
    }
  };

  const resetForm = () => {
    setFormData({
      product_name: '',
      price: '',
      change_percent: '',
    });
    setEditingItem(null);
    setDialogOpen(false);
  };

  const startEdit = (item: PriceIndex) => {
    setEditingItem(item);
    setFormData({
      product_name: item.product_name,
      price: item.price.toString(),
      change_percent: item.change_percent?.toString() || '',
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Pricing Index</h1>
            <p className="text-muted-foreground">Manage daily steel pricing</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Price
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Price' : 'Add New Price'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Product Name</Label>
                  <Input
                    required
                    value={formData.product_name}
                    onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                    placeholder="e.g., TMT Bar 8mm"
                  />
                </div>
                <div>
                  <Label>Price (₹/ton)</Label>
                  <Input
                    required
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Change Percent (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.change_percent}
                    onChange={(e) => setFormData({ ...formData, change_percent: e.target.value })}
                    placeholder="e.g., 2.5 or -1.2"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingItem ? 'Update' : 'Add'} Price
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricing.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-steel transition-all">
                <CardHeader>
                  <CardTitle className="text-lg">{item.product_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-primary">
                    ₹{Number(item.price).toLocaleString()}
                    <span className="text-sm font-normal text-muted-foreground">/ton</span>
                  </div>
                  {item.change_percent !== null && (
                    <div className="flex items-center gap-2">
                      {item.change_percent > 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : item.change_percent < 0 ? (
                        <TrendingDown className="h-5 w-5 text-red-500" />
                      ) : (
                        <Minus className="h-5 w-5 text-muted-foreground" />
                      )}
                      <span className={`font-semibold ${
                        item.change_percent > 0 ? 'text-green-500' : 
                        item.change_percent < 0 ? 'text-red-500' : 
                        'text-muted-foreground'
                      }`}>
                        {item.change_percent > 0 ? '+' : ''}{item.change_percent}%
                      </span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => startEdit(item)} className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)} className="flex-1">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
