# Chapter 4: Exercises and Problems

## Conceptual Questions

1. **Compare and contrast** sampling-based planners (RRT, PRM) with grid-based planners (A*, Dijkstra). What are the advantages and limitations of each approach for humanoid robot navigation?

2. **Explain** the concept of configuration space and how obstacles in the workspace translate to the configuration space for a multi-degree-of-freedom robot.

3. **Analyze** the differences between global path planning and local path planning (reactive navigation). When would you use each approach?

4. **Discuss** the challenges of motion planning for humanoid robots compared to wheeled robots. How do balance and bipedal locomotion constraints affect planning?

5. **Evaluate** the trade-offs between optimality and computational efficiency in path planning algorithms. Why might a suboptimal but fast algorithm be preferred in some applications?

## Mathematical Problems

1. **Configuration Space**: For a 2-DOF planar manipulator with link lengths L₁ = 1m, L₂ = 0.5m, and an obstacle at (1.5, 0.5) with radius 0.2m, determine if the configuration θ₁ = π/4, θ₂ = π/2 is in C_free or C_obst.

2. **A* Path Cost**: In a 10x10 grid where each cell has a movement cost of 1 (horizontal/vertical) and 1.414 (diagonal), use A* to find the path from (0,0) to (5,5) with an obstacle at (3,3). What is the total path cost?

3. **RRT Probability**: If an RRT algorithm has explored 1000 nodes in a 2D space with a free space area of 50m², what is the probability that a randomly sampled point is within 0.5m of an existing node?

4. **Velocity Obstacle**: A robot at position (0,0) with maximum speed of 1 m/s needs to avoid a moving obstacle at (2,0) moving at (0.5, 0) m/s. Calculate the velocity obstacle region that would cause a collision within 2 seconds.

5. **Path Optimization**: Given a path with waypoints [(0,0), (1,1), (2,1), (3,2)], find a shorter path by removing one intermediate waypoint while ensuring collision-free motion in a space with an obstacle at (1.5, 0.8) with radius 0.3.

## Programming Exercises

1. **Implement Dijkstra's Algorithm**: Create a function that finds the shortest path in a weighted graph representation of a grid map.

   ```python
   import numpy as np
   from typing import List, Tuple

   def dijkstra(grid_map: np.ndarray, start: Tuple[int, int], goal: Tuple[int, int]) -> List[Tuple[int, int]]:
       """
       Find shortest path using Dijkstra's algorithm
       Args:
           grid_map: 2D array where 0=free, 1=obstacle
           start: Starting coordinates (row, col)
           goal: Goal coordinates (row, col)
       Returns:
           List of coordinates representing the shortest path
       """
       # Your implementation here
       pass
   ```

2. **RRT* Implementation**: Enhance the basic RRT implementation to include rewiring for asymptotic optimality.

   ```python
   import numpy as np
   from typing import List, Tuple

   class RRTStarPlanner:
       def __init__(self, start: np.ndarray, goal: np.ndarray, bounds: List[Tuple[float, float]], 
                   max_iterations: int = 10000, step_size: float = 0.1, 
                   search_radius_factor: float = 1.1):
           # Initialize like RRT but add parameters for rewiring
           pass
       
       def plan(self) -> List[np.ndarray]:
           """Plan path using RRT* algorithm with rewiring"""
           # Your implementation here
           pass
       
       def rewire_node(self, new_node):
           """Rewire nodes to improve path cost"""
           # Your implementation here
           pass
   ```

3. **Path Smoothing**: Implement a path smoothing algorithm that takes a discrete path and returns a smooth trajectory.

   ```python
   import numpy as np
   from typing import List, Tuple

   def smooth_path(path: List[Tuple[float, float]], 
                   grid_map: np.ndarray, 
                   max_iterations: int = 100,
                   weight_data: float = 0.5,
                   weight_smooth: float = 0.3) -> List[Tuple[float, float]]:
       """
       Smooth path using gradient descent
       Args:
           path: Original path as list of (x, y) coordinates
           grid_map: Grid map for collision checking
           max_iterations: Number of smoothing iterations
           weight_data: Weight for original path fidelity
           weight_smooth: Weight for smoothness
       Returns:
           Smoothed path
       """
       # Your implementation here
       pass
   ```

## Design Problems

1. **Navigation System Design**: Design a complete navigation system for a humanoid robot that includes:
   - Global path planner (how it handles updates to the map)
   - Local planner for obstacle avoidance
   - Integration with footstep planning for bipedal motion
   - Recovery behaviors for when planning fails
   - Safety mechanisms to stop the robot when needed

2. **Multi-Modal Planning**: Design a navigation system that can switch between different locomotion modes (walking, crawling, climbing stairs) based on environmental conditions. Specify:
   - How the system detects appropriate locomotion modes
   - How paths are planned for different modes
   - How transitions between modes are handled
   - How the system validates mode feasibility

3. **Human-Aware Navigation**: Design a navigation system that respects social conventions when moving through spaces with humans. Consider:
   - How to model human social spaces
   - How to predict human movements
   - How to plan paths that are socially acceptable
   - How to handle interactions with humans

## Simulation Exercises

1. **Compare Path Planners**: Implement both A* and RRT on the same environment and compare their performance in terms of:
   - Computation time
   - Path quality (length, smoothness)
   - Success rate in different map types (open, cluttered, narrow passages)

2. **Dynamic Obstacle Navigation**: Create a simulation where a robot navigates towards a goal while avoiding moving obstacles using DWA. Analyze how different parameters affect navigation performance.

3. **Footstep Planning Validation**: Implement a 2D footstep planner for a bipedal robot and simulate its navigation through various terrains with different obstacle configurations.

## Analysis Problems

1. **Computational Complexity**: Analyze the computational complexity of A* and RRT algorithms in terms of the number of grid cells or configuration space dimensions. When would you prefer each algorithm?

2. **Path Optimality**: For a given environment with known optimal path length, compare the path quality produced by different algorithms (A*, RRT, RRT*) as computation time increases.

3. **Real-time Performance**: Analyze the real-time performance of different planning algorithms, considering both average case and worst-case computation times.

## Research and Investigation

1. **Literature Review**: Research recent advances in learning-based motion planning. Write a 500-word summary comparing traditional planning algorithms with learning-based approaches, including:
   - Technical differences
   - Advantages of each approach
   - Limitations and challenges
   - Applications where each approach is most suitable

2. **Case Study Analysis**: Analyze the navigation systems of three different humanoid robots (e.g., Boston Dynamics Atlas, Honda ASIMO, PAL Robotics TALOS). Create a comparative analysis focusing on:
   - Navigation algorithms used
   - Sensor configurations
   - Performance characteristics
   - Design trade-offs

## Practical Implementation Challenge

1. **Build a Complete Navigation System**: Using a simulation environment (like PyBullet, Gazebo, or a custom 2D simulator):
   - Implement a global path planner and local obstacle avoidance
   - Add trajectory smoothing and velocity profiling
   - Include basic collision detection
   - Test on various map configurations
   - Document the system architecture and performance metrics

## Advanced Problems

1. **Multi-Robot Navigation**: Design and implement a system for coordinating navigation of multiple humanoid robots in the same space, addressing:
   - How to avoid collisions between robots
   - How to plan paths that account for other robots' movements
   - How to handle communication limitations
   - How to handle dynamic priority changes

2. **Learning from Demonstration**: Design a system that learns navigation behaviors from human demonstrations. Consider how to:
   - Record human navigation demonstrations
   - Extract relevant features from demonstrations
   - Generalize learned behaviors to new situations
   - Combine learned behaviors with traditional planning

## Discussion Questions

1. **Safety vs. Efficiency**: How do safety considerations affect path planning decisions? What trade-offs exist between safe, conservative planning and efficient navigation?

2. **Uncertainty Handling**: How should navigation systems handle uncertainty in perception, map, and robot state? What planning approaches are most robust to uncertainty?

3. **Learning vs. Planning**: When might learning-based navigation approaches be preferable to traditional algorithmic planning? Discuss the scenarios where each approach excels.

## Solutions and Hints

### Problem 2 Solution Outline:
- Initialize open and closed sets
- Start with cost 0 at (0,0)
- For each node, compute cost to neighbors
- Use priority queue to select next node
- Stop when goal is reached
- Reconstruct path from parent pointers

### Problem 5 Solution Outline:
- Try removing each intermediate waypoint
- Check if the direct path between neighboring waypoints is collision-free
- Compute the total path length for each valid simplification
- Select the shortest valid path

### Programming Exercise 1 Hints:
- Use a priority queue to manage the open set
- Track g-costs (distance from start) for each cell
- Use parent pointers to reconstruct path
- Only add valid neighbors to the open set