import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { getAuthToken, fetchWithToken } from "../utils/handleToken.js";
const InterviewScreenshotCapture = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const hasStarted = useRef(false);

  const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

  const log = (message, type = 'info', data = null) => {
    const timestamp = new Date().toISOString();
    const prefix = `[Screenshot ${sessionId}]`;
    
    if (type === 'error') {
      console.error(`${prefix} [${timestamp}] ❌`, message, data || '');
    } else if (type === 'success') {
      console.log(`${prefix} [${timestamp}] ✅`, message, data || '');
    } else {
      console.log(`${prefix} [${timestamp}] ℹ️`, message, data || '');
    }
  };

  const captureScreenshot = async () => {
    log('Starting screenshot capture...');
    
    try {
      // Method 1: Try using MediaDevices API (screen capture)
      log('Attempting screen capture with MediaDevices API...');
      
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: { 
            mediaSource: 'screen',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: false,
          preferCurrentTab: true
        });
        
        const video = document.createElement('video');
        video.srcObject = stream;
        video.play();

        await new Promise(resolve => {
          video.onloadedmetadata = resolve;
        });

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0);

        stream.getTracks().forEach(track => track.stop());

        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          }, 'image/jpeg', 0.7);
        });
        
        log('Screenshot captured with MediaDevices', 'success', `Size: ${(blob.size / 1024).toFixed(2)}KB`);
        return blob;
      } catch (mediaError) {
        log('MediaDevices failed, trying html2canvas...', 'info', mediaError.message);
        
        // Method 2: Fallback to html2canvas with ignore for problematic elements
        log('Capturing with html2canvas (ignoring CSS errors)...');
        
        const canvas = await html2canvas(document.body, {
          logging: false,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          scale: 0.5,
          ignoreElements: (element) => {
            // Ignore elements that might have problematic CSS
            const computedStyle = window.getComputedStyle(element);
            const bgColor = computedStyle.backgroundColor;
            const color = computedStyle.color;
            
            // Skip elements with oklch, lab, lch colors
            if (bgColor && (bgColor.includes('oklch') || bgColor.includes('lab') || bgColor.includes('lch'))) {
              return true;
            }
            if (color && (color.includes('oklch') || color.includes('lab') || color.includes('lch'))) {
              return true;
            }
            return false;
          },
          onclone: (clonedDoc) => {
            // Replace problematic CSS colors in the cloned document
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach(el => {
              try {
                const style = el.style;
                if (style.backgroundColor && (style.backgroundColor.includes('oklch') || style.backgroundColor.includes('lab'))) {
                  style.backgroundColor = '#ffffff';
                }
                if (style.color && (style.color.includes('oklch') || style.color.includes('lab'))) {
                  style.color = '#000000';
                }
              } catch (e) {
                // Ignore errors
              }
            });
          }
        });
        
        log('Canvas created, converting to blob...');
        
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to create blob'));
          }, 'image/jpeg', 0.7);
        });
        
        log('Screenshot captured with html2canvas', 'success', `Size: ${(blob.size / 1024).toFixed(2)}KB`);
        return blob;
      }
    } catch (error) {
      log('Screenshot capture FAILED', 'error', error.message);
      log('Error details:', 'error', error.stack);
      return null;
    }
  };

  const uploadToPinata = async (imageBlob) => {
    log('Uploading to Pinata...');
    
    try {
      const formData = new FormData();
      const filename = `screenshot_${sessionId}_${Date.now()}.jpg`;
      formData.append('file', imageBlob, filename);

      log(`Uploading ${filename}...`);

      const pinataResponse = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PINATA_JWT}`
        },
        body: formData
      });

      const responseText = await pinataResponse.text();
      log('Pinata response received', 'info', responseText);

      if (!pinataResponse.ok) {
        throw new Error(`Pinata error: ${pinataResponse.status} - ${responseText}`);
      }

      const pinataData = JSON.parse(responseText);
      const imageUrl = `https://gateway.pinata.cloud/ipfs/${pinataData.IpfsHash}`;
      
      log('Pinata upload SUCCESS', 'success', imageUrl);
      return imageUrl;
    } catch (error) {
      log('Pinata upload FAILED', 'error', error.message);
      throw error;
    }
  };

  const sendToDatabase = async (imageUrl) => {
    log('Sending URL to database...');
    
    try {
      const token = getAuthToken();
      
      if (!token) {
        log('No auth token found', 'error');
        return;
      }

      log('Auth token retrieved, making authenticated request...');

      const apiUrl = `https://interxai.onrender.com/api/interview/interview-images/${sessionId}/`;
      log(`API: ${apiUrl}`);

      const result = await fetchWithToken(
        apiUrl,
        token,
        navigate,
        'POST',
        { image_url: imageUrl }
      );

      if (!result) {
        throw new Error('Database update returned null/failed');
      }

      log('Database response:', 'info', result);
      log('Database update SUCCESS', 'success');
    } catch (error) {
      log('Database update FAILED', 'error', error.message);
      throw error;
    }
  };

  const processScreenshot = async () => {
    log('=== STARTING SCREENSHOT PROCESS ===');
    
    try {
      // Step 1: Capture
      log('STEP 1: Capturing screenshot...');
      const imageBlob = await captureScreenshot();
      if (!imageBlob) {
        log('PROCESS STOPPED - No screenshot captured', 'error');
        return;
      }

      // Step 2: Upload to Pinata
      log('STEP 2: Uploading to Pinata...');
      const imageUrl = await uploadToPinata(imageBlob);
      
      // Step 3: Send to Database
      log('STEP 3: Saving to database...');
      await sendToDatabase(imageUrl);
      
      log('=== PROCESS COMPLETED SUCCESSFULLY ===', 'success');
    } catch (error) {
      log('=== PROCESS FAILED ===', 'error', error.message);
    }
  };

  useEffect(() => {
    if (!sessionId || hasStarted.current) return;
    
    hasStarted.current = true;
    log('=== COMPONENT INITIALIZED ===');
    log(`Session ID: ${sessionId}`);
    
    // Start async process - fire and forget
    log('Starting async screenshot process...');
    processScreenshot();

    return () => {
      log('Component unmounting');
    };
  }, [sessionId]);

  return null;
};

export default InterviewScreenshotCapture;