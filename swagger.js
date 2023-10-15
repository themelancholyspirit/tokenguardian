const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    info: {
      title: 'Token Guardian',
      version: '1.0.0',
      description: 
      `A straightforward API for user registration and login using tokens. Secure and easy to use, this API ensures data privacy. Explore the endpoints to manage user accounts and generate tokens.
      
      Note: This API is for educational purposes and may require additional security measures for production use.`,
    },
  },
  apis: ['./routes/*.js'], // Make sure this path points to your route files
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;


