# Chapter 5: Exercises and Problems

## Conceptual Questions

1. **Compare and contrast** the different modalities of human-robot interaction (speech, gestures, proxemics, facial expressions). When would you prioritize one modality over others?

2. **Explain** the concept of "theory of mind" in the context of human-robot interaction. Why is it important for robots to model human mental states?

3. **Analyze** the implications of the uncanny valley effect on humanoid robot design. How does this affect both physical appearance and behavioral design?

4. **Discuss** the challenges of cultural adaptation in social robotics. How might a robot designed for interaction in one culture need to be modified for another?

5. **Evaluate** the ethical implications of anthropomorphic social robots. What are the potential risks and benefits of designing robots that appear to have emotions and intentions?

## Mathematical Problems

1. **Proxemics Calculation**: A humanoid robot with a radius of 0.4m approaches a human. The human becomes uncomfortable when the distance between them is less than 1.0m. Calculate the minimum safe distance the robot should maintain from the human and determine which proxemic zone this distance falls into (Intimate: 0-0.45m, Personal: 0.45-1.2m, Social: 1.2-3.7m, Public: 3.7m+).

2. **Trust Model**: In a simplified trust model, trust is computed as: `Trust(t+1) = 0.7 * Trust(t) + 0.3 * Reliability(t)`. If initial trust is 0.5 and the robot demonstrates reliability of 0.9 for 3 consecutive interactions, what is the final trust value?

3. **Bayesian Intention Recognition**: A robot observes a human reaching toward an object. The prior probability of the human wanting to grasp the object is 0.6. The likelihood of observing this action given the intention is 0.8, and the overall probability of observing this action is 0.5. Calculate the posterior probability that the human intends to grasp the object.

4. **Social Force Model**: In a social force model, the repulsive force between a robot and human is defined as: `F = A * exp((r_robot + r_human - d) / B)`, where A=10, B=0.1, r_robot=0.3m, r_human=0.2m, and d is the distance between them. Calculate the force when d=0.6m.

5. **Gaze Direction**: A human's head is oriented at 30 degrees to the right of forward, and their eyes are directed 15 degrees to the left relative to their head. Calculate the final gaze direction relative to the forward direction.

## Programming Exercises

1. **Implement a Multimodal Interaction System**: Create a system that integrates speech, gesture, and visual attention inputs.

   ```python
   class MultimodalInteraction:
       def __init__(self):
           self.speech_input = ""
           self.gesture_input = "none"
           self.looking_at = None  # Object coordinates
           self.fusion_confidence = 0.0
       
       def process_speech(self, speech_text: str) -> str:
           """Process speech and extract intent"""
           # Your implementation here
           pass
       
       def process_gesture(self, gesture_type: str) -> str:
           """Process gesture and extract meaning"""
           # Your implementation here
           pass
       
       def identify_attention_target(self, gaze_direction: tuple) -> str:
           """Identify what the human is looking at"""
           # Your implementation here
           pass
       
       def fuse_modalities(self, speech_intent: str, gesture_meaning: str, 
                          attention_target: str) -> dict:
           """Fuse information from different modalities"""
           # Your implementation here
           pass
   ```

2. **Social Navigation with Human-Like Behaviors**: Implement a navigation system that includes social conventions like right-side passage.

   ```python
   import numpy as np
   from typing import List, Tuple

   class SocialNavigation:
       def __init__(self, robot_radius: float = 0.4):
           self.robot_radius = robot_radius
           self.humans: List[Tuple[float, float, float, float]] = []  # (x, y, vx, vy)
           self.right_side_bias = 0.1  # Bias toward right-side passage
       
       def update_human_positions(self, human_data: List[Tuple[float, float, float, float]]):
           """Update positions and velocities of humans in environment"""
           # Your implementation here
           pass
       
       def social_potential_field(self, robot_pos: Tuple[float, float], 
                                 target_pos: Tuple[float, float]) -> Tuple[float, float]:
           """Calculate social forces and return desired movement direction"""
           # Your implementation here
           pass
       
       def navigate_with_social_rules(self, start: Tuple[float, float], 
                                    goal: Tuple[float, float]) -> List[Tuple[float, float]]:
           """Plan path considering social navigation rules"""
           # Your implementation here
           pass
   ```

3. **Emotion Recognition and Response System**: Create a system that recognizes human emotions and responds appropriately.

   ```python
   import numpy as np
   from typing import Dict, Tuple

   class EmotionalInteraction:
       def __init__(self):
           self.emotion_states = ['happy', 'sad', 'angry', 'fear', 'surprise', 'neutral']
           self.last_recognized_emotion = 'neutral'
           self.response_strategies = {
               'happy': "How wonderful! What's making you feel this way?",
               'sad': "I can see you're feeling down. Would you like to talk?",
               'angry': "You seem upset. How can I help?",
               'neutral': "Hello! How are you doing?"
           }
       
       def recognize_emotion(self, facial_features: np.ndarray) -> str:
           """Recognize emotion from facial features"""
           # Your implementation here (could use simple classification)
           pass
       
       def generate_response(self, emotion: str) -> str:
           """Generate appropriate response to emotion"""
           # Your implementation here
           pass
       
       def adapt_behavior(self, emotion: str) -> Dict:
           """Adapt robot behavior based on recognized emotion"""
           # Your implementation here
           pass
   ```

## Design Problems

1. **Voice Interface Design**: Design a voice interface for a humanoid robot that:
   - Handles misrecognitions gracefully
   - Uses appropriate social conventions in speech
   - Adapts to different user demographics (age, accent, familiarity)
   - Incorporates error recovery mechanisms
   - Maintains contextual coherence in conversations

2. **Social Robot for Healthcare**: Design a social robot for a healthcare setting that:
   - Respects patient privacy and dignity
   - Provides emotional support without deception
   - Maintains appropriate professional boundaries
   - Handles sensitive medical information appropriately
   - Builds trust while being transparent about capabilities

3. **Cross-Cultural Interaction System**: Design a robot interaction system that can adapt to different cultural contexts, considering:
   - Different proxemic preferences
   - Various greeting and respect conventions
   - Different attitudes toward technology anthropomorphism
   - Language and gesture variations
   - Power distance and hierarchy considerations

## Simulation Exercises

1. **Social Interaction Simulation**: Create a simulation environment where a robot navigates through human crowds while maintaining appropriate social behavior. Evaluate the robot's performance using metrics like:
   - Time to reach goal
   - Number of social norm violations
   - Human comfort ratings (simulated)
   - Path efficiency vs. social appropriateness

2. **Conversation System**: Implement a basic conversational system and test it with different dialogue scenarios, evaluating:
   - Coherence of responses
   - Appropriateness to context
   - Naturalness of interaction flow
   - Handling of misunderstandings

3. **Emotional Response Validation**: Simulate different human emotional states and validate that the robot responds appropriately, considering:
   - Accuracy of emotion recognition
   - Appropriateness of responses
   - Timing of emotional responses
   - Cultural sensitivity of responses

## Analysis Problems

1. **Trust Dynamics**: Analyze how trust between humans and robots evolves over time with different interaction patterns. Model the impact of occasional failures on long-term trust relationships.

2. **Cultural Adaptation**: Analyze the challenges of adapting a social robot system for different cultural contexts. What aspects of social interaction remain universal vs. culture-specific?

3. **Privacy vs. Personalization**: Analyze the trade-off between personalization (which requires data collection) and privacy in social robotics applications.

## Research and Investigation

1. **Literature Review**: Research recent advances in social robotics for elderly care. Write a 500-word summary including:
   - Main challenges in human-robot interaction for elderly users
   - Successful design approaches
   - Ethical considerations
   - Future research directions

2. **Case Study Analysis**: Analyze the social robotics capabilities of three different platforms (e.g., NAO, Pepper, Jibo). Create a comparative analysis focusing on:
   - Interaction modalities supported
   - Target applications
   - Social behavior sophistication
   - User acceptance studies

## Practical Implementation Challenge

1. **Build a Social Robot Prototype**: Using a simulation environment or physical robot:
   - Implement a basic dialogue system
   - Add gesture recognition capabilities
   - Implement socially aware navigation
   - Test with human users and collect feedback
   - Document challenges faced and solutions implemented

## Advanced Problems

1. **Multi-Person Interaction**: Design a system for managing interactions when multiple people are present, addressing:
   - Turn-taking and attention management
   - Group vs. individual interactions
   - Handling competing requests
   - Maintaining situation awareness

2. **Long-Term Interaction**: Design a system that adapts to long-term human users, considering:
   - Learning user preferences and habits
   - Maintaining familiarity without becoming too familiar
   - Managing expectations over time
   - Handling user state changes

## Discussion Questions

1. **Ethical Considerations**: Should robots be allowed to express emotions if they don't actually experience them? What are the implications of emotional deception in human-robot interaction?

2. **Anthropomorphism Ethics**: How human-like should robots be allowed to become? What are the potential psychological impacts of highly anthropomorphic robots?

3. **Social Justice**: How can social robotics be developed to ensure equitable access and avoid reinforcing social inequalities?

## Solutions and Hints

### Problem 2 Solution Outline:
- Apply the trust update formula iteratively for each interaction
- Trust(1) = 0.7 * 0.5 + 0.3 * 0.9 = 0.62
- Trust(2) = 0.7 * 0.62 + 0.3 * 0.9 = 0.704
- Trust(3) = 0.7 * 0.704 + 0.3 * 0.9 = 0.763

### Problem 3 Solution Outline:
- Apply Bayes' theorem: P(intention | action) = P(action | intention) * P(intention) / P(action)
- P = (0.8 * 0.6) / 0.5 = 0.96

### Programming Exercise 1 Hints:
- Consider how different modalities can complement or confirm each other
- Weight modalities based on their reliability in the current context
- Handle cases where modalities disagree
- Consider the timing relationships between modalities