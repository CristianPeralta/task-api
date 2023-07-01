
## Tasks API  
### Description 

This API provides CRUD (Create, Read, Update, Delete) operations for managing tasks. 

### Installation 

Run the following command to install the dependencies: ```bash npm install

### Configuration

1.  Copy the `.env.example` file as `.env` and configure the necessary environment variables.
2.  If you want to run tests, also copy the `.env.example` file as `.env.test` and configure the necessary environment variables for testing.

### Execution

To run the API, use the following command:

```bash
	npm install
 ```

### Tests

Unit tests and e2e tests are included to ensure the proper functioning of the API.

-   To run unit tests, use the following command:

```bash
	npm run test
```

-   To run e2e tests, use the following command:

```bash
	npm run test:e2e
```

### Technologies Used

-   Node.js: v19.8.1
-   MongoDB: v6.0.4

### Model

The data model used in the API is as follows:

**Task Schema:**

| Property      | Type         |
|--|--|
| _id  | *string*       |
| title        | *string*      | 
| description  | *string*      |
| done         | *boolean*     | 
| createdAt    | *string*      |
| updatedAt    | *string*      |
| __v          | *number*      |

### Helper Schemas
**CreateTaskDto Schema**
| Property | Type |
 | ------------ | ------- | 
 | title | *string* |
 | description | *string* | 
 | done | *boolean* |

**UpdateTaskDto Schema**
| Property | Type | 
| ------------ | ------- | 
| title | *string* | 
| description | *string* |
| done | *boolean* |

### Endpoints

| Endpoint | Method | Description | Responses | 
| ------------- | ------ | -------------------- | ----------------------------------------- | 
| `/tasks` | GET | Get all tasks | 200 (OK), 404 (Not Found) | 
| `/tasks` | POST | Create a new task | 201 (Created), 409 (Conflict) | 
| `/tasks/{id}` | GET | Get a task by ID | 200 (OK), 404 (Not Found) | 
| `/tasks/{id}` | DELETE | Delete a task by ID | 204 (No Content), 404 (Not Found) | 
| `/tasks/{id}` | PUT | Update a task by ID | 200 (OK), 404 (Not Found) |

**Request Body:**
1. **POST /tasks**

	-   Description: Creates a new task.
	-   Content:
	    -   `application/json`:
	        -   Schema: [CreateTaskDto](#Model)

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
	        -   Schema: [UpdateTaskDto](https://chat.openai.com/c/9a6b94d5-3d2f-4e9a-a0d3-ee9bc2959a90#updateTaskDto-schema)

		Example Request Body (PUT /tasks):
		```json 
		{
			"title":  "Task Title",
			"description":  "Task Description",
			"done":  true
		}
		```

**Possible Responses:**

1. **200 (OK)**  
	- Description: The request was successful. 
	- Content: 
		- `application/json`: 
			- Schema: [Task Schema](#task-schema) 

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
            -   Schema: [Task Schema](https://chat.openai.com/c/9a6b94d5-3d2f-4e9a-a0d3-ee9bc2959a90#task-schema)

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
## Autor 
-   Name: Cristian Peralta
-   GitHub: [CristianPeralta](https://github.com/CristianPeralta)
