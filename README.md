Counties & Unitary Authorities in England API

          Introduction
This API provides detailed information about 48 Counties and 30 Unitary Authorities in England. It offers access to essential administrative region data.

          Authentication
JSON Web Token (JWT): Employed for signup, login, and login credentials reset.

Schema Enforcement:

    Signup: The code strictly enforces a defined schema model during user registration, ensuring accurate and complete user information.
    Login: Schema model enforcement guarantees data integrity during login.
    Login Credentials Reset: Similar schema model enforcement during login credentials reset ensures secure and accurate updates.
    Email Validation: Implemented for login credentials reset, ensuring the validity of email addresses.
Resetting Login Credentials

Process:

Users initiate a login credentials reset request.

Email validation confirms the registered email's validity.

Upon validation, a reset link containing a JWT token is generated and sent to the registered email.

         Endpoints
GET /main/place

Description: Retrieves information about all Counties and Unitary Authorities.

Endpoint: /main/place

HTTP Method: GET

Request:

Headers: apiKey: YOUR_API_KEY
URL: https://counties-unitauthorities-england-api.netlify.app/main/place?api_key=YOUR_API_KEY&use_header=false

GET /main/place/:Name

Description: Retrieves information about a specific County or Unitary Authority by 'Name'.

Endpoint: /main/place/:Name

HTTP Method: GET

Request:

Headers: apiKey: YOUR_API_KEY

URL: https://counties-unitauthorities-england-api.netlify.app/main/place/Name?api_key=YOUR_API_KEY&use_header=false

     Error Handling
GET /main/place:

Possible Errors: Server error (500) if issues fetching data.

GET /main/place/:Name:

Possible Errors: "Not found" error (404) for non-existent Counties or Unitary Authorities, and server errors (500) for database issues.

         Usage
Accessing Endpoints

Include the API key as a query parameter in your URL or use the apiKey in the headers.
Example URL: https://counties-unitauthorities-england-api.netlify.app/main/place?api_key=YOUR_API_KEY&use_header=false

Response Format

All responses are in JSON format.

        Conclusion
This API aims to provide developers with efficient access to essential administrative region data in England. For technical support or further inquiries, feel free to contact us on;
enetanyaokechukwu@gmail.com
