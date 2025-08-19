/**
 * Model Loader for Face-API.js
 * 
 * This script handles the dynamic loading of Face-API.js models from the CDN
 * and saves them to the local server for future use.
 */

// List of models to download
const models = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2',
  'face_expression_model-weights_manifest.json',
  'face_expression_model-shard1'
];

// Base URL for models
const modelUrl = 'https://justadudewhohacks.github.io/face-api.js/models';

// Local path to save models
const localPath = '/models/face-api';

// Function to download a file
async function downloadFile(url, filename) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download ${url}: ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    // Create a link element to download the file
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`Downloaded ${filename}`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${filename}:`, error);
    return false;
  }
}

// Function to download all models
async function downloadAllModels() {
  console.log('Starting model download...');
  const results = [];
  
  for (const model of models) {
    const url = `${modelUrl}/${model}`;
    const result = await downloadFile(url, model);
    results.push({ model, success: result });
  }
  
  console.log('Model download complete:', results);
  return results;
}

// Export functions
window.modelLoader = {
  downloadAllModels
};

// Auto-download models when script is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('Model loader initialized');
});
