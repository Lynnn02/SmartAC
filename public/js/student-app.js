/**
 * Student Module Functionality
 * Handles common student module operations, Firebase integration,
 * and UI/UX improvements for a consistent experience
 */

// Initialize AOS animations
AOS.init();

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add padding to body for fixed header
    document.body.style.paddingTop = document.querySelector('header').offsetHeight + 'px';

    // Firebase Authentication State Change
    if (typeof firebase !== 'undefined' && firebase.auth) {
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('User is signed in:', user.email);
                // You can update UI elements based on user authentication status
            } else {
                console.log('User is signed out');
                // Redirect to login page if needed
                // window.location.href = '/login';
            }
        });
    }

    // Initialize components based on current page
    initializeCurrentPage();
});

/**
 * Initialize page-specific functionality
 */
function initializeCurrentPage() {
    const currentPath = window.location.pathname;
    
    // Dashboard page
    if (currentPath.includes('/student/dashboard')) {
        initializeDashboard();
    }
    
    // Components page
    else if (currentPath.includes('/student/components')) {
        initializeComponentsPage();
    }
    
    // Component detail page
    else if (currentPath.includes('/student/component/')) {
        initializeComponentDetail();
    }
    
    // Sessions page
    else if (currentPath.includes('/student/sessions') && !currentPath.includes('/session/')) {
        initializeSessionsPage();
    }
    
    // Session detail page
    else if (currentPath.includes('/student/session/')) {
        initializeSessionDetailPage();
    }
    
    // AR mode page
    else if (currentPath.includes('/student/ar-mode')) {
        initializeARMode();
    }
}

/**
 * Dashboard initialization
 */
function initializeDashboard() {
    console.log('Initializing dashboard...');
    
    // Progress charts (using Chart.js if available)
    const progressCharts = document.querySelectorAll('.progress-chart');
    
    if (progressCharts.length > 0 && typeof Chart !== 'undefined') {
        progressCharts.forEach(chartCanvas => {
            const ctx = chartCanvas.getContext('2d');
            const completionPercentage = parseInt(chartCanvas.getAttribute('data-completion')) || 0;
            
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [completionPercentage, 100 - completionPercentage],
                        backgroundColor: ['#4e73df', '#f2f6fc'],
                        borderWidth: 0
                    }]
                },
                options: {
                    cutout: '80%',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            enabled: false
                        }
                    }
                }
            });
        });
    }
}

/**
 * Components page initialization
 */
function initializeComponentsPage() {
    console.log('Initializing components page...');
    
    // Component search functionality
    const searchInput = document.getElementById('componentSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const componentItems = document.querySelectorAll('.component-item');
            
            componentItems.forEach(item => {
                const componentName = item.querySelector('.card-title').textContent.toLowerCase();
                const componentDescription = item.querySelector('.card-text').textContent.toLowerCase();
                
                if (componentName.includes(searchTerm) || componentDescription.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Component filtering (if filter buttons exist)
    const filterButtons = document.querySelectorAll('.component-filter');
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterCategory = this.getAttribute('data-category');
                const componentItems = document.querySelectorAll('.component-item');
                
                componentItems.forEach(item => {
                    if (filterCategory === 'all') {
                        item.style.display = '';
                    } else if (item.getAttribute('data-category') === filterCategory) {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
}

/**
 * Component detail page initialization
 */
function initializeComponentDetail() {
    console.log('Initializing component detail page...');
    
    // 3D model viewer will be initialized separately if needed
    
    // Component quiz functionality (if quiz exists)
    const quizForm = document.getElementById('componentQuiz');
    if (quizForm) {
        quizForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Process quiz answers
            const quizQuestions = quizForm.querySelectorAll('.quiz-question');
            let correctAnswers = 0;
            
            quizQuestions.forEach(question => {
                const selectedOption = question.querySelector('input[type="radio"]:checked');
                if (selectedOption && selectedOption.value === 'correct') {
                    correctAnswers++;
                    question.classList.add('correct-answer');
                } else {
                    question.classList.add('incorrect-answer');
                }
            });
            
            // Display quiz result
            const resultElement = document.getElementById('quizResult');
            if (resultElement) {
                const percentage = Math.round((correctAnswers / quizQuestions.length) * 100);
                resultElement.innerHTML = `<div class="alert alert-info">You scored ${correctAnswers}/${quizQuestions.length} (${percentage}%)</div>`;
                resultElement.scrollIntoView({ behavior: 'smooth' });
                
                // Save result to Firebase if user is authenticated
                if (firebase.auth && firebase.auth().currentUser) {
                    saveQuizResult(percentage);
                }
            }
        });
    }
}

/**
 * Sessions page initialization
 */
function initializeSessionsPage() {
    console.log('Initializing sessions page...');
    
    // Session search functionality
    const searchInput = document.getElementById('sessionSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const sessionItems = document.querySelectorAll('.session-item');
            
            sessionItems.forEach(item => {
                const sessionTitle = item.querySelector('.card-header h5').textContent.toLowerCase();
                const sessionDesc = item.querySelector('.card-body p:last-child').textContent.toLowerCase();
                const teacherName = item.querySelector('.session-footer .fw-medium').textContent.toLowerCase();
                
                if (sessionTitle.includes(searchTerm) || sessionDesc.includes(searchTerm) || teacherName.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Session filter tabs
    const filterTabs = document.querySelectorAll('.session-tab');
    if (filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                const filterValue = this.getAttribute('data-filter');
                const sessionItems = document.querySelectorAll('.session-item');
                
                sessionItems.forEach(item => {
                    if (filterValue === 'all') {
                        item.style.display = '';
                    } else if (filterValue === 'live' && item.getAttribute('data-status') === 'live') {
                        item.style.display = '';
                    } else if (filterValue === 'upcoming' && item.getAttribute('data-status') === 'upcoming') {
                        item.style.display = '';
                    } else if (filterValue === 'joined' && item.getAttribute('data-joined') === 'true') {
                        item.style.display = '';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Session code form
    const sessionCodeInput = document.getElementById('sessionCode');
    const submitSessionCodeBtn = document.getElementById('submitSessionCode');
    
    if (sessionCodeInput && submitSessionCodeBtn) {
        sessionCodeInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
        
        submitSessionCodeBtn.addEventListener('click', function() {
            const code = sessionCodeInput.value.trim();
            if (code.length === 6) {
                // Redirect to session page - in production this would validate with the server first
                window.location.href = `/student/session/${code}`;
            } else {
                alert('Please enter a valid 6-digit session code');
            }
        });
    }
}

/**
 * Session detail page initialization
 */
function initializeSessionDetailPage() {
    console.log('Initializing session detail page...');
    
    // Chat functionality
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    if (messageInput && sendMessageBtn && chatMessages) {
        sendMessageBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendMessage();
            }
        });
        
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                const currentTime = new Date();
                const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const messageHTML = `
                    <div class="message message-sent">
                        <div class="message-content">${message}</div>
                        <div class="message-time">${timeString}</div>
                    </div>
                `;
                
                chatMessages.insertAdjacentHTML('beforeend', messageHTML);
                messageInput.value = '';
                
                // Scroll to bottom of chat
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Store message in Firebase if available
                if (typeof firebase !== 'undefined' && firebase.firestore) {
                    storeMessage(message);
                }
            }
        }
    }
    
    // AR mode
    const viewARBtn = document.getElementById('viewAR');
    if (viewARBtn) {
        const arModeModal = new bootstrap.Modal(document.getElementById('arModeModal'));
        
        viewARBtn.addEventListener('click', function() {
            arModeModal.show();
        });
    }
    
    // Copy AR link
    const copyArLinkBtn = document.getElementById('copyArLink');
    if (copyArLinkBtn) {
        copyArLinkBtn.addEventListener('click', function() {
            const arLink = document.querySelector('.input-group input');
            arLink.select();
            document.execCommand('copy');
            
            // Show copied tooltip
            this.innerHTML = '<i class="bi bi-check"></i> Copied!';
            setTimeout(() => {
                this.innerHTML = '<i class="bi bi-clipboard"></i>';
            }, 2000);
        });
    }
    
    // Leave session
    const leaveSessionBtn = document.getElementById('leaveSession');
    if (leaveSessionBtn) {
        leaveSessionBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to leave this session?')) {
                window.location.href = '/student/sessions';
            }
        });
    }
    
    // Interactive mode
    const startInteractionBtn = document.getElementById('startInteraction');
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', function() {
            alert('Interactive mode activated! Click on highlighted parts of the 3D model to interact with them.');
            this.innerHTML = '<i class="bi bi-x-circle me-2"></i>End Interactive Mode';
            this.classList.remove('btn-primary');
            this.classList.add('btn-danger');
        });
    }
}

/**
 * AR mode page initialization
 */
function initializeARMode() {
    console.log('Initializing AR mode...');
    
    // AR start button
    const startARButton = document.getElementById('startARButton');
    const arStartOverlay = document.getElementById('arStartOverlay');
    
    if (startARButton && arStartOverlay) {
        startARButton.addEventListener('click', function() {
            // Check if browser supports WebXR
            if ('xr' in navigator) {
                // This would typically check for AR support and initialize WebXR
                // For this example, we'll just hide the overlay to simulate starting AR
                arStartOverlay.style.display = 'none';
                
                // In a real implementation, this would initialize WebXR and the AR session
                alert('AR experience starting! In a real implementation, this would launch WebXR.');
            } else {
                alert('Your browser does not support WebXR. Please try using a compatible browser like Chrome on Android or Safari on iOS.');
            }
        });
    }
    
    // AR hotspots
    const hotspots = document.querySelectorAll('.ar-hotspot');
    const infoPanel = document.getElementById('arInfoPanel');
    const infoPanelTitle = document.getElementById('infoPanelTitle');
    const infoPanelDescription = document.getElementById('infoPanelDescription');
    const closeInfoPanel = document.getElementById('closeInfoPanel');
    
    if (hotspots.length > 0 && infoPanel && infoPanelTitle && infoPanelDescription && closeInfoPanel) {
        const hotspotInfo = {
            'compressor-valve': {
                title: 'Compressor Valve',
                description: 'The valve regulates refrigerant flow through the compressor. Common issues include leaks or blockages that affect cooling performance.'
            },
            'pressure-sensor': {
                title: 'Pressure Sensor',
                description: 'Monitors the pressure of the refrigerant in the system. If this fails, the system may not detect low or high pressure conditions.'
            },
            'electrical-connector': {
                title: 'Electrical Connector',
                description: 'Provides power to the compressor clutch. Corrosion or loose connections can prevent the compressor from engaging.'
            }
        };
        
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', function() {
                const infoType = this.getAttribute('data-info');
                const info = hotspotInfo[infoType];
                
                if (info) {
                    infoPanelTitle.textContent = info.title;
                    infoPanelDescription.textContent = info.description;
                    infoPanel.classList.add('active');
                }
            });
        });
        
        closeInfoPanel.addEventListener('click', function() {
            infoPanel.classList.remove('active');
        });
    }
    
    // Component selector
    const componentCards = document.querySelectorAll('.component-card');
    if (componentCards.length > 0 && arStartOverlay) {
        componentCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove active class from all cards
                componentCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked card
                this.classList.add('active');
                
                // In a real implementation, this would load the corresponding 3D model
                const componentName = this.querySelector('h5').textContent;
                console.log(`Loading ${componentName} model for AR view`);
                
                // Reset AR view
                arStartOverlay.style.display = 'flex';
            });
        });
    }
    
    // AR capture button
    const arCaptureBtn = document.getElementById('arCapture');
    if (arCaptureBtn) {
        arCaptureBtn.addEventListener('click', function() {
            // In a real implementation, this would capture the current AR view
            alert('Photo captured! In a real implementation, this would save the current AR view.');
        });
    }
    
    // AR rotation buttons
    const arRotateLeftBtn = document.getElementById('arRotateLeft');
    const arRotateRightBtn = document.getElementById('arRotateRight');
    
    if (arRotateLeftBtn) {
        arRotateLeftBtn.addEventListener('click', function() {
            console.log('Rotating model left');
            // In a real implementation, this would rotate the 3D model
        });
    }
    
    if (arRotateRightBtn) {
        arRotateRightBtn.addEventListener('click', function() {
            console.log('Rotating model right');
            // In a real implementation, this would rotate the 3D model
        });
    }
}

/**
 * Save quiz result to Firebase
 * @param {number} score - Quiz score percentage
 */
function saveQuizResult(score) {
    const currentUser = firebase.auth().currentUser;
    if (currentUser && firebase.firestore) {
        const componentId = window.location.pathname.split('/').pop();
        
        firebase.firestore().collection('userProgress')
            .doc(currentUser.uid)
            .collection('quizResults')
            .add({
                componentId: componentId,
                score: score,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                console.log('Quiz result saved successfully');
            })
            .catch(error => {
                console.error('Error saving quiz result:', error);
            });
    }
}

/**
 * Store chat message in Firebase
 * @param {string} message - The message content to store
 */
function storeMessage(message) {
    const currentUser = firebase.auth().currentUser;
    if (currentUser && firebase.firestore) {
        const sessionId = window.location.pathname.split('/').pop();
        
        firebase.firestore().collection('sessions')
            .doc(sessionId)
            .collection('messages')
            .add({
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Student',
                message: message,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
            .then(() => {
                console.log('Message stored successfully');
            })
            .catch(error => {
                console.error('Error storing message:', error);
            });
    }
}

/**
 * Initialize session-related functionality
 */
function initSessionFunctionality() {
    // Session search functionality
    const searchInput = document.getElementById('sessionSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const sessionItems = document.querySelectorAll('.session-item');
            
            sessionItems.forEach(item => {
                const sessionTitle = item.querySelector('.card-header h5')?.textContent.toLowerCase() || '';
                const sessionDesc = item.querySelector('.card-body p:last-child')?.textContent.toLowerCase() || '';
                const teacherName = item.querySelector('.session-footer .fw-medium')?.textContent.toLowerCase() || '';
                
                if (sessionTitle.includes(searchTerm) || sessionDesc.includes(searchTerm) || teacherName.includes(searchTerm)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Session filter tabs
    const filterTabs = document.querySelectorAll('.session-tab');
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            const sessionItems = document.querySelectorAll('.session-item');
            
            sessionItems.forEach(item => {
                if (filterValue === 'all') {
                    item.style.display = '';
                } else if (filterValue === 'live' && item.getAttribute('data-status') === 'live') {
                    item.style.display = '';
                } else if (filterValue === 'upcoming' && item.getAttribute('data-status') === 'upcoming') {
                    item.style.display = '';
                } else if (filterValue === 'joined' && item.getAttribute('data-joined') === 'true') {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Session code form
    const sessionCodeInput = document.getElementById('sessionCode');
    const submitSessionCodeBtn = document.getElementById('submitSessionCode');
    
    if (sessionCodeInput && submitSessionCodeBtn) {
        sessionCodeInput.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
        });
        
        submitSessionCodeBtn.addEventListener('click', function() {
            const code = sessionCodeInput.value.trim();
            if (code.length === 6) {
                joinSessionByCode(code);
            } else {
                showAlert('Please enter a valid 6-digit session code', 'danger');
            }
        });
    }
    
    // Live chat in sessions
    const messageInput = document.getElementById('messageInput');
    const sendMessageBtn = document.getElementById('sendMessage');
    const chatMessages = document.getElementById('chatMessages');
    
    if (messageInput && sendMessageBtn && chatMessages) {
        sendMessageBtn.addEventListener('click', sendChatMessage);
        messageInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                sendChatMessage();
            }
        });
    }
    
    // Leave session functionality
    const leaveSessionBtn = document.getElementById('leaveSession');
    if (leaveSessionBtn) {
        leaveSessionBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to leave this session?')) {
                // In production, this would update Firebase status
                window.location.href = '/student/sessions';
            }
        });
    }
}

/**
 * Send a chat message in the active session
 */
function sendChatMessage() {
    const messageInput = document.getElementById('messageInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!messageInput || !chatMessages) return;
    
    const message = messageInput.value.trim();
    if (message) {
        const currentTime = new Date();
        const timeString = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message message-sent">
                <div class="message-content">${message}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        chatMessages.insertAdjacentHTML('beforeend', messageHTML);
        messageInput.value = '';
        
        // Scroll to bottom of chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // In production, this would save to Firebase and broadcast to other session participants
        if (window.firebaseDb) {
            console.log('Firebase available - would save message to database');
        }
    }
}

/**
 * Join a session using a session code
 * @param {string} code - The 6-digit session code
 */
function joinSessionByCode(code) {
    // In production, this would validate the code with Firebase first
    if (window.firebaseDb) {
        console.log(`Validating session code: ${code}`);
        // After validation, redirect to the session
    }
    
    // For demo purposes, redirect directly
    window.location.href = `/student/session/${code}`;
}

/**
 * Initialize AR mode functionality
 */
function initARModeFunctionality() {
    // AR start button
    const startARButton = document.getElementById('startARButton');
    const arStartOverlay = document.getElementById('arStartOverlay');
    
    if (startARButton && arStartOverlay) {
        startARButton.addEventListener('click', function() {
            // Check if browser supports WebXR
            if ('xr' in navigator) {
                // This would typically check for AR support and initialize WebXR
                // For this example, we'll just hide the overlay to simulate starting AR
                arStartOverlay.style.display = 'none';
                
                // In a real implementation, this would initialize WebXR and the AR session
                console.log('AR experience starting! In a real implementation, this would launch WebXR.');
            } else {
                showAlert('Your browser does not support AR. Please try using a compatible browser like Chrome on Android or Safari on iOS.', 'danger');
            }
        });
    }
    
    // AR hotspots
    const hotspots = document.querySelectorAll('.ar-hotspot');
    const infoPanel = document.getElementById('arInfoPanel');
    const infoPanelTitle = document.getElementById('infoPanelTitle');
    const infoPanelDescription = document.getElementById('infoPanelDescription');
    const closeInfoPanel = document.getElementById('closeInfoPanel');
    
    if (hotspots.length && infoPanel && infoPanelTitle && infoPanelDescription && closeInfoPanel) {
        const hotspotInfo = {
            'compressor-valve': {
                title: 'Compressor Valve',
                description: 'The valve regulates refrigerant flow through the compressor. Common issues include leaks or blockages that affect cooling performance.'
            },
            'pressure-sensor': {
                title: 'Pressure Sensor',
                description: 'Monitors the pressure of the refrigerant in the system. If this fails, the system may not detect low or high pressure conditions.'
            },
            'electrical-connector': {
                title: 'Electrical Connector',
                description: 'Provides power to the compressor clutch. Corrosion or loose connections can prevent the compressor from engaging.'
            }
        };
        
        hotspots.forEach(hotspot => {
            hotspot.addEventListener('click', function() {
                const infoType = this.getAttribute('data-info');
                const info = hotspotInfo[infoType];
                
                if (info) {
                    infoPanelTitle.textContent = info.title;
                    infoPanelDescription.textContent = info.description;
                    infoPanel.classList.add('active');
                }
            });
        });
        
        closeInfoPanel.addEventListener('click', function() {
            infoPanel.classList.remove('active');
        });
    }
    
    // Component selector in AR mode
    const componentCards = document.querySelectorAll('.component-card');
    
    if (componentCards.length) {
        componentCards.forEach(card => {
            card.addEventListener('click', function() {
                // Remove active class from all cards
                componentCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked card
                this.classList.add('active');
                
                // In a real implementation, this would load the corresponding 3D model
                const componentName = this.querySelector('h5').textContent;
                console.log(`Loading ${componentName} model for AR view`);
                
                // Reset AR view
                if (arStartOverlay) {
                    arStartOverlay.style.display = 'flex';
                }
            });
        });
    }
}

/**
 * Initialize component interaction functionality
 */
function initComponentInteractions() {
    // Interactive mode
    const startInteractionBtn = document.getElementById('startInteraction');
    if (startInteractionBtn) {
        startInteractionBtn.addEventListener('click', function() {
            if (this.textContent.includes('Start')) {
                // Entering interactive mode
                showAlert('Interactive mode activated! Click on highlighted parts of the 3D model to interact with them.', 'info');
                this.innerHTML = '<i class="bi bi-x-circle me-2"></i>End Interactive Mode';
                this.classList.remove('btn-primary');
                this.classList.add('btn-danger');
            } else {
                // Exiting interactive mode
                showAlert('Interactive mode deactivated.', 'info');
                this.innerHTML = '<i class="bi bi-hand-index me-2"></i>Start Interactive Mode';
                this.classList.remove('btn-danger');
                this.classList.add('btn-primary');
            }
        });
    }
    
    // AR mode in component detail
    const viewARBtn = document.getElementById('viewAR');
    const arModeModal = document.getElementById('arModeModal');
    
    if (viewARBtn && arModeModal) {
        viewARBtn.addEventListener('click', function() {
            const bsModal = new bootstrap.Modal(arModeModal);
            bsModal.show();
        });
        
        // Copy AR link
        const copyArLinkBtn = document.getElementById('copyArLink');
        if (copyArLinkBtn) {
            copyArLinkBtn.addEventListener('click', function() {
                const arLink = document.querySelector('.input-group input');
                arLink.select();
                document.execCommand('copy');
                
                // Show copied tooltip
                this.innerHTML = '<i class="bi bi-check"></i> Copied!';
                setTimeout(() => {
                    this.innerHTML = '<i class="bi bi-clipboard"></i>';
                }, 2000);
            });
        }
    }
}

/**
 * Initialize Firebase-specific features
 */
function initFirebaseFeatures() {
    console.log('Firebase is ready for student module features');
    
    const { firebaseAuth, firebaseDb } = window;
    if (!firebaseAuth || !firebaseDb) return;
    
    // Track session participation
    if (window.location.pathname.includes('/student/session/')) {
        const sessionId = window.location.pathname.split('/').pop();
        console.log(`Tracking participation in session: ${sessionId}`);
        
        // In production, this would update a users collection in Firestore
    }
    
    // Track AR mode usage
    if (window.location.pathname.includes('/student/ar-mode')) {
        console.log('Tracking AR mode usage');
        
        // In production, this would update analytics
    }
    
    // Track component interaction
    if (window.location.pathname.includes('/student/component/')) {
        const componentId = window.location.pathname.split('/').pop();
        console.log(`Tracking interaction with component: ${componentId}`);
        
        // In production, this would update a user's learning progress
    }
}

/**
 * Show an alert message to the user
 * @param {string} message - The message to display
 * @param {string} type - The alert type (success, info, warning, danger)
 */
function showAlert(message, type = 'info') {
    // Check if an alert container exists, create one if not
    let alertContainer = document.querySelector('.alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container position-fixed top-0 end-0 p-3';
        alertContainer.style.zIndex = '1060';
        document.body.appendChild(alertContainer);
    }
    
    // Create the alert
    const alertId = 'alert-' + Date.now();
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        const alert = document.getElementById(alertId);
        if (alert) {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }
    }, 5000);
}
