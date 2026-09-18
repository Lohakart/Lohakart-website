import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Trash2, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserProfile {
  id: string;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
  email?: string;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Call edge function to get users with emails (requires service role)
      const { data, error } = await supabase.functions.invoke('get-users');

      if (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
        setLoading(false);
        return;
      }

      if (data?.users) {
        setUsers(data.users);
      }
    } catch (error) {
      console.error('Unexpected error fetching users:', error);
      toast.error('Failed to load users');
    }

    setLoading(false);
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to invoke delete function');
      }

      // Check if the response contains an error
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(data.error as string);
      }

      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(errorMessage);
    }
  };

  const isNewUser = (createdAt: string) => {
    const daysSinceCreation = Math.floor(
      (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysSinceCreation <= 7;
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
        <div>
          <h1 className="text-4xl font-bold mb-2">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="hover:shadow-steel transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{user.full_name || 'No Name'}</CardTitle>
                        {isNewUser(user.created_at) && (
                          <Badge variant="default" className="mt-1">New User</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    {user.email && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Email:</span> {user.email}
                      </p>
                    )}
                    {user.phone && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Phone:</span> {user.phone}
                      </p>
                    )}
                    {user.city && user.state && (
                      <p className="text-muted-foreground">
                        <span className="font-medium">Location:</span> {user.city}, {user.state}
                        {user.pincode && ` - ${user.pincode}`}
                      </p>
                    )}
                    {user.address && (
                      <p className="text-muted-foreground text-xs line-clamp-2">
                        <span className="font-medium">Address:</span> {user.address}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => deleteUser(user.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete User
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {users.length === 0 && (
          <Card className="p-12">
            <div className="text-center space-y-2">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">No Users Found</h3>
              <p className="text-muted-foreground">Users will appear here once they sign up</p>
            </div>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
