# FlowBoard - Task Management Application

A modern task management application built with Vue.js, JavaScript, and TailwindCSS.

## Features

- User authentication (login/register)
- Kanban board interface with drag-and-drop functionality
- Create, edit, and delete tasks
- Set task priorities and due dates
- Responsive design for all devices
- Local storage persistence

## Tech Stack

- Vue 3 with Composition API
- Vue Router for navigation
- Pinia for state management
- TailwindCSS for styling
- Axios for API communication

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
flowboard/
├── public/              # Static assets
├── src/
│   ├── api/             # API services
│   ├── assets/          # Images, fonts, etc.
│   │   └── css/         # CSS files
│   ├── components/      # Reusable Vue components
│   ├── store/           # Pinia stores
│   ├── views/           # Page components
│   ├── App.vue          # Root component
│   └── main.js          # Application entry point
├── index.html           # HTML template
├── package.json         # Project dependencies
├── tailwind.config.js   # TailwindCSS configuration
└── vite.config.js       # Vite configuration
```

## Future Enhancements

- Backend integration with RESTful API
- Real-time updates with WebSockets
- Multiple board support
- Team collaboration features
- Dark mode support

## License

MIT
