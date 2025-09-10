import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Clock, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Calendar as CalendarIcon 
} from 'lucide-react';
import { Reminder, FilterType } from '@/types/reminder';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

interface ReminderListProps {
  reminders: Reminder[];
  onToggleComplete: (id: string) => void;
  onDeleteReminder: (id: string) => void;
  filter: FilterType;
}

export const ReminderList = ({ 
  reminders, 
  onToggleComplete, 
  onDeleteReminder, 
  filter 
}: ReminderListProps) => {
  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'pending') return !reminder.completed;
    if (filter === 'completed') return reminder.completed;
    return true;
  });

  const getDateBadge = (date: Date) => {
    if (isToday(date)) {
      return <Badge variant="destructive" className="text-xs">Today</Badge>;
    }
    if (isTomorrow(date)) {
      return <Badge variant="secondary" className="text-xs">Tomorrow</Badge>;
    }
    if (isPast(date)) {
      return <Badge variant="destructive" className="text-xs">Overdue</Badge>;
    }
    return <Badge variant="outline" className="text-xs">{format(date, 'MMM dd')}</Badge>;
  };

  if (filteredReminders.length === 0) {
    return (
      <Card className="card-gradient border-0">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-muted-foreground text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              {filter === 'completed' ? 'No completed reminders' : 
               filter === 'pending' ? 'No pending reminders' : 
               'No reminders yet'}
            </h3>
            <p className="text-sm">
              {filter === 'all' ? 'Add your first reminder to get started!' : 
               `Switch to "${filter === 'pending' ? 'all' : 'pending'}" to see other reminders.`}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {filteredReminders.map((reminder) => (
        <Card key={reminder.id} className="card-gradient border-0 hover:scale-[1.02] transition-transform">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={reminder.completed}
                onCheckedChange={() => onToggleComplete(reminder.id)}
                className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`font-medium text-sm ${
                    reminder.completed ? 'line-through text-muted-foreground' : ''
                  }`}>
                    {reminder.title}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getDateBadge(reminder.dueDate)}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteReminder(reminder.id)}
                      className="h-6 w-6 p-0 hover:bg-destructive/20 hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                {reminder.description && (
                  <p className={`text-xs text-muted-foreground mt-1 ${
                    reminder.completed ? 'line-through' : ''
                  }`}>
                    {reminder.description}
                  </p>
                )}
                
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    {format(reminder.dueDate, 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(reminder.dueDate, 'h:mm a')}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};