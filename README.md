<div align="center">
   <h1>Tasks API </h1>
  <img src="https://img.shields.io/badge/-NestJS-blueviolet" alt="NestJS">
  <img src="https://img.shields.io/badge/-MongoDB-green" alt="MongoDB">
  <img src="https://img.shields.io/badge/-RESTful_API-blue" alt="RESTful API">
  <img src="https://img.shields.io/badge/-CRUD_Operations-green" alt="CRUD Operations">
  <img src="https://img.shields.io/badge/-Swagger-red" alt="Swagger">
  <img src="https://img.shields.io/badge/-Unit_Testing-yellow" alt="Unit Testing">
  <img src="https://img.shields.io/badge/-E2E_Testing-purple" alt="E2E Testing">
</div>

## 1. Description 

This API provides CRUD (Create, Read, Update, Delete) operations for managing tasks. 

## 2. Installation 

Run the following command to install the dependencies: 
```bash
npm install
```

## 3. Configuration

1.  Copy the `.env.example` file as `.env` and configure the necessary environment variables.
2.  If you want to run tests, also copy the `.env.example` file as `.env.test` and configure the necessary environment variables for testing.

## 4. Execution

To run the API, use the following command:

```bash
npm install
 ```

## 5. Tests

Unit tests and e2e tests are included to ensure the proper functioning of the API.

-   To run unit tests, use the following command:

```bash
npm run test
```

-   To run e2e tests, use the following command:

```bash
npm run test:e2e
```

## 6. Technologies Used

-   Node.js: v19.8.1
-   MongoDB: v6.0.4

## 7. Model

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

## 8. Helper Schemas
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

## 9. Endpoints

| Endpoint        | Method | Description         | Responses                            |
|-----------------|--------|---------------------|--------------------------------------|
| `/tasks`        | GET    | Get all tasks       | 200 (OK), 404 (Not Found)            |
| `/tasks`        | POST   | Create a new task   | 201 (Created), 409 (Conflict)        |
| `/tasks/{id}`   | GET    | Get a task by ID    | 200 (OK), 404 (Not Found)            |
| `/tasks/{id}`   | DELETE | Delete a task by ID | 204 (No Content), 404 (Not Found)    |
| `/tasks/{id}`   | PUT    | Update a task by ID | 200 (OK), 404 (Not Found)            |

## 10. Request and Response
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
