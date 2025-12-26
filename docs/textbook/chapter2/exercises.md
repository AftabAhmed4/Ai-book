# Chapter 2: Exercises and Problems

## Conceptual Questions

1. **Compare and contrast** proprioceptive and exteroceptive sensors in humanoid robotics. Provide at least 3 examples of each type and explain their specific functions.

2. **Explain** the challenges of sensor fusion in dynamic environments. How do different sensors complement each other when operating in unstructured environments?

3. **Analyze** the computational requirements for real-time sensory processing. Discuss the trade-offs between accuracy and processing speed for different sensory modalities.

4. **Evaluate** the role of uncertainty representation in sensory systems. Why is probability theory essential for robotic perception?

5. **Discuss** the differences between passive and active sensing approaches. Provide examples of each and explain when each is most appropriate.

## Mathematical Problems

1. **Kalman Filter Implementation**: Given a robot moving with constant velocity in 1D, implement a Kalman filter to estimate its position based on noisy sensor measurements.

   The motion model is: `x_k = x_k-1 + v·dt + w_k` (process noise)
   The measurement model is: `z_k = x_k + v_k` (measurement noise)
   
   Initial state: x₀ = 0m, v₀ = 1m/s, dt = 0.1s
   Process noise covariance: Q = 0.1
   Measurement noise covariance: R = 0.5
   Initial state covariance: P₀ = 1
   Measurements: [0.1, 0.85, 1.95, 2.8, 4.2, 5.1, 5.9, 7.05, 7.9, 9.1]

2. **Stereo Vision Calculation**: A stereo vision system has cameras separated by B = 0.2m (baseline). For a point that appears at pixel coordinates (u_l, v_l) = (320, 240) in the left image and (u_r, v_r) = (280, 240) in the right image, calculate the depth of the point if the focal length is f = 800 pixels.

   Use the formula: `Z = (f * B) / (d)`
   Where d is the disparity between the images.

3. **Sensor Noise Analysis**: Given a sensor that measures distance with a standard deviation of 0.02m, and takes 100 measurements of a static object with a true distance of 1.0m:
   - Calculate the expected mean of the measurements
   - Calculate the expected standard deviation of the sample mean
   - Determine the 95% confidence interval for the sample mean

## Programming Exercises

1. **Vision-based Object Detection**: Implement a function that detects colored objects in an image using OpenCV. The function should:
   - Take an image and target color range as input
   - Identify all connected components of the specified color
   - Return the centroids of these components
   - Visualize the results by drawing circles around detected objects

   ```python
   def detect_colored_objects(image, color_range):
       """
       Detect objects of a specific color in an image
       Args:
           image: Input image (numpy array)
           color_range: Tuple of (lower_bound, upper_bound) in HSV space
       Returns:
           List of centroids [(x1, y1), (x2, y2), ...]
       """
       # Your implementation here
       pass
   ```

2. **Audio Direction Estimation**: Implement a function that estimates the direction of a sound source using stereo audio inputs.

   ```python
   def estimate_sound_direction(audio_left, audio_right, sample_rate):
       """
       Estimate direction of sound source from stereo audio
       Args:
           audio_left: Left channel audio signal
           audio_right: Right channel audio signal
           sample_rate: Sample rate of the audio
       Returns:
           Estimated direction in degrees (-90 to 90)
       """
       # Your implementation here
       pass
   ```

3. **Sensor Fusion Exercise**: Implement a simple particle filter that fuses data from a camera and an IMU to track the position of a moving robot in 2D space.

   ```python
   import numpy as np

   class ParticleFilter:
       def __init__(self, num_particles=1000):
           self.particles = None  # Initialize particles
           self.weights = None    # Initialize weights
       
       def predict(self, control_input, process_noise):
           """Predict the next state of particles based on control input"""
           pass
       
       def update(self, measurement, sensor_noise):
           """Update particle weights based on measurement"""
           pass
       
       def resample(self):
           """Resample particles based on their weights"""
           pass
       
       def estimate(self):
           """Return estimated state as weighted average of particles"""
           pass
   ```

## Design Problems

1. **Design a Tactile Sensing System**: Design a tactile sensing system for a humanoid robot's hand that can detect:
   - Object grasp stability
   - Texture and surface properties
   - Force distribution during manipulation
   
   Specify the types of sensors needed, their placement, and the algorithms that would process the information. Include both hardware and software considerations.

2. **Multi-modal Perception Architecture**: Design an architecture for processing and fusing data from vision, audition, and tactile sensors in real-time. Your design should include:
   - Data flow between sensors and processing units
   - Buffer management for handling different sample rates
   - Synchronization mechanisms
   - Computational resource allocation
   - Failure handling strategies

3. **Robustness Analysis**: Design a sensory system that remains functional under various adverse conditions (poor lighting, noise, sensor failures). Describe:
   - How your system would detect sensor failures
   - How it would adapt to changing environmental conditions
   - What backup strategies would be employed
   - How you would validate the robustness of your design

## Research and Investigation

1. **Literature Review**: Research recent advances in neuromorphic sensory processing. Write a 500-word summary comparing traditional digital processing with neuromorphic approaches, including:
   - Advantages and disadvantages of each approach
   - Specific applications where neuromorphic systems excel
   - Challenges in implementing neuromorphic sensory systems

2. **Comparative Analysis**: Compare the sensory systems of 3 different humanoid robots (e.g., Pepper, NAO, ASIMO). Create a table comparing:
   - Types and number of sensors
   - Sensory processing capabilities
   - Performance specifications
   - Limitations of each system

## Practical Implementation Challenge

1. **Build a Simple Sensory System**: Using a development platform (Raspberry Pi, Arduino, etc.) or simulation environment:
   - Set up at least two different types of sensors (e.g., camera, ultrasonic sensor, microphone)
   - Implement a basic fusion algorithm to combine sensor data
   - Create a visualization showing the sensor inputs and fused results
   - Document the challenges faced and how you addressed them

## Discussion Questions

1. **Ethical Considerations**: Discuss the privacy implications of humanoid robots with comprehensive sensory capabilities. How can we ensure that sensory systems respect user privacy?

2. **Human-Robot Interaction**: How should humanoid robots use sensory information differently depending on the social context? Consider scenarios like home assistance, education, and professional services.

3. **Future Development**: What do you see as the most important advancement needed in sensory systems to enable truly natural human-robot interaction?

## Solutions and Hints

### Problem 1 Solution Outline:
- Implement the Kalman filter prediction and update steps
- Use the given parameters to initialize the filter
- Process each measurement sequentially
- Plot the estimated position vs. measurements

### Problem 2 Solution Outline:
- Calculate disparity: d = u_l - u_r = 320 - 280 = 40 pixels
- Apply the formula: Z = (800 * 0.2) / 40 = 4 meters

### Programming Exercise 1 Hints:
- Convert image to HSV color space
- Create a mask using cv2.inRange()
- Find contours using cv2.findContours()
- Calculate centroids using cv2.moments()