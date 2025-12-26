# Chapter 3: Exercises and Problems

## Conceptual Questions

1. **Compare and contrast** different actuation technologies (servo motors, series elastic actuators, hydraulic systems) in terms of power density, compliance, and control complexity. When would you choose each technology?

2. **Explain** the relationship between degrees of freedom and the complexity of inverse kinematics problems. What are the advantages and challenges of redundant manipulator systems?

3. **Analyze** the role of the Zero Moment Point (ZMP) in bipedal walking stability. How does ZMP relate to the center of pressure?

4. **Evaluate** the differences between impedance control and admittance control. Provide examples of when each approach would be most appropriate.

5. **Discuss** the trade-offs between model-based control and learning-based control for motor control systems. What are the advantages of each approach?

## Mathematical Problems

1. **Forward Kinematics**: For a 3-DOF planar manipulator with link lengths L₁ = 0.5m, L₂ = 0.4m, L₃ = 0.3m, calculate the end-effector position when joint angles are θ₁ = π/4, θ₂ = π/6, θ₃ = π/3.
   
   Use the forward kinematics equations:
   ```
   x = L₁cos(θ₁) + L₂cos(θ₁+θ₂) + L₃cos(θ₁+θ₂+θ₃)
   y = L₁sin(θ₁) + L₂sin(θ₁+θ₂) + L₃sin(θ₁+θ₂+θ₃)
   ```

2. **Inverse Kinematics**: For a 2-DOF planar manipulator with link lengths L₁ = 0.5m, L₂ = 0.4m, find the joint angles to reach the point (0.6, 0.4). Use the geometric solution approach.

3. **ZMP Calculation**: A humanoid robot has a center of mass at (0.02, 0, 0.8) meters with acceleration (0.1, -0.05, 0) m/s². Calculate the ZMP position. Gravity is 9.81 m/s².

4. **PID Tuning**: Given a second-order system with transfer function G(s) = 1/(s² + 2s + 1), design a PID controller to achieve a settling time of less than 2 seconds with less than 5% overshoot. Use the Ziegler-Nichols method or pole placement.

5. **Jacobian Calculation**: For a 2-DOF planar manipulator with link lengths L₁ and L₂, derive the Jacobian matrix J(θ) relating joint velocities to end-effector velocities:
   ```
   [ẋ]   [ ∂x/∂θ₁  ∂x/∂θ₂ ]
   [ẏ] = [ ∂y/∂θ₁  ∂y/∂θ₂ ] [θ̇₁]
                             [θ̇₂]
   ```

## Programming Exercises

1. **Implement a Joint Space Controller**: Create a controller that moves a robot arm from an initial joint configuration to a goal configuration using trajectory interpolation.

   ```python
   import numpy as np

   def joint_space_trajectory_planner(q_start, q_goal, t_total, dt=0.01):
       """
       Generate a smooth trajectory from start to goal joint angles
       Args:
           q_start: Initial joint angles (numpy array)
           q_goal: Goal joint angles (numpy array)
           t_total: Total movement time (seconds)
           dt: Time step (seconds)
       Returns:
           List of (time, joint_angles) tuples
       """
       # Your implementation here (use cubic spline interpolation)
       pass

   def execute_trajectory(robot_model, trajectory_points):
       """
       Execute the trajectory on a robot model
       Args:
           robot_model: Robot model with forward kinematics
           trajectory_points: List of (time, joint_angles) tuples
       Returns:
           List of end-effector positions over time
       """
       # Your implementation here
       pass
   ```

2. **Implement a Simple Balance Controller**: Create a controller that keeps a simulated inverted pendulum upright using PID control.

   ```python
   import numpy as np

   class InvertedPendulum:
       def __init__(self, length=1.0, mass=1.0, gravity=9.81):
           self.length = length
           self.mass = mass
           self.gravity = gravity
           self.angle = 0.1  # Initial angle (radians)
           self.angular_velocity = 0.0
       
       def update(self, torque, dt):
           """Update pendulum state with applied torque"""
           # Calculate angular acceleration
           angular_accel = (self.gravity / self.length) * np.sin(self.angle) + \
                          torque / (self.mass * self.length**2)
           
           # Update state
           self.angular_velocity += angular_accel * dt
           self.angle += self.angular_velocity * dt
           
           return self.angle, self.angular_velocity

   def balance_controller(pendulum, kp=10, ki=1, kd=0.1):
       """
       Design a PID controller to balance the inverted pendulum
       Args:
           pendulum: InvertedPendulum instance
           kp, ki, kd: PID gains
       Returns:
           Torque to apply based on current state
       """
       # Your implementation here
       pass
   ```

3. **Implement Operational Space Control**: Create a controller that controls the end-effector position of a robot arm directly.

   ```python
   import numpy as np

   class OperationalSpaceController:
       def __init__(self, robot_model):
           self.robot = robot_model
       
       def inverse_kinematics(self, target_pos, current_joints):
           """Solve inverse kinematics using Jacobian transpose"""
           pass
       
       def operational_space_control(self, target_pos, current_pos, 
                                   target_vel=np.zeros(2), current_vel=np.zeros(2)):
           """
           Control end-effector position in Cartesian space
           Args:
               target_pos: Desired end-effector position
               current_pos: Current end-effector position
               target_vel: Desired end-effector velocity
               current_vel: Current end-effector velocity
           Returns:
               Joint torques to apply
           """
           pass
   ```

## Design Problems

1. **Design a Walking Controller**: Design a complete walking controller for a 6-DOF biped robot (3 DOF per leg). Your design should include:
   - Trajectory generator for foot placement
   - Balance control system
   - Joint controllers for each degree of freedom
   - Safety mechanisms to prevent falls
   - A state machine to manage different phases of walking

2. **Actuator Selection**: Design an actuation system for a humanoid robot arm with 7 DOF. Specify:
   - Type of actuator for each joint (considering torque, speed, compliance requirements)
   - Control architecture for coordinated movement
   - Safety mechanisms to prevent damage during operation
   - Power consumption estimates for continuous operation

3. **Robust Control Design**: Design a motor control system that remains stable under varying loads and parameter uncertainties. Consider:
   - Adaptive control techniques
   - Gain scheduling approaches
   - Robustness analysis
   - Performance validation methods

## Simulation Exercises

1. **Simulate a Manipulator Arm**: Create a simulation of a 3-DOF planar manipulator that can track a moving target. Implement both position and impedance control and compare their performance for different types of targets (stationary, moving, interactive).

2. **Balance Control Simulation**: Simulate a 2D inverted pendulum model of a biped robot during standing and simple stepping motions. Implement ZMP-based balance control and test its performance under external disturbances.

3. **Walking Pattern Validation**: Implement a 3D walking simulation with a simple humanoid model. Validate your walking pattern generator by testing stability across different walking speeds and step lengths.

## Analysis Problems

1. **Stability Analysis**: For a simple 2-DOF manipulator with given dynamics, analyze the stability of a PD control system. Determine conditions under which the system remains stable.

2. **Energy Efficiency**: Compare the energy consumption of different control strategies (position control, impedance control, model-based control) for a repetitive manipulation task. Consider both theoretical analysis and simulation results.

3. **Computational Complexity**: Analyze the computational requirements for inverse kinematics and dynamics calculations as the number of degrees of freedom increases. Propose optimization strategies for real-time implementation.

## Research and Investigation

1. **Literature Review**: Research recent advances in artificial muscle technology for robotics. Write a 500-word summary comparing traditional actuators with artificial muscles, including:
   - Technical specifications and capabilities
   - Advantages for humanoid robotics applications
   - Current limitations and challenges
   - Future development prospects

2. **Case Study Analysis**: Analyze the motor control systems of three different humanoid robots (e.g., Boston Dynamics robots, Honda ASIMO, SoftBank Pepper). Create a comparative analysis focusing on:
   - Actuation technology used
   - Control strategies implemented
   - Performance characteristics
   - Design trade-offs made

## Practical Implementation Challenge

1. **Build a Simple Robot Controller**: Using a simulation environment (like PyBullet, Gazebo, or MuJoCo) or physical hardware:
   - Implement a basic controller for a 2-3 DOF manipulator
   - Add a vision system for target detection
   - Implement visual servoing to reach a target
   - Document the control architecture and performance metrics
   - Identify and solve challenges faced during implementation

## Discussion Questions

1. **Safety Considerations**: How do safety considerations influence motor control design in humanoid robots? What control strategies can ensure safe human-robot interaction?

2. **Learning vs. Model-Based Control**: When might learning-based motor control approaches be preferable to traditional model-based approaches? Discuss specific scenarios and applications.

3. **Bio-inspiration**: How can insights from biological motor control systems inform the design of robotic control systems? What are the key differences between biological and artificial systems?

## Solutions and Hints

### Problem 1 Solution Outline:
- Use the forward kinematics equations with the given parameters
- Calculate each link's contribution to the end-effector position
- Add cos and sin components separately
- The result should be in the form (x, y)

### Problem 3 Solution Outline:
- Use the ZMP formula: x_ZMP = x_COM - (h/g) * ẍ_COM
- y_ZMP = y_COM - (h/g) * ÿ_COM
- Substitute the given values
- The ZMP should be close to the CoM position if acceleration is small

### Programming Exercise 1 Hints:
- Look up cubic spline interpolation formulas
- For smooth trajectories, ensure continuity of position, velocity, and acceleration
- Consider using the trapezoidal velocity profile for smoother motion