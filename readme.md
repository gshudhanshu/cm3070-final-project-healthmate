# HealthMate - Comprehensive Health Management Platform

HealthMate is designed as a comprehensive health management platform, aiming to streamline patient-practitioner interactions, appointment scheduling, medical records management, and more. The repository is divided into two primary sections: the client and the server, each with its own Dockerfile for containerization, facilitating deployment in various environments.

### Client

The client-side of the application, found under the **client** directory, is built with Next.js, reflecting modern web development practices. It includes:

- A set of React components (**client/src/components**) for the UI, including custom hooks for state management.
- Pages (**client/src/app**) that utilize these components to render the user interface, with authentication flows, dashboard views, and appointment scheduling.
- Configuration files for ESLint, Prettier, Jest (for testing), and Tailwind CSS for styling.
- The **public** folder contains static assets like images and icons used throughout the application.

### Server

The server-side, located under the **server** directory, is developed with Django, a high-level Python web framework that encourages rapid development and clean, pragmatic design. It includes:

- Models (**server/\*/\*/models.py**) representing the application's data structures for appointments, conversations, medical records, notifications, user profiles, and more.
- Views (**server/\*/\*/views.py**) that handle the logic and interactions for the application's various endpoints.
- Serializers for converting complex data types, such as querysets and model instances, to native Python datatypes that can then be easily rendered into JSON, XML, or other content types.
- URLs (**server/\*/\*/urls.py**) that dispatch requests to the appropriate view based on the request URL.
- Dockerfile for building the server container.

### Testing

Both client and server directories contain tests to ensure the reliability and performance of the HealthMate application. The **jest.config.ts** in the client directory and Django's built-in test framework used in the server ensure comprehensive coverage.

This README outlines the high-level structure and components of the HealthMate project. For a deeper dive into the specifics of each component, the documentation within each directory offers detailed explanations and setup instructions.

### Deployment

The project uses Docker Compose (**docker-compose.dev.yml** for development and **docker-compose.prod.yml** for production) to manage multi-container Docker applications, making it easier to deploy the client and server together.

### Local Development

        Install Docker and Docker Compose on your local machine.
        Clone the repository and navigate to the project directory.
        Run docker-compose up --build to build the client and server containers.
        Access the client at http://localhost:3000 and the server at http://localhost:8000.
