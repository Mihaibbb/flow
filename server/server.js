const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);


app.get("/", (req, res) => {
    res.send("Web3 here!");
});

const devices = [];

io.on("connection", socket => {
    console.log("Socket connected", socket.id);
    devices.push({ id: socket.id });
    socket.on("connect_mobile", (socketId) => {
        devices.forEach((device, idx) => device.id === socketId ? devices[idx] = {...devices[idx], mobile: true} : null);
        
    });

    socket.on("connect_camera", (socketId) => {
        devices.forEach((device, idx) => device.id === socketId ? devices[idx] = {...devices[idx], camera: true} : null);
    });

    socket.on("send_data", (data) => {
        const mobileDevices = devices.filter(device => device.mobile);
        mobileDevices.forEach(device => {
            io.to(device.id).emit("recieve_data", data);
            
        });
    }); 

    socket.on("disconnect", () => {
        devices.filter(device => device.id !== socket.id);
    });
});


const port = 3000;
server.listen(port, () => {
    console.log("Server started")
});