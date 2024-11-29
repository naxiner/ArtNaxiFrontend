# ArtNaxi Frontend

Frontend application for ArtNaxi API, built with Angular.

## Features
- User registration and login
- User profile management
- Image generation interface
- Image liking system
- Responsive design with Bootstrap
- Toastr and sweetalerts2
- Integration with ArtNaxi API

## Requirements

- [Node.js](https://nodejs.org/en/download/package-manager) (version 18.x or later)
- [Angular CLI](https://www.npmjs.com/package/@angular/cli)
- [ArtNaxi API](https://github.com/naxiner/ArtNaxiApi) (Backend API)

## Installing

**1. Clone repository:**
```bash
git clone https://github.com/naxiner/ArtNaxiFrontend.git
cd ArtNaxiFrontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. Configure environment:**

Configure `src/environments/environment.ts` file with correct API URLs.

```bash
export const environment = {
    isProduction: false,
    baseUrl: 'https://localhost:7069',
    apiUrl: 'https://localhost:7069/api'
}
```

**4. Start**

Start with SSL certificate
```bash
ng serve --ssl --ssl-cert "certificates/ssl/localhost.crt" --ssl-key "certificates/ssl/localhost.key"
```

Application will be available at: 
- https://localhost:4200
