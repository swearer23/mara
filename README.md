<p align="center">
<img src="https://raw.githubusercontent.com/swearer23/mara/master/images/logo.png?raw=true" alt="logo" />
</p>

# Frontend Error Logger with Node.js Server

Mara is designed to help frontend developers collect and manage error logs generated by JavaScript applications. It includes both a frontend component for logging errors and a Node.js server for handling and storing these logs in Elasticsearch. The server also implements a simple authentication mechanism for added security.

## Features

- Support Vue.js, React, and Angular applications and vanilla js applications.
- Collect and log frontend errors in a central location.
- Send error logs to a Node.js server using secure authentication.
- Store error logs in Elasticsearch for easy analysis and troubleshooting.

## Installation

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/swearer23/mara.git
   cd mara
   ```
2. Install the dependencies:

   ```bash
    npm install
    ```
3. Edit `config.js` file in the root directory of the project for following environment variables:

   ```bash
    export const REPORT_HOST='localhost' # Hostname of the server
    export const REPORT_PORT=6006PORT=3000 # Port number of the server
    ```
4. Run the server:
  
   ```bash
   git clone https://github.com/swearer23/julianos.git
   cd julianos && npm install && npm start
    ```

5. Run demo application for collecting exceptions:

   ```bash
   cd mara && npm run dev
    ```

6. Open `http://localhost:8888` in your browser.

BY clicking around the page, you can generate exceptions and see them in the console. The exceptions will be sent to the server and stored in Elasticsearch.
(You will need to have Elasticsearch installed and running on your machine for this to work.)

<img src="https://raw.githubusercontent.com/swearer23/mara/master/images/demo.png?raw=true" alt="logo" />
