export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:44307/api',
  endpoints: {
    excel: {
      integrationPart1: '/Excel/importer',
      integrationPart2:'api/Excel/confirmer-integration',
      exportationErreurs: '/Excel/exporter-erreurs-excel', 

    },
    users: {
      getAll: '/api/Users',
      getById: '/api/Users/{userId}',
      create: '/api/Users',
      update: '/api/Users/{userId}'
    },
    auth: {
      login: '/api/Auth/login',
      register: '/api/Auth/register'
    }  
  }
};
