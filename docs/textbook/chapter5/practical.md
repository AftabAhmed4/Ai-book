# Chapter 5: Practical Applications of Human-Robot Interaction and Social Robotics

## Implementing Natural Language Interaction

In this section, we'll implement practical systems for human-robot communication, starting with natural language processing.

### Speech Recognition and Natural Language Understanding

```python
import numpy as np
import speech_recognition as sr
from typing import Dict, List, Tuple
import re

class NaturalLanguageInterface:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Define command patterns and their corresponding actions
        self.command_patterns = {
            'move_forward': [r'go forward', r'move forward', r'go straight', r'move straight'],
            'move_backward': [r'go back', r'move back', r'go backward', r'move backward'],
            'turn_left': [r'turn left', r'rotate left', r'move left'],
            'turn_right': [r'turn right', r'rotate right', r'move right'],
            'stop': [r'stop', r'halt', r'freeze', r'wait'],
            'greet': [r'hello', r'hi', r'hey', r'greetings'],
            'introduce': [r'tell me about yourself', r'who are you', r'what are you', r'introduce yourself']
        }
        
        # Build regex patterns for each command
        self.compiled_patterns = {}
        for command, patterns in self.command_patterns.items():
            combined_pattern = '|'.join(patterns)
            self.compiled_patterns[command] = re.compile(combined_pattern, re.IGNORECASE)
    
    def listen_and_recognize(self) -> str:
        """Listen to user speech and return recognized text"""
        try:
            with self.microphone as source:
                self.recognizer.adjust_for_ambient_noise(source)
                print("Listening...")
                audio = self.recognizer.listen(source, timeout=5)
            
            # Use Google's speech recognition service
            text = self.recognizer.recognize_google(audio)
            print(f"Heard: {text}")
            return text
        except sr.WaitTimeoutError:
            print("No speech detected")
            return ""
        except sr.UnknownValueError:
            print("Could not understand audio")
            return ""
        except sr.RequestError as e:
            print(f"Could not request results; {e}")
            return ""
    
    def parse_command(self, text: str) -> str:
        """Parse text and determine the corresponding command"""
        for command, pattern in self.compiled_patterns.items():
            if pattern.search(text):
                return command
        return 'unknown'  # Command not recognized
    
    def generate_response(self, command: str) -> str:
        """Generate appropriate verbal response for a command"""
        responses = {
            'greet': "Hello! Nice to meet you!",
            'introduce': "I am a humanoid robot designed to interact with humans. I can move, talk, and assist with various tasks.",
            'move_forward': "Moving forward now.",
            'move_backward': "Moving backward now.",
            'turn_left': "Turning left now.",
            'turn_right': "Turning right now.",
            'stop': "Stopping now.",
            'unknown': "I'm sorry, I didn't understand that command."
        }
        return responses.get(command, "I don't know how to respond to that.")

# Example usage
nli = NaturalLanguageInterface()

# In a complete system, this would be called in a loop
# user_text = nli.listen_and_recognize()
# command = nli.parse_command(user_text)
# response = nli.generate_response(command)
# print(f"Command: {command}, Response: {response}")
```

## Implementing Non-Verbal Communication

### Gesture Recognition and Generation

```python
import numpy as np
import cv2
from typing import List, Tuple
import mediapipe as mp

class GestureRecognition:
    def __init__(self):
        # Initialize MediaPipe for hand tracking
        self.mp_hands = mp.solutions.hands
        self.mp_drawing = mp.solutions.drawing_utils
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Gesture recognition parameters
        self.gesture_thresholds = {
            'thumb_up': 0.9,   # Confidence for thumbs up gesture
            'open_palm': 0.85, # Confidence for open palm gesture
            'pointing': 0.8    # Confidence for pointing gesture
        }
    
    def recognize_hand_gesture(self, image: np.ndarray) -> str:
        """Recognize hand gestures from an image"""
        # Convert image to RGB (MediaPipe expects RGB)
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        
        # Process the image
        results = self.hands.process(image_rgb)
        
        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Get coordinates of key landmarks
                landmarks = []
                for landmark in hand_landmarks.landmark:
                    landmarks.append([landmark.x, landmark.y, landmark.z])
                
                # Analyze gesture based on landmark positions
                gesture = self._analyze_gesture(landmarks)
                if gesture:
                    # Draw landmarks for visualization
                    self.mp_drawing.draw_landmarks(
                        image, hand_landmarks, self.mp_hands.HAND_CONNECTIONS)
                    return gesture
        
        return "none"
    
    def _analyze_gesture(self, landmarks: List[List[float]]) -> str:
        """Analyze landmark positions to identify gesture"""
        if len(landmarks) < 21:  # MediaPipe provides 21 landmarks per hand
            return "none"
        
        # Extract key landmark positions
        wrist = landmarks[0]
        thumb_tip = landmarks[4]
        index_tip = landmarks[8]
        middle_tip = landmarks[12]
        ring_tip = landmarks[16]
        pinky_tip = landmarks[20]
        
        # Thumb up: thumb tip is above other fingertips
        if (thumb_tip[1] < index_tip[1] and 
            thumb_tip[1] < middle_tip[1] and 
            thumb_tip[1] < ring_tip[1]):
            return "thumb_up"
        
        # Open palm: all fingertips are higher (lower y-value) than wrists
        if (index_tip[1] < wrist[1] and 
            middle_tip[1] < wrist[1] and 
            ring_tip[1] < wrist[1] and 
            pinky_tip[1] < wrist[1]):
            return "open_palm"
        
        # Pointing: only index finger extended
        if (index_tip[1] < wrist[1] and 
            middle_tip[1] > wrist[1] and 
            ring_tip[1] > wrist[1] and 
            pinky_tip[1] > wrist[1]):
            return "pointing"
        
        return "unknown"
    
    def generate_robot_gesture(self, gesture_type: str) -> str:
        """Generate appropriate robot response to a human gesture"""
        responses = {
            "thumb_up": "Responding with positive confirmation gesture",
            "open_palm": "Responding with open gesture to indicate friendliness",
            "pointing": "Looking in the direction pointed by the human",
            "unknown": "Cannot interpret this gesture"
        }
        return responses.get(gesture_type, "No response for this gesture")

# Example usage
gesture_rec = GestureRecognition()
# Assuming we have an image from robot's camera
# gesture = gesture_rec.recognize_hand_gesture(robot_camera_image)
# robot_response = gesture_rec.generate_robot_gesture(gesture)
```

## Implementing Social Navigation

### Proxemic Behavior Implementation

```python
import numpy as np
from typing import List, Tuple, Dict
from enum import Enum

class ProxemicZone(Enum):
    INTIMATE = (0.0, 0.45)    # 0-1.5 ft
    PERSONAL = (0.45, 1.2)    # 1.5-4 ft
    SOCIAL = (1.2, 3.7)       # 4-12 ft
    PUBLIC = (3.7, float('inf')) # 12+ ft

class SocialNavigationController:
    def __init__(self, robot_radius: float = 0.3):
        self.robot_radius = robot_radius  # Robot's physical radius
        self.human_positions: List[Tuple[float, float]] = []
        self.social_zones: Dict[Tuple[float, float], ProxemicZone] = {}
        self.comfort_distances = {
            ProxemicZone.INTIMATE: 0.25,
            ProxemicZone.PERSONAL: 0.6,
            ProxemicZone.SOCIAL: 1.5,
            ProxemicZone.PUBLIC: 4.0
        }
        
    def update_human_positions(self, positions: List[Tuple[float, float]]):
        """Update known human positions"""
        self.human_positions = positions
        self._update_social_zones()
    
    def _update_social_zones(self):
        """Update the social zone classification for each human"""
        self.social_zones = {}
        robot_pos = self.get_robot_position()  # Implemented in full system
        
        for human_pos in self.human_positions:
            dist = np.sqrt((robot_pos[0] - human_pos[0])**2 + (robot_pos[1] - human_pos[1])**2)
            
            # Determine which zone this distance represents
            zone = ProxemicZone.PUBLIC  # Default to public zone
            for zone_enum in ProxemicZone:
                min_d, max_d = zone_enum.value
                if min_d <= dist < max_d:
                    zone = zone_enum
                    break
            
            self.social_zones[human_pos] = zone
    
    def get_robot_position(self) -> Tuple[float, float]:
        """Get current robot position (mock implementation)"""
        # In a real system, this would interface with robot localization
        return (0.0, 0.0)
    
    def calculate_desired_position(self, target_pos: Tuple[float, float]) -> Tuple[float, float]:
        """Calculate a socially acceptable position that respects human space"""
        robot_pos = self.get_robot_position()
        
        # Check if moving toward target would violate proxemics
        for human_pos in self.human_positions:
            # Calculate distance to human if we were at target position
            dist_to_human = np.sqrt((target_pos[0] - human_pos[0])**2 + 
                                   (target_pos[1] - human_pos[1])**2)
            
            # Check if too close to human (less than personal space)
            if dist_to_human < self.comfort_distances[ProxemicZone.PERSONAL]:
                # Calculate vector from human to robot
                vec_human_to_robot = np.array(robot_pos) - np.array(human_pos)
                vec_human_to_robot = vec_human_to_robot / np.linalg.norm(vec_human_to_robot)
                
                # Position robot outside comfort distance
                offset = vec_human_to_robot * self.comfort_distances[ProxemicZone.PERSONAL]
                adjusted_pos = np.array(human_pos) + offset
                return tuple(adjusted_pos)
        
        # If no conflicts, return original target
        return target_pos
    
    def adjust_navigation_path(self, original_path: List[Tuple[float, float]]) -> List[Tuple[float, float]]:
        """Adjust navigation path to respect social boundaries"""
        adjusted_path = []
        
        for point in original_path:
            adjusted_point = self.calculate_desired_position(point)
            adjusted_path.append(adjusted_point)
        
        return adjusted_path
    
    def get_behavior_for_zone(self, zone: ProxemicZone) -> str:
        """Get appropriate behavior based on proxemic zone"""
        behaviors = {
            ProxemicZone.INTIMATE: "Stop immediately - too close",
            ProxemicZone.PERSONAL: "Slow down and ask permission to approach",
            ProxemicZone.SOCIAL: "Maintain polite distance, appropriate for interaction",
            ProxemicZone.PUBLIC: "Normal navigation speed"
        }
        return behaviors.get(zone, "Unknown zone behavior")

# Example usage
social_nav = SocialNavigationController(robot_radius=0.4)
humans = [(1.0, 0.5), (2.5, 1.2), (-0.5, -1.0)]
social_nav.update_human_positions(humans)

target = (3.0, 3.0)
adjusted_target = social_nav.calculate_desired_position(target)
print(f"Adjusted target position: {adjusted_target}")
```

## Implementing Joint Attention Systems

### Attention and Gaze Following

```python
import numpy as np
from typing import Tuple, List, Optional
import cv2

class JointAttentionSystem:
    def __init__(self):
        self.robot_position: Tuple[float, float, float] = (0.0, 0.0, 1.5)  # x, y, height
        self.robot_orientation: float = 0.0  # Heading in radians
        self.attended_objects = []
        self.human_attention_targets = []
        self.gaze_following_enabled = True
        
    def detect_human_gaze_direction(self, face_landmarks: List[Tuple[int, int]], 
                                  head_pose: Tuple[float, float, float]) -> Optional[Tuple[float, float]]:
        """Calculate where human is looking based on face landmarks and head pose"""
        # Simplified model - in practice, this would use more sophisticated eye tracking
        if len(face_landmarks) < 68:
            return None
        
        # Extract eye landmarks (simplified)
        # In a real system, use proper eye tracking with head pose compensation
        left_eye_center = face_landmarks[36:42]  # Approximate eye region
        right_eye_center = face_landmarks[42:48]  # Approximate eye region
        
        # Calculate center of eyes
        left_eye_avg = np.mean(left_eye_center, axis=0)
        right_eye_avg = np.mean(right_eye_center, axis=0)
        eye_center = (left_eye_avg + right_eye_avg) / 2
        
        # Calculate gaze direction based on head rotation
        yaw, pitch, roll = head_pose
        
        # Simplified gaze direction calculation
        # In practice, use 3D eye model with head pose compensation
        gaze_x = np.cos(yaw) * np.cos(pitch)
        gaze_y = np.sin(yaw) * np.cos(pitch)
        gaze_z = np.sin(pitch)
        
        # Normalize
        gaze_vector = np.array([gaze_x, gaze_y, gaze_z])
        gaze_vector = gaze_vector / np.linalg.norm(gaze_vector)
        
        return tuple(gaze_vector)
    
    def find_attention_target(self, gaze_direction: Tuple[float, float, float], 
                            field_of_view: float = 45.0) -> Optional[Tuple[float, float]]:
        """Determine what the human is looking at"""
        # Convert field of view to radians
        fov_rad = np.radians(field_of_view)
        
        # In a complete system, this would perform ray-object intersection tests
        # with known objects in the environment
        
        # For this example, just return a point in the gaze direction
        robot_pos = np.array(self.robot_position)
        gaze_vec = np.array(gaze_direction)
        
        # Calculate a point in the distance where the human is looking
        look_at_point = robot_pos + 5.0 * gaze_vec  # Look 5m ahead
        
        return (look_at_point[0], look_at_point[1])
    
    def follow_human_gaze(self, human_gaze_target: Tuple[float, float]) -> bool:
        """Turn robot to look at the same location as the human"""
        if not self.gaze_following_enabled:
            return False
        
        # Calculate robot's relative position to target
        robot_pos = np.array([self.robot_position[0], self.robot_position[1]])
        target_pos = np.array(human_gaze_target)
        
        # Calculate direction vector
        direction_vector = target_pos - robot_pos
        distance = np.linalg.norm(direction_vector)
        
        # Check if target is within a reasonable distance
        if distance > 10.0:  # Too far to meaningfully look at
            return False
        
        # Normalize the direction vector
        direction_unit = direction_vector / distance
        
        # Calculate required rotation angle
        current_heading = np.array([
            np.cos(self.robot_orientation), 
            np.sin(self.robot_orientation)
        ])
        
        # Calculate angle difference
        cos_angle = np.clip(np.dot(current_heading, direction_unit), -1.0, 1.0)
        angle_diff = np.arccos(cos_angle)
        
        # Determine rotation direction
        cross_product = current_heading[0] * direction_unit[1] - current_heading[1] * direction_unit[0]
        if cross_product < 0:
            angle_diff = -angle_diff
        
        # In a real system, this would command the robot's head/eyes to turn
        print(f"Turning to look at {human_gaze_target}, rotation: {angle_diff:.2f} radians")
        
        # Update robot orientation
        self.robot_orientation += angle_diff
        return True
    
    def direct_human_attention(self, object_pos: Tuple[float, float]) -> bool:
        """Direct human attention to a specific object"""
        # Calculate direction to object relative to human
        # In a real system, this might involve pointing with arm or looking first
        
        robot_pos = np.array([self.robot_position[0], self.robot_position[1]])
        obj_pos = np.array(object_pos)
        
        # Vector from robot to object
        robot_to_obj = obj_pos - robot_pos
        robot_to_obj_norm = robot_to_obj / np.linalg.norm(robot_to_obj)
        
        # In a complete system, this would involve arm gestures or other attention-directing actions
        print(f"Directing attention to object at {object_pos}")
        return True
    
    def maintain_joint_attention(self, target_object: Tuple[float, float]) -> bool:
        """Maintain joint visual attention on an object with human"""
        # Both robot and human should be looking at the same object
        human_attention = self.find_human_attention()
        robot_attention = target_object
        
        if human_attention and np.allclose(human_attention, robot_attention, atol=0.5):
            print("Joint attention achieved")
            return True
        
        print("Establishing joint attention")
        if human_attention:
            self.follow_human_gaze(human_attention)
        else:
            self.direct_human_attention(target_object)
        
        return False
    
    def find_human_attention(self) -> Optional[Tuple[float, float]]:
        """Mock function to get human attention target"""
        # In a real system, this would come from the gaze detection system
        if self.human_attention_targets:
            return self.human_attention_targets[-1]  # Return most recent
        return None

# Example usage
jag_system = JointAttentionSystem()

# Simulate human gaze direction (in real system, this would come from face tracking)
human_gaze_dir = (0.7, 0.3, 0.6)  # Normalized direction vector
attention_target = jag_system.find_attention_target(human_gaze_dir)

if attention_target:
    jag_system.follow_human_gaze(attention_target)
```

## Implementing Emotional Interaction

### Emotion Recognition and Response

```python
import numpy as np
import cv2
from typing import Dict, Tuple, List
from enum import Enum

class EmotionalState(Enum):
    HAPPY = 1
    SAD = 2
    ANGRY = 3
    FEARFUL = 4
    SURPRISED = 5
    NEUTRAL = 6

class EmotionalInteractionSystem:
    def __init__(self):
        # Using OpenCV's face detection and a mock emotion classifier
        self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
        
        # Emotion recognition weights (in practice, use a trained model)
        self.emotion_weights = {
            EmotionalState.HAPPY: np.array([0.1, 0.9, 0.2, 0.8]),  # Smile, eye shape features
            EmotionalState.SAD: np.array([0.8, 0.2, 0.7, 0.1]),    # Downward mouth, eye features
            EmotionalState.ANGRY: np.array([0.9, 0.1, 0.1, 0.9]),  # Furrowed brows, tight mouth
            EmotionalState.NEUTRAL: np.array([0.5, 0.5, 0.5, 0.5]) # Balanced features
        }
        
        # Current emotional state of humans in the environment
        self.human_emotions: Dict[Tuple[int, int, int, int], EmotionalState] = {}  # face bounding box -> emotion
        
        # Robot's emotional responses
        self.emotional_responses = {
            EmotionalState.HAPPY: "I'm glad you're happy! What's making you feel this way?",
            EmotionalState.SAD: "I can see you're feeling sad. Would you like to talk about it?",
            EmotionalState.ANGRY: "I notice you seem upset. How can I help?",
            EmotionalState.FEARFUL: "You seem worried. I'm here to help if I can.",
            EmotionalState.SURPRISED: "Oh, that seems unexpected! What happened?",
            EmotionalState.NEUTRAL: "Hello! How can I assist you today?"
        }
    
    def detect_faces(self, image: np.ndarray) -> List[Tuple[int, int, int, int]]:
        """Detect faces in an image using Haar cascade"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = self.face_cascade.detectMultiScale(
            gray,
            scaleFactor=1.1,
            minNeighbors=5,
            minSize=(30, 30)
        )
        return [(x, y, w, h) for (x, y, w, h) in faces]
    
    def recognize_emotion(self, face_roi: np.ndarray) -> EmotionalState:
        """Recognize emotion from a face region of interest"""
        # Resize to standard size for processing
        face_resized = cv2.resize(face_roi, (48, 48))
        gray_face = cv2.cvtColor(face_resized, cv2.COLOR_BGR2GRAY)
        
        # Extract simple features (in practice, use a CNN)
        # These features are simplified representations of facial features
        features = self._extract_features(gray_face)
        
        # Compare features to emotion weights
        emotion_scores = {}
        for emotion, weights in self.emotion_weights.items():
            score = np.dot(features[:len(weights)], weights)
            emotion_scores[emotion] = score
        
        # Return the emotion with highest score
        predicted_emotion = max(emotion_scores, key=emotion_scores.get)
        return predicted_emotion
    
    def _extract_features(self, face_image: np.ndarray) -> np.ndarray:
        """Extract simple facial features for emotion recognition"""
        # This is a simplified feature extraction
        # In practice, use deep learning models or more sophisticated features
        
        # Get some representative pixel values from key facial regions
        h, w = face_image.shape
        features = np.zeros(10)
        
        # Sample from different regions
        features[0] = face_image[h//4, w//4]  # Forehead
        features[1] = face_image[h//2, w//4]  # Eye region left
        features[2] = face_image[h//2, 3*w//4]  # Eye region right
        features[3] = face_image[3*h//4, w//4]  # Mouth left
        features[4] = face_image[3*h//4, w//2]  # Mouth center
        features[5] = face_image[3*h//4, 3*w//4]  # Mouth right
        features[6] = face_image[h//3, w//2]    # Nose bridge
        features[7] = face_image[2*h//3, w//3]  # Cheek left
        features[8] = face_image[2*h//3, 2*w//3] # Cheek right
        features[9] = np.mean(face_image)       # Overall average brightness
        
        # Normalize features
        features = features / 255.0
        return features
    
    def process_emotions_in_image(self, image: np.ndarray) -> Dict[Tuple[int, int, int, int], EmotionalState]:
        """Process image to recognize emotions of all detected faces"""
        faces = self.detect_faces(image)
        emotions = {}
        
        for (x, y, w, h) in faces:
            # Extract face region of interest
            face_roi = image[y:y+h, x:x+w]
            
            # Recognize emotion for this face
            emotion = self.recognize_emotion(face_roi)
            emotions[(x, y, w, h)] = emotion
            
            # Draw bounding rectangle and label
            cv2.rectangle(image, (x, y), (x+w, y+h), (255, 0, 0), 2)
            cv2.putText(image, emotion.name, (x, y-10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36,255,12), 2)
        
        # Store the new emotions
        self.human_emotions = emotions
        return emotions
    
    def generate_response_to_emotion(self, emotion: EmotionalState) -> str:
        """Generate appropriate response to human emotion"""
        return self.emotional_responses.get(emotion, "I'm not sure how to respond to this emotion.")
    
    def adapt_behavior_to_emotions(self) -> str:
        """Adapt robot behavior based on detected emotions"""
        # Find the dominant emotion among detected humans
        if not self.human_emotions:
            return self.emotional_responses[EmotionalState.NEUTRAL]
        
        # Count emotion occurrences
        emotion_counts = {}
        for emotion in self.human_emotions.values():
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        
        # Find most common emotion
        dominant_emotion = max(emotion_counts, key=emotion_counts.get)
        
        # Generate appropriate response
        response = self.generate_response_to_emotion(dominant_emotion)
        
        # Adjust behavior based on emotion
        if dominant_emotion in [EmotionalState.ANGRY, EmotionalState.SAD]:
            print("Adjusting to calm and supportive behavior mode")
        elif dominant_emotion == EmotionalState.HAPPY:
            print("Adjusting to more energetic and engaging behavior mode")
        
        return response

# Example usage
emotion_sys = EmotionalInteractionSystem()
# This would process camera images in a real system
# emotions = emotion_sys.process_emotions_in_image(robot_camera_image)
# response = emotion_sys.adapt_behavior_to_emotions()
# print(f"Response: {response}")
```

## Integrating Social Behaviors

### Complete Social Interaction System

```python
import time
import threading
from typing import List, Tuple, Dict, Optional

class SocialInteractionSystem:
    def __init__(self):
        # Initialize subsystems
        self.nli = NaturalLanguageInterface()  # From earlier implementation
        self.gesture_rec = GestureRecognition()  # From earlier implementation
        self.social_nav = SocialNavigationController()  # From earlier implementation
        self.jag_system = JointAttentionSystem()  # From earlier implementation
        self.emotion_sys = EmotionalInteractionSystem()  # From earlier implementation
        
        # Social interaction state
        self.interaction_active = False
        self.interaction_partner = None
        self.interaction_history = []
        self.social_preferences = {}
        
        # Main control loop parameters
        self.control_frequency = 10  # Hz
        self.control_thread = None
        self.running = False
    
    def start_interaction_loop(self):
        """Start the main social interaction control loop"""
        self.running = True
        self.control_thread = threading.Thread(target=self._interaction_loop)
        self.control_thread.start()
    
    def stop_interaction_loop(self):
        """Stop the main social interaction control loop"""
        self.running = False
        if self.control_thread:
            self.control_thread.join()
    
    def _interaction_loop(self):
        """Main loop for handling social interactions"""
        dt = 1.0 / self.control_frequency
        
        while self.running:
            start_time = time.time()
            
            # Process environment inputs
            self._process_sensory_inputs()
            
            # Update social state
            self._update_social_context()
            
            # Generate appropriate responses
            self._generate_social_responses()
            
            # Respect control loop timing
            elapsed = time.time() - start_time
            sleep_time = max(0, dt - elapsed)
            if sleep_time > 0:
                time.sleep(sleep_time)
    
    def _process_sensory_inputs(self):
        """Process all sensory inputs for social interaction"""
        # Note: In a real implementation, these would come from actual sensors
        # For this example, we'll use simulated data
        
        # Simulate camera input for face/gesture detection
        # camera_image = get_robot_camera_image()  # Would be from actual camera
        
        # Process emotional expressions
        # emotions = self.emotion_sys.process_emotions_in_image(camera_image)
        
        # Process gestures
        # gesture = self.gesture_rec.recognize_hand_gesture(camera_image)
        
        # Process audio input
        # text_input = self.nli.listen_and_recognize()
        # if text_input:
        #     command = self.nli.parse_command(text_input)
        #     self.interaction_history.append(('human_speech', text_input, command))
        
        # Process human positions for spatial awareness
        # human_positions = get_detected_human_positions()  # From perception system
        # self.social_nav.update_human_positions(human_positions)
    
    def _update_social_context(self):
        """Update the social context based on all inputs"""
        # Determine if there's a primary interaction partner
        if hasattr(self, 'detected_humans') and self.detected_humans:
            # Select the closest human as primary interaction partner
            robot_pos = self.social_nav.get_robot_position()
            closest_human = min(self.detected_humans, 
                               key=lambda h: np.sqrt((h[0]-robot_pos[0])**2 + (h[1]-robot_pos[1])**2))
            self.interaction_partner = closest_human
    
    def _generate_social_responses(self):
        """Generate appropriate social responses based on context"""
        if not self.interaction_partner:
            return  # No one to interact with
        
        # Check for new inputs requiring responses
        for interaction_type, data, metadata in reversed(self.interaction_history[-5:]):  # Check last 5 interactions
            if interaction_type == 'speech' and metadata == 'greet':
                response = self.nli.generate_response('greet')
                self._execute_verbal_response(response)
                
            elif interaction_type == 'gesture' and data == 'open_palm':
                gesture_response = self.gesture_rec.generate_robot_gesture('open_palm')
                self._execute_gesture_response(gesture_response)
                
            elif interaction_type == 'emotion' and data in [EmotionalState.SAD, EmotionalState.ANGRY]:
                emotional_response = self.emotion_sys.generate_response_to_emotion(data)
                self._execute_emotional_response(emotional_response)
    
    def _execute_verbal_response(self, response_text: str):
        """Execute verbal response (text-to-speech in real system)"""
        print(f"Robot says: {response_text}")
        # In a real system, this would use text-to-speech
    
    def _execute_gesture_response(self, response_description: str):
        """Execute gesture response (robot motion in real system)"""
        print(f"Robot gesture: {response_description}")
        # In a real system, this would command robot actuators
    
    def _execute_emotional_response(self, response_text: str):
        """Execute appropriate response to emotional state"""
        print(f"Emotional response: {response_text}")
        # In a real system, this might adjust robot behavior, facial expressions, etc.
    
    def greet_human(self, human_position: Tuple[float, float]):
        """Greet a human at a specific position"""
        # Approach within social distance
        comfort_distance = self.social_nav.comfort_distances[ProxemicZone.SOCIAL]
        approach_vector = np.array(human_position) - np.array(self.social_nav.get_robot_position())
        approach_distance = np.linalg.norm(approach_vector)
        
        if approach_distance > comfort_distance:
            # Move closer to appropriate social distance
            approach_direction = approach_vector / approach_distance
            target_position = np.array(human_position) - approach_direction * comfort_distance
            print(f"Approaching to {target_position} to greet human")
        
        # Execute greeting behavior
        greeting_speech = "Hello! It's nice to meet you."
        self._execute_verbal_response(greeting_speech)
        
        # Add to interaction history
        self.interaction_history.append(('greeting', human_position, time.time()))
    
    def request_attention(self, human_position: Tuple[float, float]):
        """Request attention from a human"""
        # Use appropriate attention-getting behavior
        print(f"Requesting attention from human at {human_position}")
        
        # In a real system, this might involve:
        # - Gentle movement to enter their visual field
        # - Audible attention-getting sound
        # - LED indicators
        # - Wait for attention acknowledgment before proceeding

# Example usage
social_system = SocialInteractionSystem()
social_system.start_interaction_loop()

# Simulate greeting a human
human_pos = (2.0, 1.5)
social_system.greet_human(human_pos)

# Stop the system after demonstration
time.sleep(1)
social_system.stop_interaction_loop()
```

## Evaluating Social Interaction Performance

### Metrics and Assessment

```python
from dataclasses import dataclass
from typing import List
import time

@dataclass
class InteractionMetrics:
    engagement_duration: float
    response_accuracy: float
    social_acceptability: float
    task_success_rate: float
    user_satisfaction: float

class SocialInteractionEvaluator:
    def __init__(self):
        self.metrics_history: List[InteractionMetrics] = []
        self.start_time = None
        self.interactions_count = 0
    
    def start_session(self):
        """Start a new evaluation session"""
        self.start_time = time.time()
        self.interactions_count = 0
    
    def evaluate_engagement(self, robot_behavior: str, human_response: str) -> float:
        """Evaluate the quality of engagement"""
        # Simplified evaluation - in practice, this would use more sophisticated metrics
        positive_responses = ['yes', 'okay', 'please', 'thank you', 'hello', 'smile', 'nod']
        negative_responses = ['no', 'stop', 'away', 'frown', 'shake_head']
        
        engagement_score = 0.5  # Base score
        
        if any(pos in human_response.lower() for pos in positive_responses):
            engagement_score += 0.3
        elif any(neg in human_response.lower() for neg in negative_responses):
            engagement_score -= 0.3
        
        return max(0.0, min(1.0, engagement_score))
    
    def evaluate_social_acceptability(self, human_distance: float, robot_behavior: str) -> float:
        """Evaluate if robot behavior is socially acceptable"""
        # Based on proxemic zones
        if 0.45 <= human_distance <= 1.2 and robot_behavior == "normal_operation":
            return 0.8  # Acceptable social distance
        elif human_distance < 0.45:  # Too close
            return 0.2 if robot_behavior != "apologizing" else 0.6
        else:
            return 0.6  # Could be more engaging
    
    def record_interaction(self, metrics: InteractionMetrics):
        """Record metrics for an interaction"""
        self.metrics_history.append(metrics)
        self.interactions_count += 1
    
    def get_overall_performance(self) -> InteractionMetrics:
        """Calculate overall performance metrics"""
        if not self.metrics_history:
            return InteractionMetrics(0.0, 0.0, 0.0, 0.0, 0.0)
        
        avg_duration = sum(m.engagement_duration for m in self.metrics_history) / len(self.metrics_history)
        avg_accuracy = sum(m.response_accuracy for m in self.metrics_history) / len(self.metrics_history)
        avg_acceptability = sum(m.social_acceptability for m in self.metrics_history) / len(self.metrics_history)
        avg_success = sum(m.task_success_rate for m in self.metrics_history) / len(self.metrics_history)
        avg_satisfaction = sum(m.user_satisfaction for m in self.metrics_history) / len(self.metrics_history)
        
        return InteractionMetrics(
            avg_duration, avg_accuracy, avg_acceptability, avg_success, avg_satisfaction
        )
```

## Conclusion

This chapter provided practical implementations of human-robot interaction and social robotics concepts. We covered natural language processing, non-verbal communication, social navigation, joint attention systems, and emotional interaction. The implementations include complete systems that integrate multiple social behaviors.

The examples in this chapter demonstrate how theoretical concepts from psychology, cognitive science, and social science translate into working code for humanoid robots. These implementations can be adapted and extended for specific robot platforms and social interaction scenarios. The integration example shows how all these social behaviors can work together in a cohesive interaction system.

In practice, social robotics systems need to be extensively tested with human users to validate their naturalness, safety, and effectiveness. The evaluation framework provided gives a starting point for assessing social interaction performance.