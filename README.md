# Socket.io Chat Application

This is a real-time chat application built with Node.js, Express.js, and Socket.IO. Users can join chat rooms, send messages, and share their location with others.

## Features

- **User authentication:** Users can join chat rooms with a username and room name.
- **Real-time messaging:** Messages are sent and received instantly without needing to refresh the page.
- **Location sharing:** Users can share their current location with others in the chat room.

## Installation
1. Make sure you have Node.js installed on your machine
2. Clone this repository
3. Navigate to the project directory in your terminal
4. Install the dependencies using `npm install`
5. Run the server using `npm start`

## Dependencies
- `Express.js` - Fast, unopinionated, minimalist web framework for Node.js.
- `Socket.IO` - Real-time bidirectional event-based communication library.
- `Bad-words` - JavaScript filter for profane language.

## File Structure
- `index.js` - Main server file containing the application logic.
- `public/` - Directory containing client-side HTML, CSS, and JavaScript files.
- `utils/messages.js` - Module for generating message objects.
- `utils/users.js` - Module for managing users in chat rooms.

## Contributions
Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or create a pull request.

## License
This project is licensed under the MIT License.
