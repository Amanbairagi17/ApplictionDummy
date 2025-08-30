#!/bin/bash

echo "========================================"
echo "    Grabtitude Project Startup Script"
echo "========================================"
echo

echo "Starting Backend (Spring Boot)..."
echo
cd Backend
gnome-terminal --title="Backend - Spring Boot" -- bash -c "mvnw spring-boot:run; exec bash" &
echo "Backend started in new terminal"
echo

echo "Waiting for backend to start..."
sleep 10

echo "Starting Frontend (React)..."
echo
cd ../Frontend
gnome-terminal --title="Frontend - React" -- bash -c "npm run dev; exec bash" &
echo "Frontend started in new terminal"
echo

echo "========================================"
echo "    Project Started Successfully!"
echo "========================================"
echo
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo
echo "Test Backend: http://localhost:8080/auth/test"
echo
echo "Press Enter to exit this script..."
read
