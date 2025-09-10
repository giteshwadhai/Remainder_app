import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Calendar, Plus } from 'lucide-react';
import { Reminder } from '@/types/reminder';

interface ReminderFormProps {
  onAddReminder: (reminder: Omit<Reminder, 'id' | 'createdAt'>) => void;
}

export const ReminderForm = ({ onAddReminder }: ReminderFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) return;

    onAddReminder({
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: new Date(dueDate),
      completed: false,
    });

    setTitle('');
    setDescription('');
    setDueDate('');
  };

  return (
    <Card className="card-gradient border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Plus className="h-5 w-5 text-primary" />
          Add New Reminder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reminder title..."
              className="glass-effect border-muted"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              className="glass-effect border-muted resize-none"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dueDate" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Due Date
            </Label>
            <Input
              id="dueDate"
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="glass-effect border-muted"
              required
            />
          </div>
          
          <Button type="submit" className="w-full button-gradient border-0 hover:scale-105 transition-transform">
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};