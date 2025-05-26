# 🗓️ Custom Event Calendar

An interactive, feature-rich event calendar built with React. This calendar allows users to create, edit, delete, and manage events with support for recurrence and drag-and-drop rescheduling.

## 🚀 Features

### 📅 Monthly View Calendar
- Displays a traditional monthly layout.
- Highlights the current day.
- Allows navigation between months.

### ✏️ Event Management
- **Add Event:** Click a day to create a new event with fields like title, date/time, description, recurrence, and category/color.
- **Edit Event:** Click an event to edit its details.
- **Delete Event:** Remove events directly from the calendar.

### 🔁 Recurring Events
- Daily, Weekly, Monthly, and Custom recurrence options.
- Recurring events are auto-populated on all applicable days.

### 🧲 Drag-and-Drop Rescheduling
- Drag and drop events to different dates.
- Handles conflicts and edge cases gracefully.

### ⚠️ Event Conflict Management
- Detect and warn users of overlapping/conflicting events.

### 🔍 Event Filtering & Searching *(Optional)*
- Filter by category or color.
- Dynamic search bar for event titles and descriptions.

### 💾 Persistent Storage
- Events saved in localStorage or IndexedDB.
- Data persists across browser sessions.

### 📱 Responsive Design *(Optional)*
- Mobile-friendly layout with optional daily/weekly views.

---

## 🛠️ Tech Stack

| Tech               | Description                              |
|--------------------|------------------------------------------|
| React              | UI Library                               |
| date-fns           | Date handling and manipulation           |
| React DnD / Interact.js | Drag-and-drop support               |
| localStorage       | Event data persistence                   |
| CSS/Styled Components/Tailwind | Styling and responsive design         |

---

## 🔧 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/event-calendar.git

# Navigate to the project directory
cd event-calendar

# Install dependencies
npm install

# Start the development server
npm start
