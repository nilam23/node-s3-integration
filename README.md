## Project Overview

Integration of AWS S3 with NodeJS and ExpressJS for media storage, retrieval and deletion via REST APIs.

## Routes of the application

```
Method: POST
Endpoint: /media
Form-Data: file: <file_name>
Example Form-Data: file: some_image.jpg
Description: this route takes an image as a file type input and uploads it to the specified AWS S3 bucket.
```

```
Method: GET
Endpoint: /media?file=<file_name>
Example Endpoint: /media?file=some_image.jpg
Description: this route takes an image as a query parameter and fetches the same from the specified AWS S3 bucket.
```

```
Method: GET
Endpoint: /media/list
Description: this route fetches all media present in the specified AWS S3 bucket.
```

```
Method: DELETE
Endpoint: /media?file=<file_name>
Example Endpoint: /media?file=some_image.jpg
Description: this route deletes takes an image as a query parameter and deletes the same from the specified AWS S3 bucket.
```

## Environment variables

### 1. Environment variables related to AWS

`AWS_REGION`: Defines the region to access AWS services.

`AWS_S3_BUCKET_NAME`: Defines the name of the AWS S3 bucket to work on.

### 2. Other environment variables
`PORT`: Defines the application port no for the DEV environment.

## Steps to run the application

1. Make sure that you have `node` and `nodemon` installed.
2. If you are using VS Code, make sure that you have the `ESLint` extension enabled to avoid the possible linting errors.
3. Clone the repository.
4. Move into the project directory using `cd <path_to_project_directory>`
5. Install the required packages using `npm install`
6. Create an AWS S3 bucket with necessary permissions and configurations.
7. Create a `.env` file at the root of the directory and set the environment variables as described above.
8. Make sure that the `aws cli` is properly configured with `AWS ACCESS KEY` and `AWS SECRET KEY` of a valid AWS IAM user along with the `AWS REGION`as specified in the `.env`.
9. Now run the application using `npm run start`