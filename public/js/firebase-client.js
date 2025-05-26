// Firebase Client Integration
document.addEventListener('DOMContentLoaded', function() {
  // Import Firebase modules
  import('https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js').then((firebase) => {
    import('https://www.gstatic.com/firebasejs/9.22.0/firebase-analytics.js').then((firebaseAnalytics) => {
      import('https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js').then((firebaseAuth) => {
        import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js').then((firebaseFirestore) => {
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

          // Initialize Firebase
          const app = firebase.initializeApp(firebaseConfig);
          const analytics = firebaseAnalytics.getAnalytics(app);
          const auth = firebaseAuth.getAuth(app);
          const db = firebaseFirestore.getFirestore(app);

          // Make Firebase services available globally
          window.firebaseApp = app;
          window.firebaseAnalytics = analytics;
          window.firebaseAuth = auth;
          window.firebaseDb = db;

          console.log("Firebase initialized successfully");
          
          // Dispatch an event when Firebase is ready
          document.dispatchEvent(new CustomEvent('firebaseReady'));
        });
      });
    });
  }).catch(error => {
    console.error("Error loading Firebase:", error);
  });
});
