<div align="center">
   <h1>Tasks API </h1>
  <img src="https://img.shields.io/badge/-NestJS-blueviolet" alt="NestJS">
  <img src="https://img.shields.io/badge/-MongoDB-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/-RESTful_API-blue" alt="RESTful API">
  <img src="https://img.shields.io/badge/-CRUD_Operations-green" alt="CRUD Operations">
  <img src="https://img.shields.io/badge/-Swagger-red" alt="Swagger">
  <img src="https://img.shields.io/badge/-Docker-blue" alt="Docker">
  <img src="https://img.shields.io/badge/-Unit_Testing-yellow" alt="Unit Testing">
  <img src="https://img.shields.io/badge/-E2E_Testing-purple" alt="E2E Testing">
</div>

## 1. Description 

This API provides CRUD (Create, Read, Update, Delete) operations for managing tasks. 

## 2. Technologies Used

-   Node.js: v19.8.1
-   MongoDB: v6.0.4

## 3. Installation 

Run the following command to install the dependencies: 
```bash
npm install
```

## 4. Configuration

1.  Copy the `.env.example` file as `.env` and configure the necessary environment variables.
2.  If you want to run tests, also copy the `.env.example` file as `.env.test` and configure the necessary environment variables for testing.

## 5. Execution

To run the API, use the following command:

```bash
npm run start
 ```

## 6. Tests

Unit tests and e2e tests are included to ensure the proper functioning of the API.

-   To run unit tests, use the following command:

```bash
npm run test
```

-   To run e2e tests, use the following command:

```bash
npm run test:e2e
```

## 7. Docker

This documentation provides instructions on how to use Docker to build and run the Tasks API application. It covers building the Docker image, running the image with Docker, and using Docker Compose for more complex setups.

### 7.1 Prerequisites

Docker should be installed on your system. If you don't have Docker installed, please follow the [Docker installation guide](https://docs.docker.com/engine/install/).

### 7.2 Building the Docker Image

To build the Docker image for the Tasks API application, run the following command:
```bash
docker build -t tasks-api .
```
### 7.3 Running the Docker Container
To run the Docker container with the Tasks API image, use the following command:

```bash
docker run -p 3000:3000 --network host tasks-api
```
Note: Using the --network host flag allows the container to consume the database from the host machine. If this is not available, consider using Docker Compose as described below.

### 7.4 Running with Docker Compose
If you prefer to use Docker Compose, follow these steps:

Grant necessary permissions to the data directory for persistent storage:

```bash
sudo chmod -R 777 /data/db
```
Uncomment line 6 and comment line 4 in the .env file:

```bash
4. MONGODB_CONNECTION_STRING=mongodb://localhost/tasksdb
5. # For docker compose
6. # MONGODB_CONNECTION_STRING=mongodb://mongodb/tasksdb
```
(Optional) If you encounter permission issues or need to customize the UID and GID, uncomment lines 7 and 8 in the .env file:

```bash
7. # UID=1000
8. # GID=1000
```
Ensure that port '27017:27017' is available on your system or modify the port in line 6 of the docker-compose.yml file.

To run the Tasks API with Docker Compose, execute the following command:

```bash
docker compose up
```

## 8. Model

The data model used in the API is as follows:

### Task Schema

| Property    | Type      | Required | Generated |
|-------------|-----------|----------|-----------|
| _id         | string    | Yes      | Yes       |
| title       | string    | Yes      | No        |
| description | string    | No       | No        |
| done        | boolean   | No       | No        |
| createdAt   | string    | No       | Yes       |
| updatedAt   | string    | No       | Yes       |
| __v         | number    | No       | Yes       |

## 9. Helper Schemas
### CreateTaskDto Schema
| Property    | Type    | Required |
|-------------|---------|----------|
| title       | string  | Yes      |
| description | string  | No       |
| done        | boolean | No       |

### UpdateTaskDto Schema
| Property    | Type    | Required |
|-------------|---------|----------|
| title       | string  | No       |
| description | string  | No       |
| done        | boolean | No       |

## 10. Endpoints

| Endpoint        | Method | Description         | Responses                            |
|-----------------|--------|---------------------|--------------------------------------|
| `/tasks`        | GET    | Get all tasks       | 200 (OK), 404 (Not Found)            |
| `/tasks`        | POST   | Create a new task   | 201 (Created), 409 (Conflict)        |
| `/tasks/{id}`   | GET    | Get a task by ID    | 200 (OK), 404 (Not Found)            |
| `/tasks/{id}`   | DELETE | Delete a task by ID | 204 (No Content), 404 (Not Found)    |
| `/tasks/{id}`   | PUT    | Update a task by ID | 200 (OK), 404 (Not Found)            |

## 11. Request and Response
### **Request Body:**
1. **POST /tasks**

	-   Description: Creates a new task.
	-   Content:
	    -   `application/json`:
	        -   Schema: [CreateTaskDto](#createtaskdto-schema)

		Example Request Body (POST /tasks):
		```json 
		{
			"title":  "Task Title",
			"description":  "Task Description",
			"done":  true
		}
		```
		
2. **PUT /tasks:**
	- Description: Updates an existing task.
	-   Content:
	    -   `application/json`:
	        -   Schema: [UpdateTaskDto](#updatetaskdto-schema)

		Example Request Body (PUT /tasks):
		```json 
		{
			"title":  "Task Title",
			"description":  "Task Description",
			"done":  true
		}
		```

### **Responses:**

1. **200 (OK)**  
	- Description: The request was successful. 
	- Content: 
		- `application/json`: 
			- Schema: [Task](#task-schema) 

		Example Response **(GET /tasks):** 
		```json 
		[
			{ 
				"_id": "60eef305d1e513001e477f20", 
				"title": "Task Title", 
				"description": "Task Description", 
				"done": false, 
				"createdAt": "2021-07-14T10:30:00Z", 
				"updatedAt": "2021-07-14T10:45:00Z", 
				"__v": "0"
			}
		]
		```

		Example Response **(GET /tasks/{id):** 
		```json 
		{ 
			"_id": "60eef305d1e513001e477f20", 
			"title": "Task Title", 
			"description": "Task Description", 
			"done": false, 
			"createdAt": "2021-07-14T10:30:00Z", 
			"updatedAt": "2021-07-14T10:45:00Z", 
			"__v": "0"
		}
		```
	
3.  **201 (Created)**
    
    -   Description: The task was created successfully.
    -   Content:
        -   `application/json`:
            -   Schema: [Task](#task-schema)

		   Example Response **(POST /tasks):**
	    
	    ```json
	    {
			"_id": "60eef305d1e513001e477f20"
			"title": "Task Title",
			"description": "Task Description",
			"done": true,
			"createdAt": "2021-07-14T10:30:00Z",
			"updatedAt": "2021-07-14T10:45:00Z",
			"__v": "0"
	    }
	    ```
4.  **204 (No Content)**
    
    -   Description: The task was deleted successfully.
5.  **404 (Not Found)**
    
    -   Description: The requested task was not found.
6.  **409 (Conflict)**
    
    -   Description: The task already exists
