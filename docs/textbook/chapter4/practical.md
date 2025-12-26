# Chapter 4: Practical Applications of Motion Planning and Navigation

## Implementing Grid-Based Path Planning

In this section, we'll implement practical algorithms for path planning, starting with grid-based methods.

### A* Path Planning Implementation

```python
import numpy as np
import heapq
from typing import List, Tuple

class AStarPlanner:
    def __init__(self, grid_map: np.ndarray):
        self.grid = grid_map  # 0 = free, 1 = obstacle
        self.height, self.width = grid_map.shape
        self.directions = [(-1, 0), (1, 0), (0, -1), (0, 1),  # 4-connected
                          (-1, -1), (-1, 1), (1, -1), (1, 1)]  # Diagonals
        self.costs = [1.0, 1.0, 1.0, 1.0, 1.414, 1.414, 1.414, 1.414]  # Movement costs
    
    def heuristic(self, pos: Tuple[int, int], goal: Tuple[int, int]) -> float:
        """Calculate heuristic distance (Euclidean distance)"""
        return np.sqrt((pos[0] - goal[0])**2 + (pos[1] - goal[1])**2)
    
    def is_valid(self, pos: Tuple[int, int]) -> bool:
        """Check if position is valid (within bounds and not an obstacle)"""
        x, y = pos
        return (0 <= x < self.height and 
                0 <= y < self.width and 
                self.grid[x, y] == 0)
    
    def plan_path(self, start: Tuple[int, int], goal: Tuple[int, int]) -> List[Tuple[int, int]]:
        """Find optimal path from start to goal using A* algorithm"""
        # Priority queue: (f_score, g_score, position)
        open_set = [(0, 0, start)]
        heapq.heapify(open_set)
        
        # Track costs and parents
        g_score = {start: 0}
        came_from = {}
        
        # Closed set of visited nodes
        closed_set = set()
        
        while open_set:
            # Get node with lowest f_score
            f_score, current_g, current = heapq.heappop(open_set)
            
            if current == goal:
                # Reconstruct path
                path = []
                while current in came_from:
                    path.append(current)
                    current = came_from[current]
                path.append(start)
                return path[::-1]
            
            if current in closed_set:
                continue
            
            closed_set.add(current)
            
            # Check all neighbors
            for i, direction in enumerate(self.directions):
                neighbor = (current[0] + direction[0], current[1] + direction[1])
                
                if not self.is_valid(neighbor) or neighbor in closed_set:
                    continue
                
                # Calculate tentative g_score
                tentative_g = current_g + self.costs[i]
                
                if neighbor not in g_score or tentative_g < g_score[neighbor]:
                    # This path to neighbor is better
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g
                    f_score = tentative_g + self.heuristic(neighbor, goal)
                    
                    heapq.heappush(open_set, (f_score, tentative_g, neighbor))
        
        return []  # No path found

# Example usage
grid = np.zeros((10, 10))
grid[3, 3:7] = 1  # Add an obstacle
planner = AStarPlanner(grid)
path = planner.plan_path((1, 1), (8, 8))
print(f"Found path with {len(path)} steps")
```

## Implementing Sampling-Based Planners

### RRT (Rapidly-Exploring Random Tree) Implementation

```python
import numpy as np
from typing import List, Tuple
import random

class RRTNode:
    def __init__(self, point: np.ndarray):
        self.point = point  # Configuration vector
        self.parent = None
        self.children = []

class RRTPlanner:
    def __init__(self, start: np.ndarray, goal: np.ndarray, bounds: List[Tuple[float, float]], 
                 max_iterations: int = 10000, step_size: float = 0.1):
        self.start = np.array(start)
        self.goal = np.array(goal)
        self.bounds = bounds  # [(min1, max1), (min2, max2), ...]
        self.max_iterations = max_iterations
        self.step_size = step_size
        
        # Initialize tree with start node
        self.root = RRTNode(self.start)
        self.nodes = [self.root]
        
        # Collision checking (simplified - would use actual collision detection in practice)
        self.obstacles = []  # List of obstacles to check against
    
    def add_obstacle(self, center: np.ndarray, radius: float):
        """Add a circular/spherical obstacle"""
        self.obstacles.append((center, radius))
    
    def is_in_collision(self, point: np.ndarray) -> bool:
        """Check if a point is in collision with any obstacle"""
        for center, radius in self.obstacles:
            if np.linalg.norm(point - center) < radius:
                return True
        return False
    
    def is_valid_point(self, point: np.ndarray) -> bool:
        """Check if point is within bounds and not in collision"""
        for i, (min_val, max_val) in enumerate(self.bounds):
            if not (min_val <= point[i] <= max_val):
                return False
        return not self.is_in_collision(point)
    
    def random_config(self) -> np.ndarray:
        """Generate a random configuration within bounds"""
        config = np.zeros(len(self.bounds))
        for i, (min_val, max_val) in enumerate(self.bounds):
            config[i] = random.uniform(min_val, max_val)
        return config
    
    def nearest_node(self, point: np.ndarray) -> RRTNode:
        """Find the nearest node in the tree to the given point"""
        nearest = self.root
        min_dist = np.linalg.norm(nearest.point - point)
        
        for node in self.nodes:
            dist = np.linalg.norm(node.point - point)
            if dist < min_dist:
                min_dist = dist
                nearest = node
        
        return nearest
    
    def extend_towards(self, from_node: RRTNode, target_point: np.ndarray) -> RRTNode:
        """Extend the tree from a node towards a target point"""
        direction = target_point - from_node.point
        distance = np.linalg.norm(direction)
        
        if distance < self.step_size:
            new_point = target_point.copy()
        else:
            direction = direction / distance  # Normalize
            new_point = from_node.point + self.step_size * direction
        
        if self.is_valid_point(new_point):
            new_node = RRTNode(new_point)
            new_node.parent = from_node
            from_node.children.append(new_node)
            self.nodes.append(new_node)
            return new_node
        
        return None
    
    def plan(self) -> List[np.ndarray]:
        """Plan a path from start to goal using RRT"""
        # Try to connect to goal occasionally
        goal_bias = 0.05  # 5% chance to sample goal
        
        for _ in range(self.max_iterations):
            # Randomly sample a point
            if random.random() < goal_bias:
                random_point = self.goal
            else:
                random_point = self.random_config()
            
            # Find nearest node and extend towards random point
            nearest = self.nearest_node(random_point)
            new_node = self.extend_towards(nearest, random_point)
            
            if new_node is not None:
                # Try to connect to goal
                goal_node = self.extend_towards(new_node, self.goal)
                if goal_node is not None:
                    # Check if we reached the goal
                    if np.linalg.norm(goal_node.point - self.goal) < self.step_size:
                        return self.extract_path(goal_node)
        
        return []  # Failed to find path
    
    def extract_path(self, goal_node: RRTNode) -> List[np.ndarray]:
        """Extract path from goal node back to start"""
        path = []
        current = goal_node
        while current:
            path.append(current.point)
            current = current.parent
        return path[::-1]

# Example usage
start = [0.0, 0.0]
goal = [5.0, 5.0]
bounds = [(-1, 6), (-1, 6)]  # x and y bounds

rrt = RRTPlanner(start, goal, bounds, max_iterations=5000, step_size=0.2)
rrt.add_obstacle(np.array([2.5, 2.5]), 0.8)  # Add obstacle
path = rrt.plan()
print(f"RRT found path with {len(path)} points" if path else "RRT failed to find path")
```

## Navigation in Dynamic Environments

### Dynamic Window Approach (DWA) Implementation

```python
import numpy as np
from dataclasses import dataclass
from typing import List, Tuple

@dataclass
class RobotState:
    x: float
    y: float
    theta: float  # Heading angle
    velocity: float  # Linear velocity
    angular_velocity: float  # Angular velocity

class DWAPlanner:
    def __init__(self, max_speed=1.0, min_speed=0.05,
                 max_yaw_rate=40.0 * np.pi / 180.0,  # Convert to radians
                 max_accel=0.5, max_delta_yaw_rate=40.0 * np.pi / 180.0,
                 v_resolution=0.01, yaw_rate_resolution=0.1 * np.pi / 180.0,
                 predict_time=3.0, to_goal_cost_gain=0.15, speed_cost_gain=1.0,
                 obstacle_cost_gain=1.0, robot_radius=1.0):
        
        self.max_speed = max_speed
        self.min_speed = min_speed
        self.max_yaw_rate = max_yaw_rate
        self.max_accel = max_accel
        self.max_delta_yaw_rate = max_delta_yaw_rate
        self.v_resolution = v_resolution
        self.yaw_rate_resolution = yaw_rate_resolution
        self.predict_time = predict_time
        self.to_goal_cost_gain = to_goal_cost_gain
        self.speed_cost_gain = speed_cost_gain
        self.obstacle_cost_gain = obstacle_cost_gain
        self.robot_radius = robot_radius

    def plan(self, state: RobotState, goal: Tuple[float, float], obstacles: List[Tuple[float, float]]) -> Tuple[float, float]:
        """Plan next velocities using Dynamic Window Approach"""
        # Generate dynamic window
        window = self.calc_dynamic_window(state)
        
        # Evaluate trajectories
        best_trajectory = None
        min_cost = float('inf')
        
        # Sample velocities in the dynamic window
        for v in np.arange(window[0], window[1], self.v_resolution):
            for yaw_rate in np.arange(window[2], window[3], self.yaw_rate_resolution):
                # Simulate trajectory
                trajectory = self.predict_trajectory(state, v, yaw_rate)
                
                # Calculate costs
                to_goal_cost = self.calc_to_goal_cost(trajectory, goal)
                speed_cost = self.calc_speed_cost(trajectory)
                obstacle_cost = self.calc_obstacle_cost(trajectory, obstacles)
                
                # Calculate total cost
                final_cost = (self.to_goal_cost_gain * to_goal_cost +
                             self.speed_cost_gain * speed_cost +
                             self.obstacle_cost_gain * obstacle_cost)
                
                if final_cost < min_cost:
                    min_cost = final_cost
                    best_trajectory = trajectory
        
        if best_trajectory is not None:
            return best_trajectory[0][3], best_trajectory[0][4]  # Return v, yaw_rate
        else:
            return 0.0, 0.0  # Stop if no valid trajectory found

    def calc_dynamic_window(self, state: RobotState) -> List[float]:
        """Calculate dynamic window based on current state and constraints"""
        # [v_min, v_max, yaw_rate_min, yaw_rate_max]
        window = [
            max(self.min_speed, state.velocity - self.max_accel * 0.1),
            min(self.max_speed, state.velocity + self.max_accel * 0.1),
            max(-self.max_yaw_rate, state.angular_velocity - self.max_delta_yaw_rate * 0.1),
            min(self.max_yaw_rate, state.angular_velocity + self.max_delta_yaw_rate * 0.1)
        ]
        return window

    def predict_trajectory(self, state: RobotState, v: float, yaw_rate: float) -> List[List[float]]:
        """Predict trajectory with constant velocity and yaw rate"""
        trajectory = []
        time = 0
        current_state = RobotState(state.x, state.y, state.theta, v, yaw_rate)
        
        while time <= self.predict_time:
            trajectory.append([current_state.x, current_state.y, current_state.theta, 
                              current_state.velocity, current_state.angular_velocity])
            
            current_state.x += current_state.velocity * np.cos(current_state.theta) * 0.1
            current_state.y += current_state.velocity * np.sin(current_state.theta) * 0.1
            current_state.theta += current_state.angular_velocity * 0.1
            current_state.velocity = v
            current_state.angular_velocity = yaw_rate
            
            time += 0.1
        
        return trajectory

    def calc_to_goal_cost(self, trajectory: List[List[float]], goal: Tuple[float, float]) -> float:
        """Calculate cost for distance to goal"""
        if not trajectory:
            return float('inf')
        
        dx = goal[0] - trajectory[-1][0]
        dy = goal[1] - trajectory[-1][1]
        error_angle = np.arctan2(dy, dx)
        cost_angle = error_angle - trajectory[-1][2]
        cost = abs(np.arctan2(np.sin(cost_angle), np.cos(cost_angle)))
        
        return cost

    def calc_speed_cost(self, trajectory: List[List[float]]) -> float:
        """Calculate cost for speed (prefer higher speeds)"""
        if not trajectory:
            return float('inf')
        
        speed_cost = self.max_speed - trajectory[0][3]
        return speed_cost

    def calc_obstacle_cost(self, trajectory: List[List[float]], obstacles: List[Tuple[float, float]]) -> float:
        """Calculate cost for obstacle proximity"""
        if not trajectory:
            return float('inf')
        
        min_dist = float('inf')
        for i in range(len(trajectory)):
            for (ox, oy) in obstacles:
                dist = np.sqrt((trajectory[i][0] - ox)**2 + (trajectory[i][1] - oy)**2)
                if dist <= self.robot_radius:
                    return float('inf')  # Collision
                if dist < min_dist:
                    min_dist = dist
        
        return 1.0 / min_dist if min_dist != float('inf') else float('inf')

# Example usage
dwa = DWAPlanner()
state = RobotState(0, 0, 0, 0, 0)
goal = (5.0, 5.0)
obstacles = [(2, 2), (3, 3), (4, 4)]
v, yaw_rate = dwa.plan(state, goal, obstacles)
print(f"DWA suggests velocity: {v:.3f}, angular velocity: {yaw_rate:.3f}")
```

## Implementing Path Optimization

### Path Smoothing with B-Splines

```python
import numpy as np
from scipy.interpolate import BSpline
import matplotlib.pyplot as plt

def bspline_smooth_path(path_points: List[Tuple[float, float]], smoothing_factor: float = 0.1):
    """Smooth a path using B-splines"""
    if len(path_points) < 3:
        return path_points
    
    # Extract x and y coordinates
    x_coords = [p[0] for p in path_points]
    y_coords = [p[1] for p in path_points]
    n_points = len(path_points)
    
    # Create parameter vector
    t = np.linspace(0, 1, n_points)
    
    # Add some padding to the path for better smoothing
    # This avoids sharp turns at endpoints
    if len(x_coords) >= 4:
        # Use cubic splines (degree 3)
        degree = 3
        n_knots = max(len(x_coords) - degree, 1)
        t_knots = np.linspace(0, 1, n_knots)
        
        # Extend the knot vector to have appropriate multiplicity at the ends
        t_knots = np.concatenate(([0]*degree, t_knots, [1]*degree))
        
        # Calculate spline coefficients using least squares
        x_coeff = np.linalg.lstsq(BSpline.design_matrix(t, t_knots, degree).toarray(), x_coords, rcond=None)[0]
        y_coeff = np.linalg.lstsq(BSpline.design_matrix(t, t_knots, degree).toarray(), y_coords, rcond=None)[0]
        
        # Create new parameter vector with more points for smooth output
        t_smooth = np.linspace(0, 1, 3 * n_points)
        
        # Evaluate the splines
        bs_x = BSpline(t_knots, x_coeff, degree)
        bs_y = BSpline(t_knots, y_coeff, degree)
        
        smooth_x = bs_x(t_smooth)
        smooth_y = bs_y(t_smooth)
        
        return [(smooth_x[i], smooth_y[i]) for i in range(len(smooth_x))]
    else:
        # For short paths, just return original
        return path_points

def path_optimizer(original_path: List[Tuple[float, float]], grid_map: np.ndarray):
    """Optimize path for smoothness and obstacle avoidance"""
    # First smooth the path
    smoothed_path = bspline_smooth_path(original_path)
    
    # Then check for collisions and adjust if necessary
    optimized_path = []
    for point in smoothed_path:
        x, y = point
        grid_x, grid_y = int(x), int(y)
        
        # Check if this point is valid
        if (0 <= grid_x < grid_map.shape[0] and 
            0 <= grid_y < grid_map.shape[1] and 
            grid_map[grid_x, grid_y] == 0):
            optimized_path.append(point)
        else:
            # If in collision, try to find a nearby valid point
            # This is a simple approach - more sophisticated methods exist
            found_valid = False
            for dx in range(-2, 3):
                for dy in range(-2, 3):
                    new_x, new_y = grid_x + dx, grid_y + dy
                    if (0 <= new_x < grid_map.shape[0] and 
                        0 <= new_y < grid_map.shape[1] and 
                        grid_map[new_x, new_y] == 0):
                        optimized_path.append((new_x, new_y))
                        found_valid = True
                        break
                if found_valid:
                    break
            
            if not found_valid:
                # If no valid point found nearby, add original point (will have collision issue)
                optimized_path.append(point)
    
    return optimized_path
```

## Implementing Footstep Planning for Bipedal Navigation

```python
import numpy as np
from typing import List, Tuple

class FootstepPlanner:
    def __init__(self, step_length=0.3, step_width=0.2, max_step_angular=0.3):
        self.step_length = step_length  # Forward step distance
        self.step_width = step_width    # Lateral step distance
        self.max_step_angular = max_step_angular  # Max angular change per step (radians)
        self.min_step_angular = -max_step_angular
    
    def plan_footsteps(self, 
                      start_pos: Tuple[float, float, float],  # (x, y, theta)
                      goal_pos: Tuple[float, float, float],   # (x, y, theta)
                      grid_map: np.ndarray) -> List[Tuple[float, float, float]]:
        """
        Plan a sequence of footsteps from start to goal for a bipedal robot
        Returns list of (x, y, theta) for each footstep
        """
        footsteps = []
        current_pos = np.array(start_pos, dtype=float)
        goal = np.array(goal_pos)
        
        # Simple RRT-like approach for footstep planning
        max_iterations = 1000
        goal_reached_threshold = 0.2
        
        for i in range(max_iterations):
            # Check if we're close enough to goal
            pos_diff = goal[:2] - current_pos[:2]
            dist_to_goal = np.linalg.norm(pos_diff)
            
            if dist_to_goal < goal_reached_threshold and abs(goal[2] - current_pos[2]) < self.max_step_angular:
                # Add final position to footsteps
                footsteps.append(tuple(current_pos))
                break
            
            # Determine next step direction
            if dist_to_goal > self.step_length:
                # Move toward goal
                direction = pos_diff / dist_to_goal
                step_vector = self.step_length * direction
            else:
                # Move directly to goal
                step_vector = pos_diff
            
            # Generate potential step
            next_pos = current_pos.copy()
            next_pos[0] += step_vector[0]
            next_pos[1] += step_vector[1]
            
            # Adjust orientation
            target_orientation = np.arctan2(step_vector[1], step_vector[0])
            orientation_diff = target_orientation - current_pos[2]
            
            # Limit orientation change per step
            if orientation_diff > self.max_step_angular:
                next_pos[2] = current_pos[2] + self.max_step_angular
            elif orientation_diff < self.min_step_angular:
                next_pos[2] = current_pos[2] + self.min_step_angular
            else:
                next_pos[2] = target_orientation
            
            # Check if the new position is valid
            grid_x, grid_y = int(next_pos[0]), int(next_pos[1])
            if self.is_valid_footstep((grid_x, grid_y), grid_map):
                footsteps.append(tuple(next_pos))
                current_pos = next_pos
            else:
                # If the step is invalid, try to find an alternative
                # This is a simplified approach - more sophisticated methods would do proper replanning
                print(f"Invalid step at {(grid_x, grid_y)}, stopping planning.")
                break
        
        return footsteps
    
    def is_valid_footstep(self, pos: Tuple[int, int], grid_map: np.ndarray) -> bool:
        """Check if a footstep position is valid (not in collision)"""
        x, y = pos
        if x < 0 or x >= grid_map.shape[0] or y < 0 or y >= grid_map.shape[1]:
            return False
        
        # Check if the grid cell is free
        if grid_map[x, y] != 0:
            return False
        
        # Additional checks could go here (terrain stability, etc.)
        return True

# Example usage
footstep_planner = FootstepPlanner()
grid = np.zeros((20, 20))
grid[10, 5:15] = 1  # Add an obstacle
start = (1, 10, 0)  # Start position and orientation
goal = (18, 10, 0)  # Goal position and orientation
footsteps = footstep_planner.plan_footsteps(start, goal, grid)
print(f"Planned {len(footsteps)} footsteps")
```

## Integration: Complete Navigation System

### Navigation Stack Implementation

```python
import numpy as np
import time
from typing import List, Tuple, Optional
import threading

class NavigationSystem:
    def __init__(self, grid_map: np.ndarray):
        self.grid_map = grid_map
        self.global_planner = AStarPlanner(grid_map)
        self.local_planner = DWAPlanner()
        self.footstep_planner = FootstepPlanner()
        
        # Robot state
        self.current_position = (0, 0)
        self.current_orientation = 0.0
        self.current_velocity = 0.0
        
        # Navigation state
        self.goal_position: Optional[Tuple[float, float]] = None
        self.global_path: List[Tuple[float, float]] = []
        self.current_waypoint_idx = 0
        self.is_navigating = False
        
        # Control parameters
        self.waypoint_threshold = 0.5
        self.navigation_frequency = 10  # Hz
        self.control_thread = None
        
    def set_goal(self, goal: Tuple[float, float]):
        """Set navigation goal"""
        self.goal_position = goal
        
        # Plan global path
        start = self.current_position
        self.global_path = self.global_planner.plan_path(start, goal)
        self.current_waypoint_idx = 0
        
        print(f"Global path planned with {len(self.global_path)} waypoints")
        
    def update_robot_position(self, new_pos: Tuple[float, float], orientation: float = 0.0):
        """Update robot's current position and orientation"""
        self.current_position = new_pos
        self.current_orientation = orientation
    
    def distance_to_waypoint(self, waypoint: Tuple[float, float]) -> float:
        """Calculate distance to a waypoint"""
        dx = waypoint[0] - self.current_position[0]
        dy = waypoint[1] - self.current_position[1]
        return np.sqrt(dx**2 + dy**2)
    
    def navigate_to_goal(self):
        """Main navigation loop"""
        if self.goal_position is None or not self.global_path:
            print("No goal set or path planned!")
            return
        
        self.is_navigating = True
        dt = 1.0 / self.navigation_frequency
        
        while self.current_waypoint_idx < len(self.global_path) and self.is_navigating:
            current_waypoint = self.global_path[self.current_waypoint_idx]
            
            # Check if we've reached the current waypoint
            if self.distance_to_waypoint(current_waypoint) < self.waypoint_threshold:
                self.current_waypoint_idx += 1
                if self.current_waypoint_idx < len(self.global_path):
                    print(f"Reached waypoint {self.current_waypoint_idx}, moving to next...")
                else:
                    print("Reached final goal!")
                    break
            
            # Perform local planning and obstacle avoidance
            # In a real system, this would use current sensor data
            obstacles = self.get_obstacles()  # Would come from sensors
            robot_state = RobotState(
                self.current_position[0], 
                self.current_position[1], 
                self.current_orientation,
                self.current_velocity, 
                0.0
            )
            
            # Use DWA for local navigation
            v_cmd, yaw_rate_cmd = self.local_planner.plan(
                robot_state, 
                current_waypoint, 
                obstacles
            )
            
            # In a real system, send commands to robot actuators here
            self.execute_control_commands(v_cmd, yaw_rate_cmd)
            
            # Update position based on commands (simulation)
            self.simulate_motion_update(v_cmd, yaw_rate_cmd, dt)
            
            time.sleep(dt)
        
        self.is_navigating = False
    
    def get_obstacles(self) -> List[Tuple[float, float]]:
        """Get obstacle positions from sensors (simulated)"""
        # In a real system, this would come from range sensors, cameras, etc.
        # For simulation, return some fixed obstacles
        return [(5, 5), (6, 6), (7, 7)]
    
    def execute_control_commands(self, v_cmd: float, yaw_rate_cmd: float):
        """Execute velocity and angular velocity commands"""
        # This would interface with the robot's motor control system
        # For simulation purposes, print the commands
        print(f"Commanding: v={v_cmd:.3f}, yaw_rate={yaw_rate_cmd:.3f}")
    
    def simulate_motion_update(self, v_cmd: float, yaw_rate_cmd: float, dt: float):
        """Simulate robot motion based on commands"""
        # Update position based on velocity commands
        new_x = self.current_position[0] + v_cmd * np.cos(self.current_orientation) * dt
        new_y = self.current_position[1] + v_cmd * np.sin(self.current_orientation) * dt
        new_theta = self.current_orientation + yaw_rate_cmd * dt
        
        self.current_position = (new_x, new_y)
        self.current_orientation = new_theta
        self.current_velocity = v_cmd
    
    def start_navigation(self):
        """Start navigation in a separate thread"""
        if self.control_thread is None or not self.control_thread.is_alive():
            self.control_thread = threading.Thread(target=self.navigate_to_goal)
            self.control_thread.start()
    
    def stop_navigation(self):
        """Stop the navigation process"""
        self.is_navigating = False
        if self.control_thread:
            self.control_thread.join()

# Example usage
grid = np.zeros((20, 20))
grid[10, 5:15] = 1  # Add an obstacle
nav_system = NavigationSystem(grid)

# Set start and goal
nav_system.update_robot_position((1, 1))
nav_system.set_goal((18, 18))

# Start navigation
nav_system.start_navigation()

# Let it run for a bit, then stop
time.sleep(10)
nav_system.stop_navigation()
```

## Real-time Navigation Considerations

### Performance Optimization Techniques

```python
import time
import numpy as np
from collections import deque

class RealtimeNavigationSystem:
    def __init__(self):
        self.update_times = deque(maxlen=100)  # Keep last 100 update times
        self.target_frequency = 10  # Hz
        self.dt = 1.0 / self.target_frequency
        
        # Caching for expensive computations
        self.path_cache = {}
        self.kd_tree = None  # For nearest neighbor searches
        
        # Multi-resolution maps for different planning needs
        self.maps = {
            'global': None,  # Low resolution for global planning
            'local': None,   # High resolution for local navigation
        }
    
    def plan_with_timeout(self, planner_func, timeout=0.1):
        """Plan path with a timeout to ensure real-time performance"""
        start_time = time.time()
        
        try:
            result = planner_func()
        except:
            result = []
        
        elapsed = time.time() - start_time
        self.update_times.append(elapsed)
        
        if elapsed > timeout:
            print(f"Planning took {elapsed:.3f}s, which exceeds timeout of {timeout}s")
        
        return result
    
    def get_average_update_time(self):
        """Get average update time for performance monitoring"""
        if self.update_times:
            return sum(self.update_times) / len(self.update_times)
        return 0.0
    
    def is_realtime_capable(self):
        """Check if system is meeting real-time requirements"""
        avg_time = self.get_average_update_time()
        return avg_time < (0.8 * self.dt)  # 80% of cycle time
```

## Conclusion

This chapter provided practical implementations of motion planning and navigation algorithms for humanoid robots. We covered grid-based planning (A*), sampling-based methods (RRT), dynamic environment navigation (DWA), and complete navigation systems.

The implementations in this chapter demonstrate how theoretical concepts translate into working code that can be deployed on humanoid robots. The examples include path optimization, footstep planning, and integration into complete navigation systems. These implementations can be adapted and extended for specific robot platforms and applications.

The algorithms discussed here form the foundation for creating autonomous humanoid robots that can navigate complex environments safely and efficiently. In practice, these systems need to be tuned for specific hardware, integrated with perception systems, and validated through extensive testing.