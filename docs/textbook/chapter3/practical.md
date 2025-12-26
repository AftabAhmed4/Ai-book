# Chapter 3: Practical Applications of Motor Control and Actuation

## Implementing PID Controllers for Motor Control

In this section, we'll explore practical implementations of PID controllers for motor control in humanoid robots.

### Basic PID Controller Implementation

```python
import numpy as np
import time

class PIDController:
    def __init__(self, kp, ki, kd, output_limits=(-np.inf, np.inf)):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.output_limits = output_limits
        
        self.reset()
    
    def reset(self):
        self.previous_error = 0.0
        self.integral = 0.0
        self.previous_time = time.time()
    
    def compute(self, setpoint, measured_value):
        current_time = time.time()
        dt = current_time - self.previous_time
        
        if dt <= 0.0:
            return 0.0
        
        # Calculate error
        error = setpoint - measured_value
        
        # Proportional term
        p_term = self.kp * error
        
        # Integral term
        self.integral += error * dt
        i_term = self.ki * self.integral
        
        # Derivative term
        derivative = (error - self.previous_error) / dt
        d_term = self.kd * derivative
        
        # Calculate output
        output = p_term + i_term + d_term
        
        # Apply output limits
        output = np.clip(output, self.output_limits[0], self.output_limits[1])
        
        # Update state
        self.previous_error = error
        self.previous_time = current_time
        
        return output

# Motor control example
class MotorController:
    def __init__(self, kp=10.0, ki=0.1, kd=0.01):
        self.position_controller = PIDController(kp, ki, kd)
        self.velocity_controller = PIDController(2.0, 0.01, 0.1)
        
        # Motor parameters (example values for a servo motor)
        self.motor_position = 0.0
        self.motor_velocity = 0.0
        self.target_position = 0.0
        self.target_velocity = 0.0
        self.max_torque = 10.0  # Nm
    
    def update(self, dt):
        # Position control
        position_error = self.target_position - self.motor_position
        required_velocity = self.position_controller.compute(self.target_position, self.motor_position)
        
        # Velocity control
        required_torque = self.velocity_controller.compute(required_velocity, self.motor_velocity)
        
        # Apply torque limits
        required_torque = np.clip(required_torque, -self.max_torque, self.max_torque)
        
        # Update motor state (simplified model)
        acceleration = required_torque  # Simplified: assuming unit inertia
        self.motor_velocity += acceleration * dt
        self.motor_position += self.motor_velocity * dt
        
        return {
            'position': self.motor_position,
            'velocity': self.motor_velocity,
            'torque': required_torque
        }
```

### Advanced Control: Inverse Kinematics Implementation

```python
import numpy as np
from scipy.spatial.transform import Rotation as R

class InverseKinematics:
    def __init__(self, links_lengths):
        self.l = links_lengths  # List of link lengths
    
    def jacobian(self, joint_angles):
        """Compute the geometric Jacobian for a planar manipulator"""
        n = len(joint_angles)
        jacobian = np.zeros((2, n))  # 2DOF position in 2D space
        
        # Calculate end-effector position for all joints
        x = 0.0
        y = 0.0
        current_angle = 0.0
        
        # Position of end effector
        for i in range(n):
            current_angle += joint_angles[i]
            x += self.l[i] * np.cos(current_angle)
            y += self.l[i] * np.sin(current_angle)
        
        # Calculate Jacobian columns
        current_angle = 0.0
        x_cum = 0.0
        y_cum = 0.0
        
        for i in range(n):
            current_angle += joint_angles[i]
            x_cum += self.l[i] * np.cos(current_angle)
            y_cum += self.l[i] * np.sin(current_angle)
            
            # Column i of Jacobian
            jacobian[0, i] = -y + y_cum  # ∂x/∂θᵢ
            jacobian[1, i] = x - x_cum   # ∂y/∂θᵢ
        
        return jacobian
    
    def solve_ik(self, target_pos, current_angles, max_iter=100, threshold=1e-4):
        """Solve inverse kinematics using Jacobian transpose method"""
        angles = current_angles.copy()
        
        for i in range(max_iter):
            # Calculate current end-effector position
            current_pos = self.forward_kinematics(angles)
            
            # Calculate error
            error = target_pos - current_pos
            
            if np.linalg.norm(error) < threshold:
                break
            
            # Calculate Jacobian
            J = self.jacobian(angles)
            
            # Update angles using Jacobian transpose
            angles += 0.1 * J.T @ error  # Learning rate of 0.1
        
        return angles
    
    def forward_kinematics(self, joint_angles):
        """Calculate end-effector position from joint angles"""
        x = 0.0
        y = 0.0
        current_angle = 0.0
        
        for i, angle in enumerate(joint_angles):
            current_angle += angle
            x += self.l[i] * np.cos(current_angle)
            y += self.l[i] * np.sin(current_angle)
        
        return np.array([x, y])

# Example usage
ik_solver = InverseKinematics([0.5, 0.5, 0.3])  # 3-link arm
target = np.array([0.7, 0.5])
initial_angles = np.array([0.1, 0.2, 0.05])
solution = ik_solver.solve_ik(target, initial_angles)
```

## Implementing Balance Control

### Center of Mass Control

```python
import numpy as np

class BalanceController:
    def __init__(self, robot_mass, gravity=9.81):
        self.mass = robot_mass
        self.gravity = gravity
        
        # ZMP controller parameters
        self.zmp_kp = 100.0
        self.zmp_kd = 20.0
        
        # Robot state
        self.com_position = np.array([0.0, 0.0, 0.8])  # Center of mass (x, y, z)
        self.com_velocity = np.array([0.0, 0.0, 0.0])
        self.com_acceleration = np.array([0.0, 0.0, 0.0])
        
        self.support_polygon = np.array([[0.1, 0.1], [0.1, -0.1], [-0.1, -0.1], [-0.1, 0.1]])  # Example support polygon
    
    def calculate_zmp(self, com_pos, com_acc):
        """Calculate Zero Moment Point from CoM position and acceleration"""
        z_height = com_pos[2]
        zmp_x = com_pos[0] - (z_height / self.gravity) * com_acc[0]
        zmp_y = com_pos[1] - (z_height / self.gravity) * com_acc[1]
        return np.array([zmp_x, zmp_y])
    
    def is_stable(self, zmp, tolerance=0.05):
        """Check if ZMP is within support polygon with tolerance"""
        zmp_x, zmp_y = zmp
        
        # Simplified check for rectangular support polygon
        x_min = np.min(self.support_polygon[:, 0])
        x_max = np.max(self.support_polygon[:, 0])
        y_min = np.min(self.support_polygon[:, 1])
        y_max = np.max(self.support_polygon[:, 1])
        
        return (x_min - tolerance <= zmp_x <= x_max + tolerance and
                y_min - tolerance <= zmp_y <= y_max + tolerance)
    
    def balance_control(self, dt):
        """Generate control commands to maintain balance"""
        # Calculate current ZMP
        current_zmp = self.calculate_zmp(self.com_position, self.com_acceleration)
        
        # Check if stable
        if not self.is_stable(current_zmp):
            # Generate corrective forces
            zmp_error = -current_zmp  # Drive ZMP toward origin (center of support)
            
            # PID-like control for ZMP
            corrective_force_x = self.zmp_kp * zmp_error[0] - self.zmp_kd * self.com_velocity[0]
            corrective_force_y = self.zmp_kp * zmp_error[1] - self.zmp_kd * self.com_velocity[1]
            
            # Convert to CoM acceleration (assuming simplified model)
            self.com_acceleration[0] = corrective_force_x / self.mass
            self.com_acceleration[1] = corrective_force_y / self.mass
        else:
            # If stable, relax to desired CoM position
            desired_com = np.array([0.0, 0.0, 0.8])
            com_error = desired_com - self.com_position
            self.com_acceleration = 2.0 * com_error - 2.0 * self.com_velocity  # PD controller
        
        # Update state
        self.com_velocity += self.com_acceleration * dt
        self.com_position += self.com_velocity * dt
        
        return {
            'com_position': self.com_position.copy(),
            'com_velocity': self.com_velocity.copy(),
            'zmp': current_zmp,
            'stable': self.is_stable(current_zmp)
        }
```

## Implementing Actuator Control

### Series Elastic Actuator (SEA) Control

```python
class SeriesElasticActuator:
    def __init__(self, motor_params, spring_constant=1000):
        # Motor parameters
        self.motor_inertia = motor_params['inertia']
        self.gear_ratio = motor_params['gear_ratio']
        self.motor_resistance = motor_params['resistance']
        
        # Spring parameters
        self.k_spring = spring_constant
        
        # State variables
        self.motor_position = 0.0
        self.motor_velocity = 0.0
        self.motor_acceleration = 0.0
        self.spring_deflection = 0.0
        self.load_position = 0.0
        self.load_velocity = 0.0
        
        # Control parameters
        self.position_controller = PIDController(50.0, 1.0, 0.1)
        self.force_controller = PIDController(100.0, 5.0, 1.0)
    
    def update(self, target_position, target_force, dt):
        """Update SEA state based on control inputs"""
        # Calculate spring force
        spring_force = self.k_spring * self.spring_deflection
        
        # Calculate load acceleration (simplified model)
        load_acceleration = (spring_force - target_force) / 1.0  # Assuming unit load inertia
        
        # Update load state
        self.load_velocity += load_acceleration * dt
        self.load_position += self.load_velocity * dt
        
        # Calculate motor control torque based on position error
        motor_torque = self.position_controller.compute(target_position, self.load_position)
        
        # Apply motor dynamics (simplified)
        self.motor_acceleration = (motor_torque - spring_force) / self.motor_inertia
        self.motor_velocity += self.motor_acceleration * dt
        self.motor_position += self.motor_velocity * dt
        
        # Update spring deflection
        self.spring_deflection = self.motor_position - self.load_position
        
        return {
            'load_position': self.load_position,
            'load_velocity': self.load_velocity,
            'spring_force': spring_force,
            'deflection': self.spring_deflection
        }

# Example: Controlling a compliant manipulator
sea_params = {
    'inertia': 0.01,
    'gear_ratio': 100,
    'resistance': 0.5
}

sea = SeriesElasticActuator(sea_params, spring_constant=500)
```

## Locomotion Control Implementation

### Walking Pattern Generator

```python
import numpy as np

class WalkingPatternGenerator:
    def __init__(self, step_length=0.3, step_height=0.1, step_time=0.8):
        self.step_length = step_length
        self.step_height = step_height
        self.step_time = step_time
        self.dt = 0.01  # 100Hz control rate
        
        # Current state
        self.phase = 0.0  # 0.0 to 1.0, representing phase in gait cycle
        self.swing_leg = 'right'  # Which leg is currently swinging
        self.left_foot_pos = np.array([0.0, 0.1, 0.0])
        self.right_foot_pos = np.array([0.0, -0.1, 0.0])
        self.com_height = 0.8  # Desired CoM height
    
    def generate_step_trajectory(self, start_pos, end_pos, height, t):
        """Generate smooth trajectory for foot movement during swing phase"""
        # Use 5th order polynomial for smooth movement
        # x(t) = a₀ + a₁t + a₂t² + a₃t³ + a₄t⁴ + a₅t⁵
        
        # Boundary conditions:
        # At t=0: x=0, ẋ=0, ẍ=0
        # At t=1: x=1, ẋ=0, ẍ=0
        t_norm = t  # Normalize time from 0 to 1
        
        # Calculate polynomial coefficients
        a0 = 0.0
        a1 = 0.0
        a2 = 0.0
        a3 = 10.0
        a4 = -15.0
        a5 = 6.0
        
        # Position along trajectory
        x_progress = a0 + a1*t_norm + a2*t_norm**2 + a3*t_norm**3 + a4*t_norm**4 + a5*t_norm**5
        
        # Calculate foot position
        current_pos = start_pos + x_progress * (end_pos - start_pos)
        
        # Calculate vertical position for step height
        if t_norm < 0.5:
            # Ascending phase
            vertical_progress = (1 - np.cos(np.pi * t_norm)) / 2
        else:
            # Descending phase
            vertical_progress = (1 - np.cos(np.pi * (1 - t_norm))) / 2
        current_pos[2] = start_pos[2] + vertical_progress * height
        
        return current_pos
    
    def update(self, dt):
        """Update walking pattern based on time step"""
        # Update gait phase
        self.phase += dt / self.step_time
        
        if self.phase >= 1.0:
            self.phase = 0.0
            # Switch swing leg
            if self.swing_leg == 'right':
                self.swing_leg = 'left'
                # Move right foot forward
                self.left_foot_pos[0] += self.step_length
            else:
                self.swing_leg = 'right'
                # Move left foot forward
                self.right_foot_pos[0] += self.step_length
        
        # Calculate target foot positions
        if self.swing_leg == 'right':
            # Right foot is swinging forward
            target_right_pos = self.generate_step_trajectory(
                np.array([self.right_foot_pos[0] - self.step_length, self.right_foot_pos[1], 0.0]),
                np.array([self.right_foot_pos[0] + self.step_length, self.right_foot_pos[1], 0.0]),
                self.step_height,
                self.phase
            )
            self.right_foot_pos = target_right_pos
        else:
            # Left foot is swinging forward
            target_left_pos = self.generate_step_trajectory(
                np.array([self.left_foot_pos[0] - self.step_length, self.left_foot_pos[1], 0.0]),
                np.array([self.left_foot_pos[0] + self.step_length, self.left_foot_pos[1], 0.0]),
                self.step_height,
                self.phase
            )
            self.left_foot_pos = target_left_pos
        
        return {
            'left_foot_pos': self.left_foot_pos.copy(),
            'right_foot_pos': self.right_foot_pos.copy(),
            'com_height': self.com_height,
            'phase': self.phase,
            'swing_leg': self.swing_leg
        }

# Example usage of walking controller
walker = WalkingPatternGenerator(step_length=0.3, step_height=0.05, step_time=1.0)
```

## Whole-Body Control Implementation

### Task-Priority Control

```python
import numpy as np
from scipy.linalg import block_diag

class WholeBodyController:
    def __init__(self, num_joints, mass_matrix):
        self.n = num_joints
        self.M = mass_matrix  # Inertia matrix
        self.gravity = 9.81
        
        # Initialize task Jacobians and desired values
        self.tasks = []
    
    def add_task(self, task_type, jacobian, desired_value, priority=0, weight=1.0):
        """Add a control task to the system"""
        task = {
            'type': task_type,
            'jacobian': jacobian,  # Size: (task_dim, n)
            'desired': desired_value,  # Size: (task_dim,)
            'priority': priority,
            'weight': weight
        }
        self.tasks.append(task)
        self.tasks.sort(key=lambda x: x['priority'], reverse=True)  # Higher priority first
    
    def compute_control(self, joint_angles, joint_velocities, gravity_compensation=True):
        """Compute joint torques using task-priority control"""
        # Initialize nullspace projector
        I = np.eye(self.n)
        N_last = I.copy()
        torques = np.zeros(self.n)
        
        # Process tasks in order of priority
        for task in self.tasks:
            J_task = task['jacobian']
            x_des = task['desired']
            
            # Project Jacobian to current nullspace
            J_proj = J_task @ N_last
            
            # Calculate task error
            current_value = J_task @ joint_velocities  # Simplified for velocity control
            error = x_des - current_value
            
            # Calculate control in the projected space
            # Use damped least squares to avoid singularities
            damping = 0.01
            A = J_proj @ J_proj.T + damping * np.eye(J_proj.shape[0])
            lambda_task = np.linalg.solve(A, error)
            
            # Calculate joint torques for this task
            tau_task = N_last.T @ J_proj.T @ lambda_task
            
            # Add to total torques
            torques += task['weight'] * tau_task
            
            # Update nullspace projector (for lower priority tasks)
            # Calculate pseudo-inverse of projected Jacobian
            J_pinv = J_proj.T @ np.linalg.inv(A)
            
            # Update nullspace projector
            N_current = N_last @ (I - J_pinv @ J_proj)
            N_last = N_current
        
        # Add gravity compensation if requested
        if gravity_compensation:
            g_compensation = self.compute_gravity_compensation(joint_angles)
            torques += g_compensation
        
        return torques
    
    def compute_gravity_compensation(self, joint_angles):
        """Simple gravity compensation (in practice, this would be more complex)"""
        # This is a simplified model - in practice, gravity terms depend on configuration
        g_torques = np.zeros(self.n)
        for i in range(self.n):
            g_torques[i] = 0.5 * self.gravity * np.cos(joint_angles[i])
        return g_torques

# Example usage
n_joints = 12  # Example for a simple humanoid
M = np.eye(n_joints) * 0.5  # Simplified inertia matrix

wbc = WholeBodyController(n_joints, M)

# Add tasks (simplified examples)
# Task 1: Left foot position control (high priority)
J_left_foot = np.random.rand(6, n_joints)  # 6DOF: 3 position + 3 orientation
wbc.add_task('left_foot_pos', J_left_foot, np.zeros(6), priority=2, weight=1.0)

# Task 2: Balance control (medium priority)
J_com = np.random.rand(2, n_joints)  # 2DOF: x,y position of CoM
wbc.add_task('balance', J_com, np.zeros(2), priority=1, weight=0.5)

# Task 3: Posture control (low priority)
q_desired = np.zeros(n_joints)
J_posture = np.eye(n_joints)
wbc.add_task('posture', J_posture, q_desired, priority=0, weight=0.1)
```

## Real-time Control Considerations

### Control Loop Implementation

```python
import threading
import time

class RealtimeMotorController:
    def __init__(self, control_frequency=1000):  # 1kHz control rate
        self.control_freq = control_frequency
        self.dt = 1.0 / control_freq
        self.is_running = False
        self.controller_thread = None
        
        # Initialize controllers
        self.motors = {}  # Dictionary of motor controllers
        self.robot_state = {}  # Current robot state
        
        # Performance monitoring
        self.loop_times = []
        self.target_time = 1.0 / control_frequency
    
    def add_motor(self, motor_id, controller_params):
        """Add a motor with its controller"""
        self.motors[motor_id] = {
            'controller': PIDController(**controller_params),
            'current_pos': 0.0,
            'current_vel': 0.0,
            'target_pos': 0.0
        }
    
    def set_target(self, motor_id, target_position):
        """Set target position for a specific motor"""
        if motor_id in self.motors:
            self.motors[motor_id]['target_pos'] = target_position
    
    def get_state(self, motor_id):
        """Get current state of a specific motor"""
        if motor_id in self.motors:
            return {
                'position': self.motors[motor_id]['current_pos'],
                'velocity': self.motors[motor_id]['current_vel']
            }
        return None
    
    def control_step(self):
        """Perform one control step"""
        start_time = time.perf_counter()
        
        # Update each motor
        for motor_id, motor_data in self.motors.items():
            # Compute control output
            output = motor_data['controller'].compute(
                motor_data['target_pos'], 
                motor_data['current_pos']
            )
            
            # Apply control (simulated motor dynamics)
            motor_data['current_vel'] += output * self.dt  # Simplified
            motor_data['current_pos'] += motor_data['current_vel'] * self.dt
            
            # In real hardware, send output to motor driver here
        
        # Record loop time for performance monitoring
        end_time = time.perf_counter()
        loop_time = end_time - start_time
        self.loop_times.append(loop_time)
        
        # Maintain control frequency
        sleep_time = self.target_time - loop_time
        if sleep_time > 0:
            time.sleep(sleep_time)
        else:
            # Control loop is too slow - log warning
            print(f"Control loop exceeded deadline by {abs(sleep_time)*1000:.2f}ms")
    
    def start_control(self):
        """Start the real-time control loop"""
        self.is_running = True
        self.controller_thread = threading.Thread(target=self._control_loop)
        self.controller_thread.start()
    
    def stop_control(self):
        """Stop the real-time control loop"""
        self.is_running = False
        if self.controller_thread:
            self.controller_thread.join()
        
        # Print performance statistics
        if self.loop_times:
            avg_time = sum(self.loop_times) / len(self.loop_times)
            max_time = max(self.loop_times)
            print(f"Control loop performance:")
            print(f"  Average time: {avg_time*1000:.2f}ms")
            print(f"  Max time: {max_time*1000:.2f}ms")
            print(f"  Target time: {self.target_time*1000:.2f}ms")
    
    def _control_loop(self):
        """Internal control loop function"""
        while self.is_running:
            self.control_step()

# Example: Setting up a simple motor control system
rt_controller = RealtimeMotorController(control_frequency=1000)

# Add motors
rt_controller.add_motor('hip', {'kp': 100.0, 'ki': 5.0, 'kd': 1.0})
rt_controller.add_motor('knee', {'kp': 80.0, 'ki': 4.0, 'kd': 0.8})
rt_controller.add_motor('ankle', {'kp': 60.0, 'ki': 3.0, 'kd': 0.6})

# Set targets
rt_controller.set_target('hip', 0.1)
rt_controller.set_target('knee', -0.05)
rt_controller.set_target('ankle', 0.02)

# Start control (in a real scenario, this would run continuously)
# rt_controller.start_control()
# time.sleep(5)  # Run for 5 seconds
# rt_controller.stop_control()
```

## Integration Example: Simple Walking Controller

```python
class SimpleWalkingController:
    def __init__(self):
        # Initialize controllers for each leg
        self.left_leg = MotorController(kp=50.0, ki=2.0, kd=5.0)
        self.right_leg = MotorController(kp=50.0, ki=2.0, kd=5.0)
        
        # Walking state
        self.phase = 0.0  # 0.0 to 1.0
        self.step_time = 1.0  # 1 second per step
        self.walk_active = False
        
    def step(self, dt):
        """Perform one walking control step"""
        if not self.walk_active:
            return
        
        # Update phase
        self.phase += dt / self.step_time
        if self.phase > 1.0:
            self.phase = 0.0
        
        # Generate walking pattern based on phase
        self.generate_walking_pattern()
        
        # Update motor controllers
        left_state = self.left_leg.update(dt)
        right_state = self.right_leg.update(dt)
        
        return {
            'left_leg': left_state,
            'right_leg': right_state,
            'phase': self.phase
        }
    
    def generate_walking_pattern(self):
        """Generate walking pattern based on current phase"""
        # Simplified walking pattern
        if self.phase < 0.5:
            # Left leg swings forward, right leg supports
            self.left_leg.target_position = 0.1 * np.sin(2 * np.pi * self.phase * 2)
            self.right_leg.target_position = 0.0
        else:
            # Right leg swings forward, left leg supports
            self.right_leg.target_position = 0.1 * np.sin(2 * np.pi * (self.phase - 0.5) * 2)
            self.left_leg.target_position = 0.0
    
    def start_walking(self):
        self.walk_active = True
        self.phase = 0.0
    
    def stop_walking(self):
        self.walk_active = False
        self.left_leg.target_position = 0.0
        self.right_leg.target_position = 0.0

# Example usage
walker = SimpleWalkingController()
walker.start_walking()
```

## Conclusion

This chapter provided practical implementations of motor control and actuation systems for humanoid robots. We covered PID controllers, kinematic solutions, balance control, actuator control, and real-time implementation considerations. The examples can be adapted and extended for specific robot platforms and applications.

These implementations form the foundation for developing sophisticated control systems that enable humanoid robots to move with stability and dexterity. In practice, these systems need to be tuned for specific hardware and applications, and often require significant optimization to run in real-time.