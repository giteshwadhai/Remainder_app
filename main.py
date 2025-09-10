import streamlit as st
import uuid
import json
import datetime
from datetime import datetime
import pandas as pd

# Set page configuration
st.set_page_config(
    page_title="Reminder Buddy",
    page_icon="🔔",
    layout="centered"
)

# Custom CSS for styling
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        background: linear-gradient(90deg, #00c6ff, #9900ff);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: bold;
        margin-bottom: 0;
    }
    .card {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        padding: 20px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 20px;
    }
    .completed {
        text-decoration: line-through;
        color: gray;
    }
    .badge {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 0.8rem;
        font-weight: bold;
    }
    .badge-today {
        background-color: #ff9d00;
        color: white;
    }
    .badge-tomorrow {
        background-color: #00b4d8;
        color: white;
    }
    .badge-overdue {
        background-color: #ff5a5f;
        color: white;
    }
    .badge-upcoming {
        background-color: #52b788;
        color: white;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state for reminders if it doesn't exist
if 'reminders' not in st.session_state:
    st.session_state.reminders = []
    
    # Try to load reminders from file
    try:
        with open('reminders.json', 'r') as f:
            loaded_reminders = json.load(f)
            # Convert string dates back to datetime objects
            for reminder in loaded_reminders:
                reminder['due_date'] = datetime.fromisoformat(reminder['due_date'])
                reminder['created_at'] = datetime.fromisoformat(reminder['created_at'])
            st.session_state.reminders = loaded_reminders
    except (FileNotFoundError, json.JSONDecodeError):
        # If file doesn't exist or is invalid, start with empty list
        pass

if 'filter' not in st.session_state:
    st.session_state.filter = "all"

# Function to save reminders to file
def save_reminders():
    # Convert datetime objects to ISO format strings for JSON serialization
    reminders_to_save = []
    for reminder in st.session_state.reminders:
        reminder_copy = reminder.copy()
        reminder_copy['due_date'] = reminder_copy['due_date'].isoformat()
        reminder_copy['created_at'] = reminder_copy['created_at'].isoformat()
        reminders_to_save.append(reminder_copy)
    
    with open('reminders.json', 'w') as f:
        json.dump(reminders_to_save, f)

# Main app header
st.markdown('<h1 class="main-header">Reminder Buddy</h1>', unsafe_allow_html=True)
st.markdown('<p style="margin-top: 0;">Stay organized and never miss important tasks</p>', unsafe_allow_html=True)

# Function to add a new reminder
def add_reminder(title, description, due_date):
    if not title or not due_date:
        return False
    
    reminder = {
        'id': str(uuid.uuid4()),
        'title': title,
        'description': description,
        'due_date': due_date,
        'completed': False,
        'created_at': datetime.now()
    }
    
    st.session_state.reminders.insert(0, reminder)  # Add to the beginning of the list
    save_reminders()
    return True

# Function to toggle reminder completion status
def toggle_reminder(reminder_id):
    for reminder in st.session_state.reminders:
        if reminder['id'] == reminder_id:
            reminder['completed'] = not reminder['completed']
            save_reminders()
            return True
    return False

# Function to delete a reminder
def delete_reminder(reminder_id):
    for i, reminder in enumerate(st.session_state.reminders):
        if reminder['id'] == reminder_id:
            del st.session_state.reminders[i]
            save_reminders()
            return True
    return False

# Function to get date badge
def get_date_badge(due_date):
    today = datetime.now().date()
    due_date_only = due_date.date()
    
    if due_date_only == today:
        return "<span class='badge badge-today'>Today</span>"
    elif due_date_only == today + datetime.timedelta(days=1):
        return "<span class='badge badge-tomorrow'>Tomorrow</span>"
    elif due_date_only < today:
        return "<span class='badge badge-overdue'>Overdue</span>"
    else:
        return "<span class='badge badge-upcoming'>Upcoming</span>"

# Main app function
def main():
    # Display app statistics
    col1, col2, col3 = st.columns(3)
    
    total_reminders = len(st.session_state.reminders)
    pending_reminders = len([r for r in st.session_state.reminders if not r['completed']])
    completed_reminders = len([r for r in st.session_state.reminders if r['completed']])
    
    with col1:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.metric("Total", total_reminders)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col2:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.metric("Pending", pending_reminders)
        st.markdown('</div>', unsafe_allow_html=True)
    
    with col3:
        st.markdown('<div class="card">', unsafe_allow_html=True)
        st.metric("Completed", completed_reminders)
        st.markdown('</div>', unsafe_allow_html=True)
    
    # Add Reminder Form
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("✨ Add New Reminder")
    
    with st.form(key="add_reminder_form", clear_on_submit=True):
        title = st.text_input("Title", placeholder="Enter reminder title...")
        description = st.text_area("Description (Optional)", placeholder="Add more details...", height=100)
        
        col1, col2 = st.columns(2)
        with col1:
            due_date = st.date_input("Due Date", value=datetime.now().date())
        with col2:
            due_time = st.time_input("Due Time", value=datetime.now().time())
        
        # Combine date and time into a datetime object
        due_datetime = datetime.combine(due_date, due_time)
        
        submit_button = st.form_submit_button(label="Add Reminder", use_container_width=True)
        
        if submit_button:
            if title.strip():
                success = add_reminder(title.strip(), description.strip(), due_datetime)
                if success:
                    st.success(f"Reminder '{title}' added successfully!")
                else:
                    st.error("Failed to add reminder. Please try again.")
            else:
                st.warning("Please enter a title for your reminder.")
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Filter buttons
    st.markdown('<div class="card">', unsafe_allow_html=True)
    st.subheader("📋 Your Reminders")
    
    # Filter tabs
    filter_options = ["All", "Pending", "Completed"]
    filter_counts = [
        len(st.session_state.reminders),
        len([r for r in st.session_state.reminders if not r['completed']]),
        len([r for r in st.session_state.reminders if r['completed']])
    ]
    
    # Create tabs with counts
    tabs = [f"{option} ({count})" for option, count in zip(filter_options, filter_counts)]
    selected_tab = st.tabs(tabs)
    
    # Set filter based on selected tab
    if selected_tab[0]:
        st.session_state.filter = "all"
    elif selected_tab[1]:
        st.session_state.filter = "pending"
    elif selected_tab[2]:
        st.session_state.filter = "completed"
    
    # Display filtered reminders
    filtered_reminders = st.session_state.reminders
    if st.session_state.filter == "pending":
        filtered_reminders = [r for r in st.session_state.reminders if not r['completed']]
    elif st.session_state.filter == "completed":
        filtered_reminders = [r for r in st.session_state.reminders if r['completed']]
    
    if not filtered_reminders:
        st.info(f"No {st.session_state.filter if st.session_state.filter != 'all' else ''} reminders found. Add your first reminder to get started!")
    
    # Display reminders
    for reminder in filtered_reminders:
        with st.container():
            col1, col2 = st.columns([0.9, 0.1])
            with col1:
                # Format the reminder display
                title_style = "text-decoration: line-through;" if reminder['completed'] else ""
                due_date_str = reminder['due_date'].strftime("%b %d, %Y at %I:%M %p")
                date_badge = get_date_badge(reminder['due_date'])
                
                st.markdown(f"""
                <div style="padding: 10px; border-radius: 5px; background-color: rgba(255,255,255,0.1); margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="{title_style}">{reminder['title']} {date_badge}</h3>
                    </div>
                    <p style="{title_style}">{reminder['description'] if reminder['description'] else ''}</p>
                    <div style="font-size: 0.8rem; color: gray;">
                        Due: {due_date_str}
                    </div>
                </div>
                """, unsafe_allow_html=True)
            
            with col2:
                # Add toggle and delete buttons
                check_key = f"check_{reminder['id']}"
                delete_key = f"delete_{reminder['id']}"
                
                # Toggle completion status
                if st.button("✓" if not reminder['completed'] else "↺", key=check_key):
                    toggle_reminder(reminder['id'])
                    st.rerun()
                
                # Delete reminder
                if st.button("🗑️", key=delete_key):
                    delete_reminder(reminder['id'])
                    st.success(f"Reminder '{reminder['title']}' deleted successfully!")
                    st.rerun()
    
    st.markdown('</div>', unsafe_allow_html=True)

# Run the main function
if __name__ == "__main__":
    main()