// Model Viewer Controls
document.addEventListener('DOMContentLoaded', function() {
  const modelViewer = document.querySelector('model-viewer');
  
  if (!modelViewer) return;
  
  // Model controls
  const rotateLeftBtn = document.getElementById('rotate-left');
  const zoomInBtn = document.getElementById('zoom-in');
  const zoomOutBtn = document.getElementById('zoom-out');
  
  if (rotateLeftBtn) {
    rotateLeftBtn.addEventListener('click', function() {
      const orbit = modelViewer.getCameraOrbit();
      const theta = orbit.theta - Math.PI / 6;
      modelViewer.cameraOrbit = `${theta}rad ${orbit.phi}rad ${orbit.radius}m`;
    });
  }
  
  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', function() {
      const orbit = modelViewer.getCameraOrbit();
      const radius = Math.max(orbit.radius - 0.5, 1);
      modelViewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
    });
  }
  
  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', function() {
      const orbit = modelViewer.getCameraOrbit();
      const radius = orbit.radius + 0.5;
      modelViewer.cameraOrbit = `${orbit.theta}rad ${orbit.phi}rad ${radius}m`;
    });
  }
  
  // Progress bar
  modelViewer.addEventListener('progress', (e) => {
    const progressBar = document.querySelector('.progress-bar');
    const updateBar = document.querySelector('.update-bar');
    
    if (progressBar && updateBar) {
      progressBar.classList.remove('hide');
      updateBar.style.width = `${e.detail.totalProgress * 100}%`;
      
      if (e.detail.totalProgress === 1) {
        progressBar.classList.add('hide');
      }
    }
  });
});
