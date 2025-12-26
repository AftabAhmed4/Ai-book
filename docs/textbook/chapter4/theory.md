
### A* Algorithm

A* is a heuristic extension of Dijkstra's algorithm:

$$ f(n) = g(n) + h(n) $$

Where:
- \(g(n)\) is the cost from start to node \(n\)
- \(h(n)\) is the heuristic estimate from \(n\) to goal
- \(f(n)\) is the estimated total cost of the path through \(n\)

A* is optimal if \(h(n)\) is admissible (never overestimates the actual cost).

## 4.5 Optimization-Based Motion Planning

### Optimal Control Formulation

The motion planning problem can be formulated as an optimal control problem:

$$
\min \int_0^T L(x(t), u(t), t) \, dt
$$
subject to
$$
\dot{x}(t) = f(x(t), u(t), t), \quad
x(0) = x_\text{start}, \quad
x(T) = x_\text{goal}, \quad
g(x(t), u(t)) \leq 0
$$

Where:
- \(L\) is the Lagrangian (cost function)
- \(f\) defines the system dynamics
- \(g\) represents constraints

### Trajectory Optimization

Discretize the continuous problem and solve the resulting nonlinear program:

$$
\min \sum L(x_k, u_k)
$$
subject to
$$
x_{k+1} = f(x_k, u_k), \quad
x_0 = x_\text{start}, \quad
x_N = x_\text{goal}, \quad
g(x_k, u_k) \leq 0
$$

## 4.6 Navigation Functions

### Artificial Potential Fields

Define attractive and repulsive potential fields:


Where \(\rho(q)\) is the distance to the nearest obstacle.

The control is then: \( u = -\nabla (U_\text{attr} + U_\text{rep}) \)

### Navigation Functions on Manifolds

For configuration spaces that are smooth manifolds, navigation functions \(\phi\) are smooth, polar functions that satisfy:
1. \(\phi\) has a unique minimum at the goal
2. \(\phi\) has no local minima other than the goal
3. \(\phi\) approaches infinity near obstacles

## 4.7 Control Theory for Navigation

### Feedback Linearization

Transform the nonlinear robot dynamics into a linear system for control design:

$$ \tau = M(q)\ddot{x}_\text{des} + C(q, \dot{q})\dot{q} + g(q) + M(q)K_v(\dot{q}_\text{des} - \dot{q}) + M(q)K_p(q_\text{des} - q) $$

Where \(K_p\) and \(K_v\) are positive definite gain matrices.

### Lyapunov-Based Control

Design a control law that ensures the Lyapunov function \(V\) decreases along system trajectories:

$$
V(e) = \frac{1}{2} e^\top e \quad \text{where} \quad e = q - q_\text{des}
$$
$$
\dot{V}(e) = e^\top \dot{e} = e^\top (\dot{q} - \dot{q}_\text{des}) < 0
$$

## 4.8 Uncertainty and Stochastic Planning

### Stochastic Motion Planning

When uncertainty is present, plan in the belief space \(\mathcal{B}\):

$$
\min \mathbb{E}\left[ \int_0^T L(x(t), u(t), t) \, dt \right]
$$
subject to
$$
dx = f(x, u, w) \, dt + g(x, u) \, dW
$$

Where \(w\) is process noise and \(W\) is a Wiener process.

### Partially Observable Markov Decision Processes (POMDPs)

For partially observable environments:

$$ \pi^* = \arg\max_\pi \mathbb{E}\left[ \sum \gamma^t R(s_t, a_t) \mid \pi, b_0 \right] $$

Where \(b_t\) is the belief state and \(\gamma\) is the discount factor.

## 4.9 Dynamic Environment Planning

### Velocity Obstacles

The velocity obstacle for a moving obstacle is defined as:

$$ \text{VO}_{i,j} = \{ v \mid (v - v_j) \cdot \hat{n} + r_j \geq 0 \} $$

Where \(v_j\) is the obstacle velocity, \(\hat{n}\) is the normal to the collision surface, and \(r_j\) is the "collision cone" parameter.

### Nonlinear Model Predictive Control (NMPC)

Solve an optimization problem at each time step over a prediction horizon:

$$
\min \sum L(x_k, u_k) + \Phi(x_N)
$$
subject to
$$
x_{k+1} = f(x_k, u_k), \quad
x_0 = \text{current_state}, \quad
x_k \in \mathcal{X}_\text{free}, \quad u_k \in \mathcal{U}
$$

## 4.10 Multi-Robot Coordination

### Priority-Based Planning

Assign priorities to robots and plan sequentially:
$$ \tau_i = \arg\min_\tau c(\tau_i) $$
subject to:
- \(\tau_i\) is collision-free with obstacles
- \(\tau_i\) is collision-free with already planned \(\tau_j\) (\(j < i\))

### Conflict-Based Search (CBS)

A two-level approach:
- High level: Resolve conflicts between robot trajectories
- Low level: Plan individual robot paths using A* or similar

## 4.11 Computational Complexity

### Complexity Analysis

- **Grid-based methods**: \(O(n^2)\) or \(O(n^3)\) for 2D/3D grids
- **Sampling-based methods**: Probabilistic completeness, practical performance
- **Exact cell decomposition**: \(O(2^n)\) in general, polynomial for special cases
- **Visibility graphs**: \(O(n^2 \log n)\) for the shortest path in 2D

## 4.12 Convergence and Optimality

### Asymptotic Optimality

Algorithms like RRT* are asymptotically optimal, meaning as the number of samples approaches infinity, the solution cost approaches the optimal cost.

### Rate of Convergence

The rate at which a probabilistically complete algorithm finds a solution (if one exists) as more samples are added to the search.

## Conclusion

The theoretical foundations of motion planning provide the mathematical tools needed to develop robust navigation systems for humanoid robots. Understanding these concepts is essential for designing algorithms that can generate safe, efficient, and dynamically feasible paths in complex environments. The mathematical frameworks presented here form the basis for advanced planning approaches used in current humanoid robotics systems.