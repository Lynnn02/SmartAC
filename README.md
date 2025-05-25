# SmartAC - Car AC Training Platform

SmartAC is a web application designed to help TVET students understand more about practical car air conditioning maintenance and repair. The platform features interactive 3D models, AR visualization, and step-by-step practical modules.

## Features

- **Three User Roles**: Admin, Teacher, and Student
- **Interactive 3D Models**: Explore car AC components in 3D
- **AR Visualization**: View components and procedures in augmented reality
- **Practical Modules**: Step-by-step instructions for car AC maintenance procedures

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the application:
   ```
   npm start
   ```

## User Roles

### Admin
- Can create, read, update, and delete accounts for both teachers and students
- Can edit user details

### Teacher
- Can login (cannot register directly)
- Can edit their profile
- Can create class sessions and choose which practical module to teach students

### Student
- Can login (cannot register directly)
- Can edit their profile
- Can join sessions created by teachers
- Can access the three SOP practical modules as notes even without a teacher
- Can explore the car AC components in 3D

## 3D Models

The application uses GLB files for 3D models. Place your GLB files in the following directory:

```
/public/models/
```

Current available models:
- PressureSwitch.glb
- ReceiverDrier.glb
- SightGlass.glb
- TXV.glb

## Practical Modules

The application includes three practical modules:

1. **Praktikal 1**: Pemasangan Hose Manifold Gauge & Vacuum Hose (Kaedah Manual)
2. **Praktikal 2**: Proses Vacuum System Selepas Baik-Pulih (Kaedah Manual)
3. **Praktikal 3**: Proses Charging Gas Dalam System Selepas Baik-Pulih (Kaedah Manual)

## Development

This is a mockup application built with:
- Node.js
- Express
- EJS templates
- Three.js for 3D model rendering

Future implementations will include Firebase integration for authentication and database functionality.

## License

ISC
