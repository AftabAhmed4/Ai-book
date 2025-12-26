### A* Algorithm

A* is a heuristic extension of Dijkstra's algorithm. It uses the evaluation function `f(n) = g(n) + h(n)`, where:

- `g(n)` is the known cost from the start node to node `n`
- `h(n)` is the heuristic estimated cost from node `n` to the goal
- `f(n)` is the estimated total cost of the path through node `n`

A* is optimal if the heuristic `h(n)` is admissible, meaning it never overestimates the true cost to the goal.

## 4.5 Optimization-Based Motion Planning

### Optimal Control Formulation

The motion planning problem can be formulated as an optimal control problem: minimize the integral of a cost function `L(x(t), u(t), t)` from `t = 0` to `T`, subject to the system dynamics `dx/dt = f(x(t), u(t), t)`, initial condition `x(0) = x_start`, terminal condition `x(T) = x_goal`, and inequality constraints `g(x(t), u(t)) <= 0`.

Here:
- `L` is the Lagrangian (running cost)
- `f` defines the system dynamics
- `g` represents path and control constraints

### Trajectory Optimization

The continuous optimal control problem is discretized and solved as a nonlinear programming problem: minimize the sum of stage costs `L(x_k, u_k)` subject to discrete dynamics `x_{k+1} = f(x_k, u_k)`, initial state `x_0 = x_start`, final state `x_N = x_goal`, and constraints `g(x_k, u_k) <= 0`.

## 4.6 Navigation Functions

### Artificial Potential Fields

Artificial potential fields combine an attractive potential pulling the robot toward the goal and a repulsive potential pushing it away from obstacles.

The total potential is `U_total = U_attr + U_rep`.

The attractive potential is typically quadratic in the distance to the goal, while the repulsive potential is inversely related to the distance to the nearest obstacle and active only within a certain range.

The control input is the negative gradient of the total potential: `u = -grad(U_attr + U_rep)`.

### Navigation Functions on Manifolds

For smooth configuration space manifolds, navigation functions `phi` are designed to be smooth and polar with:
1. a unique minimum at the goal configuration
2. no local minima other than the goal
3. values approaching infinity near obstacles

Following the negative gradient of such a function guarantees convergence to the goal without getting trapped in local minima.

## 4.7 Control Theory for Navigation

### Feedback Linearization

Feedback linearization transforms nonlinear robot dynamics into an equivalent linear system by canceling nonlinear terms with a suitable control input.

The resulting torque command is of the form:
`tau = M(q) * x_ddot_des + C(q, q_dot) * q_dot + g(q) + feedback_terms`

Here `K_p` and `K_v` are positive definite gain matrices that shape the closed-loop error dynamics.

### Lyapunov-Based Control

Lyapunov-based methods design control laws that make a positive definite Lyapunov function `V` decrease along system trajectories.

A common choice is `V(e) = 0.5 * e^T * e`, where `e = q - q_des` is the configuration error. The control is designed such that `dV/dt = e^T * de/dt < 0`, ensuring asymptotic stability.

## 4.8 Uncertainty and Stochastic Planning

### Stochastic Motion Planning

In the presence of uncertainty, planning occurs in belief space. The objective is to minimize the expected cost subject to stochastic differential equations of the form:
`dx = f(x, u, w) dt + g(x, u) dW`
where `w` is process noise and `W` is a Wiener process.

### Partially Observable Markov Decision Processes (POMDPs)

For partially observable environments, the problem is modeled as a POMDP. The optimal policy `pi*` maximizes the expected discounted reward starting from initial belief `b_0`, accounting for partial observability through belief state updates.

## 4.9 Dynamic Environment Planning

### Velocity Obstacles

The velocity obstacle `VO_{i,j}` for a moving obstacle is the set of robot velocities `v` that will lead to collision, assuming constant obstacle velocity `v_j`. Selecting a control velocity outside all velocity obstacles ensures collision avoidance.

### Nonlinear Model Predictive Control (NMPC)

NMPC solves a finite-horizon optimal control problem at each time step, minimizing a cost over predicted states and controls subject to dynamics and constraints. The first control input is applied, and the process repeats at the next step with updated state measurements.

## 4.10 Multi-Robot Coordination

### Priority-Based Planning

Robots are assigned priorities and plan sequentially. Higher-priority robots plan ignoring lower-priority ones, while lower-priority robots treat higher-priority trajectories as dynamic obstacles.

### Conflict-Based Search (CBS)

CBS is a two-level algorithm:
- High level: searches over conflict avoidance constraints between robot trajectories
- Low level: plans individual collision-free paths using single-agent planners like A*

## 4.11 Computational Complexity

### Complexity Analysis

- Grid-based methods: `O(n^2)` in 2D, `O(n^3)` in 3D
- Sampling-based methods: offer probabilistic completeness with good practical performance
- Exact cell decomposition: exponential in configuration space dimension in general
- Visibility graphs: `O(n^2 log n)` for shortest paths in 2D polygonal environments

## 4.12 Convergence and Optimality

### Asymptotic Optimality

Algorithms like RRT* are asymptotically optimal: as the number of samples goes to infinity, the cost of the returned solution converges in probability to the optimal cost.

### Rate of Convergence

This refers to how quickly probabilistically complete planners find a feasible solution (if one exists) as the number of samples increases.

## Conclusion

The theoretical foundations of motion planning provide the mathematical tools needed to develop robust navigation systems for humanoid robots. Understanding these concepts is essential for designing algorithms that can generate safe, efficient, and dynamically feasible paths in complex environments. The frameworks presented here form the basis for advanced planning approaches used in current humanoid robotics systems.
