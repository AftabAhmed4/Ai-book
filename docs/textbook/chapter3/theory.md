# Chapter 3: Theoretical Foundations of Motor Control and Actuation

## Mathematical Models for Motor Control

Motor control in humanoid robotics requires mathematical models that accurately describe the complex dynamics of multi-link systems. These models form the foundation for control algorithms that enable stable, efficient, and dexterous robot motion.

## 3.1 Robot Kinematics

### Forward Kinematics

For an n-DOF robot manipulator with joint angles θ = [θ₁, θ₂, ..., θₙ]ᵀ, the forward kinematics maps joint space to Cartesian space:

```
p = f(θ)
```

Where p represents the end-effector position and orientation.

For a serial chain of links, this is computed using the Denavit-Hartenberg (DH) parameters:

```
T = A₁(θ₁) × A₂(θ₂) × ... × Aₙ(θₙ)
```

Where Aᵢ represents the transformation matrix for the i-th joint.

### Inverse Kinematics

The inverse kinematics problem seeks to find joint angles that achieve a desired end-effector pose:

```
θ = f⁻¹(p)
```

This is often solved using:
- **Analytical solutions**: For simple kinematic chains
- **Iterative methods**: Jacobian-based approaches like Newton-Raphson

The Jacobian matrix J(θ) relates joint velocities to end-effector velocities:

```
ṗ = J(θ)θ̇
```

For inverse kinematics: θ̇ = J⁺ṗ, where J⁺ is the pseudoinverse of J.

## 3.2 Robot Dynamics

### Lagrangian Formulation

The dynamics of an n-DOF robot are described by the Lagrange equation:

```
τ = M(θ)θ̈ + C(θ,θ̇)θ̇ + g(θ) + JᵀF_ext
```

Where:
- τ is the vector of joint torques
- M(θ) is the inertia matrix
- C(θ,θ̇) is the Coriolis and centrifugal force matrix
- g(θ) is the gravity vector
- F_ext represents external forces

### Inertia Matrix

The inertia matrix M(θ) is computed as:

```
M(θ) = Σᵢ mᵢJᵥᵢᵀJᵥᵢ + Σᵢ JωᵢᵀIᵢJωᵢ
```

Where:
- Jᵥᵢ is the linear velocity Jacobian for link i
- Jωᵢ is the angular velocity Jacobian for link i
- Iᵢ is the inertia tensor for link i

## 3.3 Control Theory for Motor Systems

### PID Control

The Proportional-Integral-Derivative controller is fundamental in motor control:

```
u(t) = Kₚe(t) + Kᵢ∫e(τ)dτ + Kd de(t)/dt
```

Where:
- u(t) is the control output
- e(t) is the error signal
- Kₚ, Kᵢ, Kd are control gains

In discrete form:
```
u[k] = Kₚe[k] + Kᵢ∑e[i] + Kd(e[k] - e[k-1])
```

### State-Space Representation

Robot dynamics can be expressed in state-space form:

```
ẋ = f(x, u)
y = h(x)
```

Where x is the state vector [θ θ̇]ᵀ, u is the control input, and y is the output.

### Linear Quadratic Regulator (LQR)

For linearized systems, LQR provides optimal control by minimizing a quadratic cost function:

```
J = ∫[xᵀQx + uᵀRu] dt
```

The optimal control law is u = -Kx, where K is computed using the Riccati equation.

## 3.4 Balance and Stability Theory

### Zero Moment Point (ZMP)

For a robot in planar motion, the ZMP is the point on the ground where the net moment of the ground reaction force is zero:

```
x_ZMP = x_COM - h/g * ẍ_COM
y_ZMP = y_COM - h/g * ÿ_COM
```

Where:
- (x_COM, y_COM, h) is the center of mass position
- g is gravitational acceleration

For stable walking, the ZMP must remain within the support polygon.

### Capture Point (Capture Point)

The capture point is where the robot can step to stop safely:

```
x_CP = x_COM + ẋ_COM/ω
y_CP = y_COM + ẏ_COM/ω
```

Where ω = √(g/h) is the natural frequency of a linear inverted pendulum.

## 3.5 Control Strategies

### Operational Space Control

In operational space control, we control forces and motions in Cartesian space directly:

```
F = Λ(x)ẍ + μ(x, ẋ)
```

Where:
- Λ(x) = (J M⁻¹ Jᵀ)⁻¹ is the operational space inertia matrix
- μ(x, ẋ) = J M⁻¹(Cθ̇ + g) - J̇θ̇ is the Coriolis and gravity term in operational space

### Impedance Control

Impedance control regulates the mechanical impedance of the robot:

```
M_d(ẍ_d - ẍ) + B_d(ẋ_d - ẋ) + K_d(x_d - x) = F
```

Where:
- M_d, B_d, K_d are desired mass, damping, and stiffness matrices
- x_d, ẋ_d, ẍ_d are desired position, velocity, and acceleration

### Admittance Control

Admittance control relates motion to applied force:

```
M_a(ẍ - ẍ_ref) + B_a(ẋ - ẋ_ref) + K_a(x - x_ref) = F
```

## 3.6 Optimization-Based Control

### Quadratic Programming (QP) Formulation

Many control problems can be formulated as QP:

```
min ½xᵀHx + fᵀx
s.t. Ax ≤ b
     A_eq x = b_eq
```

For motor control, this might optimize torque distribution across redundant actuators while satisfying constraints.

## 3.7 Advanced Control Concepts

### Adaptive Control

Adaptive control adjusts controller parameters in real-time to handle unknown or changing dynamics:

```
τ = Y(θ,θ̇,θ̈)θ̂ + K_v(θ̇_r - θ̇) + K_p(θ_r - θ)
```

Where ŷ is the parameter estimate and θ̇_r = θ̇_d - λ(θ - θ_d) is the filtered tracking error.

### Sliding Mode Control

Sliding mode control forces the system state to follow a predefined sliding surface:

```
s = ė + λe
```

The control law ensures ė approaches the sliding surface s = 0.

### Model Predictive Control (MPC)

MPC solves an optimization problem at each time step over a prediction horizon:

```
min ∑[l(x_k, u_k) + l_f(x_N)]
s.t. x_{k+1} = f(x_k, u_k)
     x_min ≤ x_k ≤ x_max
     u_min ≤ u_k ≤ u_max
```

## 3.8 Actuator Models

### DC Motor Model

A DC motor can be modeled as:

```
V = R_a i_a + L_a di_a/dt + K_e ω
T = K_t i_a
```

Where:
- V is applied voltage
- i_a is armature current
- R_a, L_a are armature resistance and inductance
- K_e, K_t are back-emf and torque constants
- ω is angular velocity
- T is output torque

### Series Elastic Actuator (SEA) Model

The SEA model includes a spring element:

```
J_m θ̈_m + B_m θ̇_m = τ_m - K_s(θ_m - θ_l)
J_l θ̈_l + B_l θ̇_l = K_s(θ_m - θ_l) - τ_L
```

Where subscripts m and l refer to motor and load, respectively.

## 3.9 Stability Analysis

### Lyapunov Stability

A system is stable if there exists a Lyapunov function V(x) such that:
1. V(0) = 0 and V(x) > 0 for all x ≠ 0
2. V̇(x) ≤ 0 for all x (negative semi-definite)

### Passivity Theory

A system is passive if:
```
∫₀ᵀ uᵀ(t)y(t)dt ≥ -β
```

Passive systems are stable when connected in feedback with other passive systems.

## Conclusion

The theoretical foundations of motor control provide the mathematical tools needed to develop sophisticated control systems for humanoid robots. Understanding these concepts is essential for designing controllers that can achieve stable, efficient, and dexterous robot motion. The mathematical models presented here form the basis for advanced control strategies that enable humanoid robots to perform complex tasks in real-world environments.