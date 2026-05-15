# 🚀 System Terminal Web App

Welcome to the **System Terminal Web App**! This is a containerized full-stack application with a "geeky" retro terminal UI. It features a REST API and real-time WebSockets to stream system metrics directly to your browser.

## 🌟 How It Works

Here is a simple flowchart explaining the architecture:

```mermaid
flowchart TD
    Client((💻 Web Browser))

    subrange Nginx
        Proxy[Nginx Reverse Proxy\n:80]
    end

    subrange Backend
        API[Express REST API\n/api]
        WS[Socket.io Server\n/socket.io]
    end

    Client -- "1. HTTP GET / (Static Files)" --> Proxy
    Proxy -- "Returns HTML, CSS, JS" --> Client

    Client -- "2. HTTP GET /api/*" --> Proxy
    Proxy -- "Forwards Request" --> API
    API -- "JSON Response" --> Proxy
    Proxy -- "JSON Response" --> Client

    Client -- "3. WebSocket Connection /socket.io" --> Proxy
    Proxy -- "Upgrades Connection" --> WS
    WS -- "Pushes Real-time Data" --> Client
```

### 🧩 Components

1. **Frontend**: A static HTML/CSS/JS interface that looks like a retro terminal. It connects to the backend API to check the system status and listens to WebSockets for real-time updates.
2. **Backend**: A Node.js (Express) server that provides a REST API and a Socket.io WebSocket server. It simulates system metrics (CPU/Memory) and pushes them to connected clients every 2 seconds.
3. **Nginx Reverse Proxy**: The traffic controller. It serves the static frontend files and routes `/api` and `/socket.io` requests to the Node.js backend.
4. **Docker**: Packages the backend and Nginx into separate containers to ensure they run consistently anywhere.
5. **GitHub Actions**: A CI/CD pipeline that automatically deploys the application to a VPS whenever changes are pushed to the `main` branch.

## 🛠️ Getting Started Locally

To run this application on your machine, you'll need [Docker](https://www.docker.com/) installed.

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-directory>
   ```

2. **Start the application:**
   ```bash
   docker compose up --build
   ```

3. **View the app:**
   Open your browser and navigate to `http://localhost`.

## 📦 Automated Deployment (CI/CD)

This project includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically deploys the application to a remote VPS via SSH.

To enable this, set the following Secrets in your GitHub repository:
- `VPS_HOST`: The IP address of your server.
- `VPS_USERNAME`: Your SSH username (e.g., `root`).
- `VPS_SSH_KEY`: Your private SSH key.
- `VPS_TARGET_DIR`: The directory on the VPS where the app should live (e.g., `/var/www/system-terminal`).

Whenever you push to the `main` branch, GitHub will connect to your server, pull the latest code, and restart the Docker containers!

---

## Live Preview
*(Please note: Since this is currently running via Localtunnel, you may need to click "Click to Continue" when you open the URL. Also note that since only the static frontend is running in this preview, the API and WebSocket connections will show as failed/disconnected, but you can see the terminal UI design!)*

**[View Live Preview Here](https://tricky-ghosts-show.loca.lt)**
