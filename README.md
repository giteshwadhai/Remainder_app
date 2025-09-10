# Reminder Buddy App

A simple and elegant reminder application built with Python and Streamlit. This app helps you stay organized by managing your tasks and reminders in one place.

## Features

- Add reminders with title, description, and due date/time
- Mark reminders as completed or pending
- Filter reminders by status (All, Pending, Completed)
- Delete reminders
- Visual indicators for reminder status (Today, Tomorrow, Overdue, Upcoming)
- Persistent storage of reminders

## Python Version

## Installation

1. Clone this repository or download the source code
2. Install the required dependencies:

```bash
pip install -r requirements.txt
```

## Usage

Run the Streamlit app with the following command:

```bash
streamlit run main.py
```

The app will open in your default web browser at `http://localhost:8501`.

## How to Use

1. **Add a Reminder**: Fill out the form with a title, optional description, and due date/time, then click "Add Reminder"
2. **View Reminders**: All your reminders are displayed in the "Your Reminders" section
3. **Filter Reminders**: Use the tabs to filter between All, Pending, and Completed reminders
4. **Mark as Complete/Pending**: Click the checkmark button to toggle a reminder's completion status
5. **Delete a Reminder**: Click the trash icon to remove a reminder

## Data Storage

Reminders are stored in a local JSON file (`reminders.json`) so your data persists between sessions.

## Original React Version

This repository also contains the original React/TypeScript version of the app in the src directory.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c0598681-2c09-4904-97fe-2dc5ad875dab) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
