# Chapter 2: Practical Applications of Sensory Systems

## Implementation of Vision Systems

In this section, we'll explore practical implementations of vision systems for humanoid robots using the OpenCV library and other computer vision tools.

### Setting Up a Stereo Vision System

```python
import cv2
import numpy as np

# Initialize stereo cameras
left_cam = cv2.VideoCapture(0)  # Left camera
right_cam = cv2.VideoCapture(1)  # Right camera

# Camera calibration parameters (would be obtained from calibration)
left_camera_matrix = np.array([[fx, 0, cx], [0, fy, cy], [0, 0, 1]])
right_camera_matrix = np.array([[fx, 0, cx], [0, fy, cy], [0, 0, 1]])
distortion_coeffs = np.zeros((5, 1))

def get_depth_map(left_img, right_img):
    # Create stereo matcher
    stereo = cv2.StereoSGBM_create(
        minDisparity=0,
        numDisparities=16*10,  # Must be divisible by 16
        blockSize=15,
        P1=8 * 3 * 15**2,
        P2=32 * 3 * 15**2,
        disp12MaxDiff=1,
        uniquenessRatio=15,
        speckleWindowSize=0,
        speckleRange=2,
        preFilterCap=63,
        mode=cv2.STEREO_SGBM_MODE_SGBM_3WAY
    )
    
    # Compute disparity map
    disparity = stereo.compute(left_img, right_img).astype(np.float32)
    disparity = disparity / 16.0  # Adjust for SGBM algorithm
    
    return disparity
```

### Image Preprocessing Pipeline

```python
def preprocess_image(image):
    # Convert to grayscale if needed
    if len(image.shape) == 3:
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    else:
        gray = image
    
    # Apply Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Enhance contrast using histogram equalization
    equalized = cv2.equalizeHist(blurred)
    
    return equalized

def detect_features(image):
    # Using ORB detector
    orb = cv2.ORB_create()
    keypoints, descriptors = orb.detectAndCompute(image, None)
    
    return keypoints, descriptors
```

## Implementing Auditory Systems

### Sound Capture and Processing

```python
import pyaudio
import numpy as np
from scipy import signal
import librosa

class AudioProcessor:
    def __init__(self):
        self.chunk = 1024
        self.format = pyaudio.paInt16
        self.channels = 1
        self.rate = 44100
        self.audio = pyaudio.PyAudio()
        
    def start_recording(self, duration=5):
        # Open stream
        stream = self.audio.open(
            format=self.format,
            channels=self.channels,
            rate=self.rate,
            input=True,
            frames_per_buffer=self.chunk
        )
        
        print("Recording...")
        frames = []
        
        for i in range(0, int(self.rate / self.chunk * duration)):
            data = stream.read(self.chunk)
            frames.append(data)
        
        print("Finished recording")
        
        # Close stream
        stream.stop_stream()
        stream.close()
        
        # Convert to numpy array
        audio_data = np.frombuffer(b''.join(frames), dtype=np.int16)
        return audio_data.astype(np.float32) / 32768.0  # Normalize
    
    def apply_noise_reduction(self, audio_data):
        # Apply a simple low-pass filter
        b, a = signal.butter(4, 0.1, btype='low', fs=self.rate)
        filtered_audio = signal.filtfilt(b, a, audio_data)
        return filtered_audio
    
    def detect_sound_direction(self, audio_data_left, audio_data_right):
        # Simple interaural time difference (ITD) estimation
        correlation = np.correlate(audio_data_left, audio_data_right, mode='full')
        lag = correlation.argmax() - (len(audio_data_right) - 1)
        
        # Convert lag to direction estimate
        # This is a simplified model
        max_lag = len(audio_data_left) - 1
        direction = (lag / max_lag) * 180  # degrees
        
        return direction
```

### Feature Extraction for Recognition

```python
def extract_audio_features(audio_data, sr=44100):
    # Extract MFCCs (Mel-frequency cepstral coefficients)
    mfccs = librosa.feature.mfcc(y=audio_data, sr=sr, n_mfcc=13)
    
    # Extract spectral centroid (measure of brightness)
    spectral_centroids = librosa.feature.spectral_centroid(y=audio_data, sr=sr)[0]
    
    # Extract spectral rolloff
    spectral_rolloff = librosa.feature.spectral_rolloff(y=audio_data, sr=sr)[0]
    
    # Extract zero crossing rate
    zcr = librosa.feature.zero_crossing_rate(audio_data)[0]
    
    # Extract chroma feature
    chroma = librosa.feature.chroma_stft(y=audio_data, sr=sr)
    
    return {
        'mfccs': mfccs,
        'spectral_centroids': spectral_centroids,
        'spectral_rolloff': spectral_rolloff,
        'zcr': zcr,
        'chroma': chroma
    }
```

## Tactile Sensor Integration

### Simulating Tactile Sensors

```python
import numpy as np
import matplotlib.pyplot as plt

class TactileSensor:
    def __init__(self, rows=16, cols=16, resolution=1.0):
        self.rows = rows
        self.cols = cols
        self.resolution = resolution  # resolution in mm
        self.pressure_map = np.zeros((rows, cols))
        
    def detect_contact(self, force_matrix):
        """Simulate tactile sensor readings"""
        # Apply some noise to simulate real sensor
        noise = np.random.normal(0, 0.05, force_matrix.shape)
        self.pressure_map = np.maximum(0, force_matrix + noise)
        return self.pressure_map
    
    def extract_features(self):
        """Extract features from pressure distribution"""
        # Calculate center of pressure
        y_indices, x_indices = np.ogrid[:self.rows, :self.cols]
        total_force = np.sum(self.pressure_map)
        
        if total_force > 0:
            center_y = np.sum(y_indices * self.pressure_map) / total_force
            center_x = np.sum(x_indices * self.pressure_map) / total_force
        else:
            center_y, center_x = self.rows/2, self.cols/2
            
        # Calculate contact area (area with pressure above threshold)
        contact_area = np.sum(self.pressure_map > 0.1)
        
        # Calculate pressure distribution metrics
        mean_pressure = np.mean(self.pressure_map)
        std_pressure = np.std(self.pressure_map)
        
        return {
            'center_of_pressure': (center_x, center_y),
            'contact_area': contact_area,
            'mean_pressure': mean_pressure,
            'std_pressure': std_pressure
        }

# Example usage
tactile = TactileSensor()
# Simulate force applied to the sensor area
force_matrix = np.zeros((16, 16))
force_matrix[5:10, 5:10] = 0.8  # Apply force to a 5x5 region
pressure_map = tactile.detect_contact(force_matrix)
features = tactile.extract_features()
```

## Sensor Fusion Implementation

### Kalman Filter for Position Tracking

```python
import numpy as np

class KalmanFilter:
    def __init__(self, dt, measurement_noise=1, process_noise=1):
        # State vector: [x, y, vx, vy] (position and velocity)
        self.n = 4
        self.m = 2  # measurement vector size [x, y]
        
        # Time step
        self.dt = dt
        
        # State transition matrix
        self.F = np.array([
            [1, 0, dt, 0],
            [0, 1, 0, dt],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ])
        
        # Measurement matrix
        self.H = np.array([
            [1, 0, 0, 0],
            [0, 1, 0, 0]
        ])
        
        # Process noise covariance
        self.Q = process_noise * np.array([
            [dt**4/4, 0, dt**3/2, 0],
            [0, dt**4/4, 0, dt**3/2],
            [dt**3/2, 0, dt**2, 0],
            [0, dt**3/2, 0, dt**2]
        ])
        
        # Measurement noise covariance
        self.R = measurement_noise * np.eye(2)
        
        # Initial state covariance
        self.P = np.eye(4) * 1000
        
        # Initial state
        self.x = np.zeros(4)
    
    def predict(self):
        """Predict next state"""
        self.x = self.F @ self.x
        self.P = self.F @ self.P @ self.F.T + self.Q
        return self.x
    
    def update(self, measurement):
        """Update state with new measurement"""
        # Calculate innovation
        y = measurement - self.H @ self.x
        S = self.H @ self.P @ self.H.T + self.R
        
        # Calculate Kalman gain
        K = self.P @ self.H.T @ np.linalg.inv(S)
        
        # Update state and covariance
        self.x = self.x + K @ y
        self.P = (np.eye(4) - K @ self.H) @ self.P
        
        return self.x

# Example sensor fusion using Kalman filter
def sensor_fusion_example():
    # Initialize Kalman filter
    kf = KalmanFilter(dt=0.1, measurement_noise=0.1, process_noise=0.1)
    
    # Simulate measurements from different sensors
    measurements = []
    for i in range(100):
        # Simulate true position with noise
        true_pos = np.array([i*0.1 + np.random.normal(0, 0.05), 
                            0.5*np.sin(i*0.1) + np.random.normal(0, 0.05)])
        measurements.append(true_pos)
    
    # Track with Kalman filter
    filtered_states = []
    for measurement in measurements:
        kf.predict()
        state = kf.update(measurement)
        filtered_states.append(state.copy())
    
    return np.array(filtered_states), np.array(measurements)
```

## Real-time Processing Considerations

### Optimized Sensor Processing Pipeline

```python
import threading
import queue
import time

class RealtimeSensorProcessor:
    def __init__(self):
        self.vision_queue = queue.Queue(maxsize=10)
        self.audio_queue = queue.Queue(maxsize=10)
        self.tactile_queue = queue.Queue(maxsize=10)
        
        self.running = False
        self.vision_thread = None
        self.audio_thread = None
        self.fusion_thread = None
        
    def start_processing(self):
        self.running = True
        
        # Start sensor processing threads
        self.vision_thread = threading.Thread(target=self._process_vision)
        self.audio_thread = threading.Thread(target=self._process_audio)
        self.fusion_thread = threading.Thread(target=self._sensor_fusion)
        
        self.vision_thread.start()
        self.audio_thread.start()
        self.fusion_thread.start()
        
    def stop_processing(self):
        self.running = False
        
        # Wait for threads to finish
        if self.vision_thread:
            self.vision_thread.join()
        if self.audio_thread:
            self.audio_thread.join()
        if self.fusion_thread:
            self.fusion_thread.join()
    
    def _process_vision(self):
        """Continuously process vision data"""
        cap = cv2.VideoCapture(0)
        
        while self.running:
            ret, frame = cap.read()
            if ret:
                # Process frame
                processed_frame = preprocess_image(frame)
                keypoints, descriptors = detect_features(processed_frame)
                
                # Put vision data in queue for fusion
                vision_data = {
                    'frame': processed_frame,
                    'keypoints': keypoints,
                    'timestamp': time.time()
                }
                
                if not self.vision_queue.full():
                    self.vision_queue.put(vision_data)
            
            time.sleep(0.033)  # ~30 FPS
        
        cap.release()
    
    def _process_audio(self):
        """Continuously process audio data"""
        audio_proc = AudioProcessor()
        
        while self.running:
            # Record a short snippet
            audio_data = audio_proc.start_recording(duration=0.5)
            features = extract_audio_features(audio_data)
            
            audio_data = {
                'features': features,
                'timestamp': time.time()
            }
            
            if not self.audio_queue.full():
                self.audio_queue.put(audio_data)
            
            time.sleep(0.1)  # Process every 100ms
    
    def _sensor_fusion(self):
        """Fuse data from multiple sensors"""
        while self.running:
            # Get data from all queues
            vision_data = None
            audio_data = None
            tactile_data = None
            
            # Non-blocking check for data
            try:
                vision_data = self.vision_queue.get_nowait()
            except queue.Empty:
                pass
                
            try:
                audio_data = self.audio_queue.get_nowait()
            except queue.Empty:
                pass
                
            try:
                tactile_data = self.tactile_queue.get_nowait()
            except queue.Empty:
                pass
            
            # Perform fusion if we have enough data
            if vision_data and audio_data:
                # Example fusion: combine visual and audio location
                fused_result = self._fuse_vision_audio(vision_data, audio_data)
                
                # Process the fused result
                self._act_on_fusion(fused_result)
            
            time.sleep(0.01)  # 100Hz fusion rate
    
    def _fuse_vision_audio(self, vision_data, audio_data):
        """Example fusion of vision and audio data"""
        # This is a simplified example
        # In practice, this would use more sophisticated fusion algorithms
        fusion_result = {
            'visual_objects': len(vision_data['keypoints']),
            'audio_features': audio_data['features'],
            'timestamp': max(vision_data['timestamp'], audio_data['timestamp'])
        }
        return fusion_result
    
    def _act_on_fusion(self, fusion_result):
        """Take action based on fused sensory data"""
        # Example: print information about the environment
        print(f"Detected {fusion_result['visual_objects']} objects")
        print(f"Audio features computed at {fusion_result['timestamp']}")
```

## Integration with Robot Control

```python
def integrate_with_control_system(sensor_processor):
    """Integrate sensory processing with robot control"""
    
    # Example: Use sensor data to control robot behavior
    while sensor_processor.running:
        # Get fused sensory data
        # ... wait for new fusion result ...
        
        # Example: Navigate towards a sound source
        # sound_direction = sensor_processor.get_sound_direction()
        # robot.turn_towards(sound_direction)
        
        # Example: Avoid obstacles detected by vision
        # obstacles = sensor_processor.get_vision_obstacles()
        # if obstacles:
        #     robot.avoid_obstacles(obstacles)
        
        time.sleep(0.01)
```

## Performance Optimization

### Profiling and Optimization Techniques

```python
import cProfile
import pstats

def profile_sensory_system():
    """Profile the sensory processing system"""
    profiler = cProfile.Profile()
    
    # Start processing
    sensor_processor = RealtimeSensorProcessor()
    sensor_processor.start_processing()
    
    # Profile for a few seconds
    profiler.enable()
    time.sleep(5)
    profiler.disable()
    
    # Print results
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(10)  # Print top 10 functions
    
    sensor_processor.stop_processing()

# Memory optimization example
def reduce_sensor_data_memory(data):
    """Reduce memory usage of sensor data"""
    # Use single precision instead of double
    if isinstance(data, np.ndarray):
        return data.astype(np.float32)
    return data
```

## Conclusion

This chapter demonstrated practical implementations of sensory systems for humanoid robots. We covered vision processing, audio analysis, tactile sensing, and sensor fusion techniques. The examples provided can be adapted and extended based on specific robot hardware and application requirements.

The implementations in this chapter emphasize real-time processing and computational efficiency, which are critical for practical deployment of sensory systems in humanoid robots. By following these examples, developers can build robust sensory systems that enable robots to effectively perceive and interact with their environment.