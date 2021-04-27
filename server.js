const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Define a port
const port = 6969;
// create a server
const server = http.createServer(express);
// Create a web socket server
const wss = new WebSocket.Server({ server })

// Handle a web socket connection
wss.on('connection', (ws) => {
	// After making a connection start listening for messages
	console.log('client connecting')

  // Handle 
  ws.on('message', (data) => {
		// For each client broadcast the data
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    })
  })
})

server.listen(port, () => {
    console.log(`Server is listening on ${port}!`)
  })

// Get references to DOM elements
const sendBtn = document.querySelector('#send')
const messages = document.querySelector('#messages')
const messageInput = document.querySelector('#message-input')

let ws

// Display messages from the websocket
function showMessage(message) {
    messages.innerHTML += `${message}\n\n` // display the message
    messages.scrollTop = messages.scrollHeight // scroll to the top
    messageInput.value = '' // clear the input field
  }

  function init() {
    // Clean up before restarting a websocket connection
    if (ws) {
      ws.onerror = ws.onopen = ws.onclose = null;
      ws.close();
    }
  
    // Make a new Websocket
    ws = new WebSocket('ws://localhost:6969')
  
    // Handle the connection when it opens
    ws.onopen = () => console.log('!Connection opened!')
  
    // handle a message event
    ws.onmessage = (e) => showMessage(JSON.parse(e.data))
    
    // Handle a close event
    ws.onclose = () => ws = null
  
  }
  
  // Handle button clicks
  sendBtn.onclick = function () {
    // Send a message
    if (!ws) {
      showMessage("No WebSocket connection :(");
      return;
    }
  
    ws.send(messageInput.value);
    showMessage(messageInput.value);
  }
  
  init();