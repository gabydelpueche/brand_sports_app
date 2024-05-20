# Work Schedule App

A Node.js application to manage user registration, login, viewing a calendar, and requesting time off.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Features](#features)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/gabydelpueche/brand_sports_app.git
    cd work-program
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```
    PORT=3000
    DATABASE_URL=your_database_url
    ```

4. Run the application:
    ```sh
    npm app
    ```

## Usage

The application provides the following functionalities:
- User registration
- User login
- Viewing a calendar
- Requesting time off

## API Endpoints

### GET /
Renders the registration page.

### GET /login
Renders the login page.

### GET /calender
Renders the calendar page.

### GET /home
Renders the home page.

### GET /time_off
Renders the time off request page.

### POST /register
Registers a new user.

#### Request Body:
```json
{
    "fName": "John",
    "lName": "Doe",
    "username": "johndoe",
    "email": "john.doe@example.com",
    "password": "YourSecurePassword123!"
}