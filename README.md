# Sistema de Gestión Ganadera con Microservicios
[![Tests](https://img.shields.io/badge/tests-32/32-green.svg)](https://github.com/JuanLacouture/Trabajo-Patrones  )


Instrucciones
Mi empresa es de:
Ganaderia

Las reglas de negocio importante son:
1. Un animal solo puede ser registrado si tiene su chapeta (Id unico registrado por el ICA) y su categoria, Peso Inicial, Precio x kilo (comprado)
2. No se puede aplicar una vacuna o tratamiento a un animal que esté marcado como "vendido" o "fallecido"
3. No se puede registrar leche a un animal diferente a una vaca

Los casos de uso que se ven en esta empresa son:
- Registrar animal con datos obligatorios (chapeta ICA, categoría, peso, precio/kg)
- Consultar y actualizar inventario de animales
- Registrar eventos sanitarios (vacunas/tratamientos) con validación de estado
- Registrar producción de leche solo para vacas activas

Los submodulos que vemos en esta empresa son:
**ganado-service:**
- `animal`: CRUD de bovinos
- `potrero`: gestión de potreros y asignación

**sanidad-service:**
- `sanidad`: vacunas y tratamientos
- `produccion`: registro de producción de leche

La infraestructura que voy a utilizar es:
- Base de datos: Firebase Firestore (NoSQL)
- Comunicación: REST entre microservicios
- NO ES NECESARIO QUE HAGA FRONT

Manejo de excepciones.
Control de excepciones no esperadas.
@ControllerAdvice.
Debe tener Unit test (Mock) e integration test (no hay mocks o muy pocos mock)

---

## Arquitectura del sistema

```plaintext
ganaderia-app/
├── ganado-service (puerto: 3001)
│   ├── src/
│   │   ├── config/firebase.js
│   │   ├── routes/{animal, potrero}.routes.js
│   │   ├── controllers/{animal, potrero}.controller.js
│   │   ├── services/{animal, potrero}.service.js
│   │   ├── repository/{animal, potrero}.repository.js
│   │   ├── exceptions/{AppError, AnimalNotFoundError, AnimalInvalidStateError}.js
│   │   └── middlewares/errorHandler.js
│   ├── tests/unit/
│   ├── tests/integration/
│   └── serviceAccountKey.json
└── sanidad-service (puerto: 3002)
    ├── src/
    │   ├── config/firebase.js
    │   ├── routes/{sanidad, produccion}.routes.js
    │   ├── controllers/{sanidad, produccion}.controller.js
    │   ├── services/{sanidad, produccion}.service.js
    │   ├── repository/{sanidad, produccion}.repository.js
    │   ├── clients/ganadoClient.js ← REST a ganado-service
    │   ├── exceptions/{AppError, AnimalInvalidStateError}.js
    │   └── middlewares/errorHandler.js
    ├── tests/unit/
    └── tests/integration/
```
---

## Tecologías Utilizadas


| Componente           | Tecnología                                      |
|----------------------|-------------------------------------------------|
| Lenguaje             | Node.js 18+                                     |
| Framework Web        | Express.js                                      |
| Base de datos        | Firebase Firestore (NoSQL)                      |
| ORM                  | Firebase Admin SDK                              |
| Comunicación         | REST API + Axios                                |
| Tests Unitarios      | Jest + Mocks                                    |
| Tests Integración    | Jest + Supertest + Firestore Emulator           |
| Variables entorno    | dotenv                                          |
| Paquetes             | express, firebase-admin, axios, supertest, jest |

---

## Instalación y Ejecución

1. Clonar y preparar proyecto

```bash
git clone <tu-repo>
cd ganaderia-app
```

2. Configurar Firebase (Obligatorio)

- Ir a **Firebase Console**
- Crear proyecto **ganaderia-app**
- Activar **Firestore Database** (modo prueba)
- ⚙️ Configuración del proyecto → **Cuentas de servicio**
- Generar nueva **clave privada** → descargar `serviceAccountKey.json`
- Copiar el archivo a ambos servicios:
  - `ganado-service/`
  - `sanidad-service/`

3. Instalar dependencias

```bash
# ganado-service
cd ganado-service
npm install

# sanidad-service
cd sanidad-service
npm install
```

4. Levantar servicios

```bash
# Terminal 1
cd ganaderia-app/ganado-service
node index.js
# → "ganado-service corriendo en puerto 3001"

# Terminal 2
cd ganaderia-app/sanidad-service
node index.js
# → "sanidad-service corriendo en puerto 3002"
```

---

## Reglas de negocio implementadas

**Regla 1:**

```plaintext
Un animal solo puede ser registrado si tiene:
✓ chapeta ICA única
✓ categoría válida (TERNERO, NOVILLO, VACA, TORO)  
✓ pesoInicial
✓ precioPorKilo
```

*POST* `http://localhost:3001/api/animales` sin chapeta → `400 Bad Request`

**Regla 2:**

```plaintext
No se puede vacunar/tratar animales VENDIDO/FALLECIDO
```

*POST* `http://localhost:3002/api/sanidad/vacuna` con animal VENDIDO → `400`

**Regla 3:**

```plaintext
Leche solo para VACAS
```

*POST* `http://localhost:3002/api/produccion/leche` con TORO → `400`

---

## Comunicación entre Microservicios

```plaintext
sanidad-service → REST → ganado-service
POST /api/sanidad/vacuna
        ↓
    Consulta: GET /api/animales/{chapeta}
        ↓ (Axios)
    Valida estado del animal
        ↓
    Guarda en Firestore si está ACTIVO
```

**Archivo clave:** `sanidad-service/src/clients/ganadoClient.js`

---

## Manejo de Excepciones

```bash
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

class AnimalNotFoundError extends AppError { /* 404 */ }
class AnimalInvalidStateError extends AppError { /* 400 */ }
```

**@ControllerAdvice equivalente (Middleware Global)**

```bash
// middlewares/errorHandler.js
app.use(errorHandler); // Siempre al FINAL de index.js

const errorHandler = (err, req, res, next) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,  // Mensaje específico
    });
  }
  // Control de excepciones NO ESPERADAS
  console.error('ERROR INESPERADO:', err);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
  });
};
```

---

## Tests Implementados (32/32)

| Tipo                                   | ganado-service | sanidad-service | Total |
| -------------------------------------- | -------------- | --------------- | ----- |
| Unit Tests (Mocks)                     | 7/7 ✅          | 8/8 ✅           | 15/15 |
| Integration Tests (Firestore Emulator) | 7/7 ✅          | 10/10 ✅         | 17/17 |
| TOTAL                                  | 14/14          | 18/18           | 32/32 |

Correr Tests

```bash
# Unit Tests
npm test

# Integration Tests (requiere emulador)
firebase emulators:start --only firestore  # Terminal 1
npm run test:integration                   # Terminal 2
```

---

## Endpoints Disponibles

*ganado-service (3001)*

```plaintext
POST    /api/animales              → Registrar animal
GET     /api/animales              → Listar animales  
GET     /api/animales/:chapeta     → Obtener animal
PATCH   /api/animales/:chapeta/estado → Cambiar estado

POST    /api/potreros              → Crear potrero
GET     /api/potreros              → Listar potreros
POST    /api/potreros/:nombre/asignar → Asignar animal
```

*sanidad-service (3002)

```plaintext
POST    /api/sanidad/vacuna        → Registrar vacuna
POST    /api/sanidad/tratamiento   → Registrar tratamiento
GET     /api/sanidad/:chapeta/vacunas → Listar vacunas

POST    /api/produccion/leche      → Registrar producción leche
GET     /api/produccion/:chapeta/leche → Listar producción
```

---

## Estructura de Datos Firestore

```plaintext
Firestore Database (NoSQL):
├── animales/ICA-001 {chapeta, categoria, pesoInicial, precioPorKilo, estado}
├── potreros/Potrero-A {nombre, capacidad, animales: ["ICA-001"]}
├── vacunaciones/doc1 {chapeta, nombreVacuna, dosis, fecha}
├── tratamientos/doc2 {chapeta, descripcion, fechaInicio, fechaFin}
└── produccion_leche/doc3 {chapeta, litros, fecha}
```

---

## Autores

- Juan Andrés Lacouture Daza
- Juan José Cárdenas Carrero

---
