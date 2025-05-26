// Firebase Client-side Initialization
document.addEventListener('DOMContentLoaded', function() {
  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDOf9JEl5Xebo2q3llSr-J3k09p4oyiABk",
    authDomain: "smartac-28a3c.firebaseapp.com",
    projectId: "smartac-28a3c",
    storageBucket: "smartac-28a3c.firebasestorage.app",
    messagingSenderId: "603927886224",
    appId: "1:603927886224:web:5c42531393a4bf56ee5b15",
    measurementId: "G-0523PF43VK"
  };

  // Load Firebase scripts dynamically
  const loadFirebase = async () => {
    try {
      // Import Firebase modules
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js');
      const { getAnalytics } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js');
      const { getAuth, onAuthStateChanged } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js');
      const { getFirestore, collection, getDocs } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
      
      // Initialize Firebase
      const app = initializeApp(firebaseConfig);
      const analytics = getAnalytics(app);
      const auth = getAuth(app);
      const db = getFirestore(app);
      
      console.log("Firebase initialized successfully");
      
      // Track user progress in practical modules
      if (window.location.pathname.includes('/student/practical')) {
        const practicalId = window.location.pathname.split('/').pop();
        
        // Track step completion
        const markCompleteButtons = document.querySelectorAll('.mark-complete-btn');
        markCompleteButtons.forEach(button => {
          button.addEventListener('click', async function() {
            const stepNumber = this.getAttribute('data-step');
            const stepElement = document.querySelector(`.practical-step[data-step="${stepNumber}"]`);
            const statusBadge = stepElement.querySelector('.step-status');
            
            // Update UI
            statusBadge.textContent = 'Completed';
            statusBadge.classList.remove('bg-light', 'text-dark');
            statusBadge.classList.add('bg-success', 'text-white');
            
            // Save progress to Firebase (if user is logged in)
            onAuthStateChanged(auth, (user) => {
              if (user) {
                try {
                  const userProgressRef = collection(db, 'users', user.uid, 'progress');
                  // Add progress data
                  console.log(`Saving progress: Practical ${practicalId}, Step ${stepNumber} completed`);
                } catch (error) {
                  console.error("Error saving progress:", error);
                }
              }
            });
          });
        });
      }
      
      // Make Firebase services available globally
      window.firebaseApp = app;
      window.firebaseAuth = auth;
      window.firebaseDb = db;
      
      // Dispatch event when Firebase is ready
      document.dispatchEvent(new CustomEvent('firebaseReady'));
      
    } catch (error) {
      console.error("Error initializing Firebase:", error);
    }
  };
  
  // Initialize Firebase
  loadFirebase();
});
