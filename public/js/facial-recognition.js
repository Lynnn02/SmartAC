/**
 * SmartAC VTU - Facial Recognition System
 * This script handles facial recognition for student engagement monitoring
 */

// DOM Elements
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const captureButton = document.getElementById('captureButton');
const switchCameraButton = document.getElementById('switchCameraButton');
const cameraContainer = document.getElementById('camera-container');
const cameraPlaceholder = document.getElementById('camera-placeholder');
const studentsCount = document.getElementById('students-count');
const attentionLevel = document.getElementById('attention-level');
const happyMeter = document.getElementById('happy-meter');
const neutralMeter = document.getElementById('neutral-meter');
const confusedMeter = document.getElementById('confused-meter');
const aiInsights = document.getElementById('ai-insights');
const studentList = document.getElementById('student-list');

// Global variables
let currentStream = null;
let isModelLoaded = false;
let detectionInterval = null;
let faceMatcher = null;
let engagementChart = null;
let engagementData = {
    labels: [],
    attention: [],
    happy: [],
    neutral: [],
    confused: []
};
let currentFaces = [];
let knownStudents = [
    { id: 1, name: 'Student 1', descriptor: null },
    { id: 2, name: 'Student 2', descriptor: null },
    { id: 3, name: 'Student 3', descriptor: null }
];

// Initialize the application
async function init() {
    try {
        // Load face-api.js models
        await loadModels();
        
        // Initialize chart
        initEngagementChart();
        
        // Add event listeners
        startButton.addEventListener('click', startCamera);
        stopButton.addEventListener('click', stopCamera);
        captureButton.addEventListener('click', captureSnapshot);
        switchCameraButton.addEventListener('click', switchCamera);
        
        console.log('Facial recognition system initialized');
    } catch (error) {
        console.error('Error initializing facial recognition:', error);
        showError('Failed to initialize facial recognition system. Please refresh the page and try again.');
    }
}

// Load required face-api.js models
async function loadModels() {
    try {
        // Use direct CDN paths for models
        const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
        
        // Display loading message
        showMessage('Loading facial recognition models... This may take a moment.');
        console.log('Loading models from:', modelPath);
        
        // Load models sequentially with progress logging
        console.log('Loading TinyFaceDetector model...');
        await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
        console.log('TinyFaceDetector model loaded');
        
        console.log('Loading FaceLandmark68 model...');
        await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
        console.log('FaceLandmark68 model loaded');
        
        console.log('Loading FaceExpression model...');
        await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
        console.log('FaceExpression model loaded');
        
        // Only load recognition model if needed for student identification
        console.log('Loading FaceRecognition model...');
        await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
        console.log('FaceRecognition model loaded');
        
        isModelLoaded = true;
        showMessage('Models loaded successfully! Click Start to begin monitoring.');
        startButton.disabled = false;
        
        // For demo purposes, we'll create some mock face descriptors
        createMockDescriptors();
        
        // Log success
        console.log('All models loaded successfully');
        
    } catch (error) {
        console.error('Error loading models:', error);
        showError('Failed to load facial recognition models: ' + error.message + '. Please check your internet connection and try again.');
        throw error;
    }
}

// Create mock face descriptors for demo purposes
function createMockDescriptors() {
    // In a real application, these would be loaded from a database
    knownStudents.forEach(student => {
        // Create a random face descriptor (128-dimensional vector)
        const mockDescriptor = new Float32Array(128);
        for (let i = 0; i < 128; i++) {
            mockDescriptor[i] = Math.random() * 2 - 1; // Random values between -1 and 1
        }
        student.descriptor = mockDescriptor;
    });
    
    // Create a FaceMatcher with the mock descriptors
    const labeledDescriptors = knownStudents.map(student => 
        new faceapi.LabeledFaceDescriptors(student.name, [student.descriptor])
    );
    
    faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);
}

// Start camera stream
async function startCamera() {
    try {
        if (!isModelLoaded) {
            showError('Models are not loaded yet. Please wait.');
            return;
        }
        
        // Check if browser supports getUserMedia
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showError('Your browser does not support camera access. Please try a different browser.');
            return;
        }
        
        console.log('Requesting camera access...');
        
        // Get user media with more flexible constraints
        const constraints = {
            video: {
                width: { min: 320, ideal: 640, max: 1280 },
                height: { min: 240, ideal: 480, max: 720 },
                facingMode: 'user',
                frameRate: { ideal: 30 }
            }
        };
        
        // First check if we can access the camera
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            console.log(`Found ${videoDevices.length} video devices:`, videoDevices);
            
            if (videoDevices.length === 0) {
                showError('No camera detected on your device.');
                return;
            }
        } catch (err) {
            console.error('Error checking camera devices:', err);
        }
        
        // Now try to get the stream
        currentStream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = currentStream;
        video.play();
        
        console.log('Camera stream started');
        
        // Wait for video to be loaded
        await new Promise(resolve => {
            video.onloadedmetadata = () => {
                console.log('Video metadata loaded');
                resolve();
            };
            
            // Add a timeout in case onloadedmetadata doesn't fire
            setTimeout(() => {
                if (video.readyState >= 2) { // HAVE_CURRENT_DATA or better
                    console.log('Video ready state:', video.readyState);
                    resolve();
                }
            }, 1000);
        });
        
        // Show video container and hide placeholder
        cameraContainer.style.display = 'block';
        cameraPlaceholder.style.display = 'none';
        
        // Set canvas dimensions to match video
        const videoWidth = video.videoWidth || 640;
        const videoHeight = video.videoHeight || 480;
        console.log(`Video dimensions: ${videoWidth}x${videoHeight}`);
        
        overlay.width = videoWidth;
        overlay.height = videoHeight;
        
        // Enable/disable buttons
        startButton.disabled = true;
        stopButton.disabled = false;
        captureButton.disabled = false;
        
        // Start face detection
        startFaceDetection();
        
    } catch (error) {
        console.error('Error starting camera:', error);
        showError('Failed to access camera: ' + error.message + '. Please make sure you have granted camera permissions.');
    }
}

// Stop camera stream
function stopCamera() {
    if (currentStream) {
        // Stop all tracks
        currentStream.getTracks().forEach(track => track.stop());
        currentStream = null;
        
        // Clear video source
        video.srcObject = null;
        
        // Hide video container and show placeholder
        cameraContainer.style.display = 'none';
        cameraPlaceholder.style.display = 'flex';
        
        // Clear canvas
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);
        
        // Enable/disable buttons
        startButton.disabled = false;
        stopButton.disabled = true;
        captureButton.disabled = true;
        
        // Stop face detection
        stopFaceDetection();
        
        // Reset metrics
        resetMetrics();
    }
}

// Switch between front and back camera
async function switchCamera() {
    if (currentStream) {
        // Get current facing mode
        const currentFacingMode = currentStream.getVideoTracks()[0].getSettings().facingMode;
        const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
        
        // Stop current stream
        stopCamera();
        
        // Start new stream with different facing mode
        try {
            currentStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: newFacingMode
                }
            });
            
            video.srcObject = currentStream;
            
            // Wait for video to be loaded
            await new Promise(resolve => {
                video.onloadedmetadata = () => {
                    resolve();
                };
            });
            
            // Show video container and hide placeholder
            cameraContainer.style.display = 'block';
            cameraPlaceholder.style.display = 'none';
            
            // Set canvas dimensions to match video
            overlay.width = video.videoWidth;
            overlay.height = video.videoHeight;
            
            // Enable/disable buttons
            startButton.disabled = true;
            stopButton.disabled = false;
            captureButton.disabled = false;
            
            // Start face detection
            startFaceDetection();
            
        } catch (error) {
            console.error('Error switching camera:', error);
            showError('Failed to switch camera. Your device may not support multiple cameras.');
        }
    }
}

// Capture a snapshot
function captureSnapshot() {
    if (currentStream) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/png');
        
        // Create a download link
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `classroom-snapshot-${new Date().toISOString().replace(/:/g, '-')}.png`;
        link.click();
    }
}

// Start face detection interval
function startFaceDetection() {
    if (detectionInterval) {
        clearInterval(detectionInterval);
    }
    
    // Run detection once immediately
    detectFaces();
    
    // Then set up interval - using requestAnimationFrame for smoother performance
    let lastDetectionTime = 0;
    const detectionFrequency = 500; // Detect faces every 500ms for more responsive detection
    
    const runDetection = async (timestamp) => {
        if (!detectionInterval) return; // Stop if interval was cleared
        
        // Only run detection if enough time has passed
        if (timestamp - lastDetectionTime >= detectionFrequency) {
            lastDetectionTime = timestamp;
            await detectFaces();
        }
        
        // Schedule next frame
        detectionInterval = requestAnimationFrame(runDetection);
    };
    
    // Start the detection loop
    detectionInterval = requestAnimationFrame(runDetection);
    
    console.log('Face detection started');
}

// Stop face detection interval
function stopFaceDetection() {
    if (detectionInterval) {
        // Cancel animation frame instead of clearInterval
        cancelAnimationFrame(detectionInterval);
        detectionInterval = null;
        console.log('Face detection stopped');
    }
}

// Detect faces in the video stream
async function detectFaces() {
    if (!video.paused && !video.ended && video.readyState === 4) {
        try {
            console.log('Detecting faces...');
            
            // Use simpler detection options for better performance
            const options = new faceapi.TinyFaceDetectorOptions({ 
                inputSize: 320,    // smaller input size for faster processing
                scoreThreshold: 0.3 // lower threshold to detect more faces
            });
            
            // First try with just face detection to ensure it's working
            const faceDetections = await faceapi.detectAllFaces(video, options);
            console.log(`Detected ${faceDetections.length} faces`);
            
            // Then add the additional processing if faces were found
            let detections = faceDetections;
            if (faceDetections.length > 0) {
                detections = await faceapi.detectAllFaces(video, options)
                    .withFaceLandmarks()
                    .withFaceExpressions();
                    
                // Only add descriptors if we need them for recognition
                if (faceMatcher) {
                    detections = await faceapi.detectAllFaces(video, options)
                        .withFaceLandmarks()
                        .withFaceExpressions()
                        .withFaceDescriptors();
                }
            }
            
            // Clear previous drawings
            const ctx = overlay.getContext('2d');
            ctx.clearRect(0, 0, overlay.width, overlay.height);
            
            // Resize detections to match display size
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            
            // Store current faces
            currentFaces = resizedDetections;
            
            // Draw detections on canvas
            drawDetections(ctx, resizedDetections);
            
            // Update metrics
            updateMetrics(resizedDetections);
            
            // Update engagement chart
            updateEngagementChart(resizedDetections);
            
            // Update student list
            updateStudentList(resizedDetections);
            
            // Generate AI insights
            generateInsights(resizedDetections);
            
        } catch (error) {
            console.error('Error detecting faces:', error);
            showError('Face detection error: ' + error.message);
        }
    }
}

// Draw face detections on canvas
function drawDetections(ctx, detections) {
    detections.forEach(detection => {
        // Draw face box
        const { x, y, width, height } = detection.detection.box;
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
        
        // Draw face landmarks
        // faceapi.draw.drawFaceLandmarks(overlay, detection);
        
        // Get best match if we have a face matcher
        if (faceMatcher) {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            
            // Draw label
            const text = bestMatch.toString();
            const textWidth = ctx.measureText(text).width;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(x, y + height, width, 20);
            
            ctx.font = '16px Arial';
            ctx.fillStyle = '#fff';
            ctx.fillText(text, x + 5, y + height + 15);
            
            // Draw emotion label
            const emotion = getTopEmotion(detection.expressions);
            const emotionText = `${emotion.emotion}: ${Math.round(emotion.probability * 100)}%`;
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
            ctx.fillRect(x, y - 20, width, 20);
            
            ctx.font = '14px Arial';
            ctx.fillStyle = getEmotionColor(emotion.emotion);
            ctx.fillText(emotionText, x + 5, y - 5);
        }
    });
}

// Get the top emotion from expressions
function getTopEmotion(expressions) {
    let topEmotion = { emotion: 'neutral', probability: 0 };
    
    for (const [emotion, probability] of Object.entries(expressions)) {
        if (probability > topEmotion.probability) {
            topEmotion = { emotion, probability };
        }
    }
    
    return topEmotion;
}

// Get color for emotion
function getEmotionColor(emotion) {
    switch (emotion) {
        case 'happy':
            return '#28a745'; // Green
        case 'sad':
        case 'fearful':
        case 'disgusted':
        case 'angry':
            return '#dc3545'; // Red
        case 'surprised':
            return '#ffc107'; // Yellow
        case 'neutral':
        default:
            return '#17a2b8'; // Blue
    }
}

// Update metrics based on detections
function updateMetrics(detections) {
    // Update student count
    studentsCount.textContent = detections.length;
    
    // Calculate emotion distributions
    let happyCount = 0;
    let neutralCount = 0;
    let confusedCount = 0; // We'll consider sad, fearful, disgusted, angry as confused
    
    detections.forEach(detection => {
        const expressions = detection.expressions;
        const topEmotion = getTopEmotion(expressions);
        
        switch (topEmotion.emotion) {
            case 'happy':
                happyCount++;
                break;
            case 'neutral':
                neutralCount++;
                break;
            case 'sad':
            case 'fearful':
            case 'disgusted':
            case 'angry':
                confusedCount++;
                break;
        }
    });
    
    // Calculate percentages
    const total = detections.length || 1; // Avoid division by zero
    const happyPercentage = (happyCount / total) * 100;
    const neutralPercentage = (neutralCount / total) * 100;
    const confusedPercentage = (confusedCount / total) * 100;
    
    // Update progress bars
    happyMeter.style.width = `${happyPercentage}%`;
    happyMeter.setAttribute('aria-valuenow', happyPercentage);
    
    neutralMeter.style.width = `${neutralPercentage}%`;
    neutralMeter.setAttribute('aria-valuenow', neutralPercentage);
    
    confusedMeter.style.width = `${confusedPercentage}%`;
    confusedMeter.setAttribute('aria-valuenow', confusedPercentage);
    
    // Calculate attention level (happy + neutral)
    const attentionPercentage = happyPercentage + neutralPercentage;
    attentionLevel.style.width = `${attentionPercentage}%`;
    attentionLevel.setAttribute('aria-valuenow', attentionPercentage);
    
    // Change color based on attention level
    if (attentionPercentage >= 80) {
        attentionLevel.classList.remove('bg-warning', 'bg-danger');
        attentionLevel.classList.add('bg-success');
    } else if (attentionPercentage >= 50) {
        attentionLevel.classList.remove('bg-success', 'bg-danger');
        attentionLevel.classList.add('bg-warning');
    } else {
        attentionLevel.classList.remove('bg-success', 'bg-warning');
        attentionLevel.classList.add('bg-danger');
    }
}

// Reset all metrics
function resetMetrics() {
    studentsCount.textContent = '0';
    
    attentionLevel.style.width = '0%';
    attentionLevel.setAttribute('aria-valuenow', 0);
    
    happyMeter.style.width = '0%';
    happyMeter.setAttribute('aria-valuenow', 0);
    
    neutralMeter.style.width = '0%';
    neutralMeter.setAttribute('aria-valuenow', 0);
    
    confusedMeter.style.width = '0%';
    confusedMeter.setAttribute('aria-valuenow', 0);
    
    aiInsights.textContent = 'Start monitoring to receive real-time insights about student engagement.';
    
    // Clear student list
    studentList.innerHTML = `
        <li class="list-group-item bg-transparent text-center text-muted py-4">
            <i class="bi bi-people"></i> No students detected yet
        </li>
    `;
    
    // Reset chart data
    engagementData = {
        labels: [],
        attention: [],
        happy: [],
        neutral: [],
        confused: []
    };
    
    // Update chart
    if (engagementChart) {
        engagementChart.data.labels = [];
        engagementChart.data.datasets[0].data = [];
        engagementChart.data.datasets[1].data = [];
        engagementChart.data.datasets[2].data = [];
        engagementChart.data.datasets[3].data = [];
        engagementChart.update();
    }
}

// Initialize engagement chart
function initEngagementChart() {
    const ctx = document.getElementById('engagementChart').getContext('2d');
    
    engagementChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Attention',
                    data: [],
                    borderColor: '#0d6efd',
                    backgroundColor: 'rgba(13, 110, 253, 0.1)',
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'Happy',
                    data: [],
                    borderColor: '#28a745',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4
                },
                {
                    label: 'Neutral',
                    data: [],
                    borderColor: '#ffc107',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4
                },
                {
                    label: 'Confused',
                    data: [],
                    borderColor: '#dc3545',
                    backgroundColor: 'transparent',
                    borderDash: [5, 5],
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        boxWidth: 6
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            }
        }
    });
}

// Update engagement chart with new data
function updateEngagementChart(detections) {
    // Calculate metrics
    const total = detections.length || 1;
    let happyCount = 0;
    let neutralCount = 0;
    let confusedCount = 0;
    
    detections.forEach(detection => {
        const expressions = detection.expressions;
        const topEmotion = getTopEmotion(expressions);
        
        switch (topEmotion.emotion) {
            case 'happy':
                happyCount++;
                break;
            case 'neutral':
                neutralCount++;
                break;
            case 'sad':
            case 'fearful':
            case 'disgusted':
            case 'angry':
                confusedCount++;
                break;
        }
    });
    
    // Calculate percentages
    const happyPercentage = (happyCount / total) * 100;
    const neutralPercentage = (neutralCount / total) * 100;
    const confusedPercentage = (confusedCount / total) * 100;
    const attentionPercentage = happyPercentage + neutralPercentage;
    
    // Get current time
    const now = new Date();
    const timeLabel = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add data to arrays
    engagementData.labels.push(timeLabel);
    engagementData.attention.push(attentionPercentage);
    engagementData.happy.push(happyPercentage);
    engagementData.neutral.push(neutralPercentage);
    engagementData.confused.push(confusedPercentage);
    
    // Keep only the last 20 data points
    if (engagementData.labels.length > 20) {
        engagementData.labels.shift();
        engagementData.attention.shift();
        engagementData.happy.shift();
        engagementData.neutral.shift();
        engagementData.confused.shift();
    }
    
    // Update chart
    engagementChart.data.labels = engagementData.labels;
    engagementChart.data.datasets[0].data = engagementData.attention;
    engagementChart.data.datasets[1].data = engagementData.happy;
    engagementChart.data.datasets[2].data = engagementData.neutral;
    engagementChart.data.datasets[3].data = engagementData.confused;
    engagementChart.update();
}

// Update student list
function updateStudentList(detections) {
    if (detections.length === 0) {
        studentList.innerHTML = `
            <li class="list-group-item bg-transparent text-center text-muted py-4">
                <i class="bi bi-people"></i> No students detected yet
            </li>
        `;
        return;
    }
    
    // Clear list
    studentList.innerHTML = '';
    
    // Add detected students
    detections.forEach((detection, index) => {
        let studentName = `Unknown Student ${index + 1}`;
        let matchScore = 0;
        
        // Try to match with known students
        if (faceMatcher) {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            if (bestMatch.label !== 'unknown') {
                studentName = bestMatch.label;
                matchScore = (1 - bestMatch.distance) * 100;
            }
        }
        
        // Get top emotion
        const topEmotion = getTopEmotion(detection.expressions);
        const emotionIcon = getEmotionIcon(topEmotion.emotion);
        const emotionColor = getEmotionColor(topEmotion.emotion);
        
        // Create list item
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item bg-transparent d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div>
                <span class="fw-medium">${studentName}</span>
                <div class="small text-muted">Match confidence: ${Math.round(matchScore)}%</div>
            </div>
            <span class="badge rounded-pill" style="background-color: ${emotionColor}">
                ${emotionIcon} ${topEmotion.emotion}
            </span>
        `;
        
        studentList.appendChild(listItem);
    });
}

// Get emotion icon
function getEmotionIcon(emotion) {
    switch (emotion) {
        case 'happy':
            return '<i class="bi bi-emoji-smile"></i>';
        case 'sad':
            return '<i class="bi bi-emoji-frown"></i>';
        case 'angry':
            return '<i class="bi bi-emoji-angry"></i>';
        case 'fearful':
            return '<i class="bi bi-emoji-dizzy"></i>';
        case 'disgusted':
            return '<i class="bi bi-emoji-expressionless"></i>';
        case 'surprised':
            return '<i class="bi bi-emoji-surprise"></i>';
        case 'neutral':
        default:
            return '<i class="bi bi-emoji-neutral"></i>';
    }
}

// Generate AI insights based on detections
function generateInsights(detections) {
    if (detections.length === 0) {
        aiInsights.textContent = 'No students detected. Make sure the camera is positioned to capture students\' faces.';
        return;
    }
    
    // Calculate metrics
    const total = detections.length;
    let happyCount = 0;
    let neutralCount = 0;
    let confusedCount = 0;
    
    detections.forEach(detection => {
        const expressions = detection.expressions;
        const topEmotion = getTopEmotion(expressions);
        
        switch (topEmotion.emotion) {
            case 'happy':
                happyCount++;
                break;
            case 'neutral':
                neutralCount++;
                break;
            case 'sad':
            case 'fearful':
            case 'disgusted':
            case 'angry':
                confusedCount++;
                break;
        }
    });
    
    // Calculate percentages
    const happyPercentage = (happyCount / total) * 100;
    const neutralPercentage = (neutralCount / total) * 100;
    const confusedPercentage = (confusedCount / total) * 100;
    
    // Generate insights based on percentages
    let insight = '';
    
    if (confusedPercentage > 50) {
        insight = `High confusion detected (${Math.round(confusedPercentage)}%). Consider reviewing the current topic or asking if students have questions.`;
    } else if (confusedPercentage > 30) {
        insight = `Moderate confusion detected (${Math.round(confusedPercentage)}%). Some students may be struggling with the current topic.`;
    } else if (happyPercentage > 70) {
        insight = `High engagement detected (${Math.round(happyPercentage)}% happy). Students appear to be enjoying the lesson.`;
    } else if (neutralPercentage > 70) {
        insight = `Students are attentive (${Math.round(neutralPercentage)}% neutral) but could benefit from more interactive content.`;
    } else {
        insight = `Mixed emotions detected. ${total} students are present with varying levels of engagement.`;
    }
    
    // Add trend analysis if we have enough data points
    if (engagementData.attention.length > 5) {
        const lastFive = engagementData.attention.slice(-5);
        const average = lastFive.reduce((a, b) => a + b, 0) / lastFive.length;
        const firstValue = lastFive[0];
        const lastValue = lastFive[lastFive.length - 1];
        const trend = lastValue - firstValue;
        
        if (trend > 10) {
            insight += ' Engagement is trending upward, your current approach is working well.';
        } else if (trend < -10) {
            insight += ' Engagement is trending downward, consider changing pace or introducing an activity.';
        }
    }
    
    aiInsights.textContent = insight;
}

// Show error message
function showError(message) {
    aiInsights.textContent = message;
    aiInsights.parentElement.classList.remove('alert-info');
    aiInsights.parentElement.classList.add('alert-danger');
}

// Show message
function showMessage(message) {
    aiInsights.textContent = message;
    aiInsights.parentElement.classList.remove('alert-danger');
    aiInsights.parentElement.classList.add('alert-info');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
