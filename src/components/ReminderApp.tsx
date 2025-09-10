import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, ListTodo, CheckCircle, Clock } from 'lucide-react';
import { ReminderForm } from './ReminderForm';
import { ReminderList } from './ReminderList';
import { Reminder, FilterType } from '@/types/reminder';
import { useToast } from '@/hooks/use-toast';

const STORAGE_KEY = 'reminders-app-data';

export const ReminderApp = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const { toast } = useToast();

  // Load reminders from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const remindersWithDates = parsed.map((r: any) => ({
          ...r,
          dueDate: new Date(r.dueDate),
          createdAt: new Date(r.createdAt),
        }));
        setReminders(remindersWithDates);
      } catch (error) {
        console.error('Failed to load reminders:', error);
      }
    }
  }, []);

  // Save reminders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  }, [reminders]);

  const addReminder = (newReminder: Omit<Reminder, 'id' | 'createdAt'>) => {
    const reminder: Reminder = {
      ...newReminder,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setReminders(prev => [reminder, ...prev]);
    toast({
      title: "Reminder added!",
      description: `"${reminder.title}" has been added to your reminders.`,
    });
  };

  const toggleComplete = (id: string) => {
    setReminders(prev =>
      prev.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast({
        title: reminder.completed ? "Reminder reopened" : "Reminder completed!",
        description: `"${reminder.title}" marked as ${reminder.completed ? 'pending' : 'completed'}.`,
      });
    }
  };

  const deleteReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    setReminders(prev => prev.filter(r => r.id !== id));
    
    if (reminder) {
      toast({
        title: "Reminder deleted",
        description: `"${reminder.title}" has been removed.`,
        variant: "destructive",
      });
    }
  };

  const pendingCount = reminders.filter(r => !r.completed).length;
  const completedCount = reminders.filter(r => r.completed).length;

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="p-3 rounded-full bg-primary/20">
              <Bell className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Reminder App
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Stay organized and never miss important tasks
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-gradient border-0">
            <CardContent className="p-4 text-center">
              <ListTodo className="h-6 w-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{reminders.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient border-0">
            <CardContent className="p-4 text-center">
              <Clock className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{pendingCount}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </CardContent>
          </Card>
          
          <Card className="card-gradient border-0">
            <CardContent className="p-4 text-center">
              <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Reminder Form */}
        <ReminderForm onAddReminder={addReminder} />

        {/* Filter Buttons */}
        <Card className="card-gradient border-0">
          <CardHeader>
            <CardTitle className="text-lg">Your Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {(['all', 'pending', 'completed'] as FilterType[]).map((filterType) => (
                <Button
                  key={filterType}
                  variant={filter === filterType ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter(filterType)}
                  className={filter === filterType ? "button-gradient border-0" : "glass-effect"}
                >
                  {filterType === 'all' && 'All'}
                  {filterType === 'pending' && 'Pending'}
                  {filterType === 'completed' && 'Completed'}
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {filterType === 'all' ? reminders.length :
                     filterType === 'pending' ? pendingCount : completedCount}
                  </Badge>
                </Button>
              ))}
            </div>

            <ReminderList
              reminders={reminders}
              onToggleComplete={toggleComplete}
              onDeleteReminder={deleteReminder}
              filter={filter}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};