document.addEventListener('DOMContentLoaded', () => {
    const outputDiv = document.getElementById('output');
    const apiStatusEl = document.getElementById('api-status');

    function appendLog(message, type = 'info') {
        const entry = document.createElement('div');
        entry.className = 'log-entry ' + type;

        const now = new Date();
        const timeStr = now.toISOString().split('T')[1].slice(0, -1);

        entry.innerHTML = `<span class="timestamp">[${timeStr}]</span> ${message}`;
        outputDiv.appendChild(entry);

        // Auto-scroll to bottom
        outputDiv.scrollTop = outputDiv.scrollHeight;
    }

    appendLog('Boot sequence initiated...');

    // Test REST API
    fetch('/api/health')
        .then(response => response.json())
        .then(data => {
            apiStatusEl.innerText = `API Status: Online (Uptime: ${data.uptime}s)`;
            appendLog(`REST API Check: SUCCESS - ${JSON.stringify(data)}`, 'success');
        })
        .catch(err => {
            apiStatusEl.innerText = 'API Status: OFFLINE';
            appendLog(`REST API Check: FAILED - ${err.message}`, 'error');
        });

    // Connect to Socket.io
    // Nginx will route /socket.io correctly to the backend
    const socket = io({
        path: '/socket.io'
    });

    socket.on('connect', () => {
        appendLog(`WebSocket connected successfully. ID: ${socket.id}`);
    });

    socket.on('disconnect', () => {
        appendLog('WebSocket disconnected. Attempting to reconnect...', 'error');
    });

    socket.on('system_update', (data) => {
        appendLog(`[SERVER] ${data.message} | CPU: ${data.cpu}% | MEM: ${data.memory}MB`);
    });
});
