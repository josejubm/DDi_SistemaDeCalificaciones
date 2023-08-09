/* tables */

-- Tabla docentes
CREATE TABLE `docentes` (
  `CProfesional` VARCHAR(20) NOT NULL,
  `Nombre` VARCHAR(50) NOT NULL,
  `Paterno` VARCHAR(50) NOT NULL,
  `Materno` VARCHAR(50) NOT NULL,
  `Usuario` VARCHAR(20) NOT NULL,
  `Contrasena` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`CProfesional`),
  UNIQUE KEY (`Usuario`)
) ENGINE = InnoDB;

-- Tabla domicilios
CREATE TABLE `domicilios`(
  `Id` INT(4) NOT NULL AUTO_INCREMENT,
  `Colonia` VARCHAR(50) NOT NULL,
  `Calle` VARCHAR(50) NOT NULL,
  `Numero` VARCHAR(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE = InnoDB;

-- Tabla alumnos
CREATE TABLE `alumnos` (
  `Matricula` VARCHAR(11) NOT NULL,
  `Nombre` VARCHAR(50) NOT NULL,
  `Paterno` VARCHAR(50) NOT NULL,
  `Materno` VARCHAR(50) NOT NULL,
  `Genero` CHAR(1) NOT NULL,
  `FechaNac` DATE NOT NULL,
  `Edad` INT NOT NULL,
  `IdDomicilio` INT(4) NOT NULL,
  PRIMARY KEY (`Matricula`),
  FOREIGN KEY (`IdDomicilio`) REFERENCES `domicilios` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;

-- Tabla materias
CREATE TABLE `materias`(
  `ClaveMat` INT(4) NOT NULL,
  `Nombre` VARCHAR(40) NOT NULL,
  `Cuatrimestre` INT(2) NOT NULL,
  PRIMARY KEY(`ClaveMat`)
) ENGINE = InnoDB;

-- Tabla calificaciones
CREATE TABLE `calificaciones`(
  `ClaveMat` INT(4) NOT NULL,
  `Matricula` VARCHAR(11) NOT NULL,
  `Parcial1` DECIMAL(4, 2) NOT NULL,
  `Parcial2` DECIMAL(4, 2) NOT NULL,
  `Parcial3` DECIMAL(4, 2) NOT NULL,
  `Extra` DECIMAL(4, 2) NOT NULL,
  UNIQUE KEY(`ClaveMat`, `Matricula`),
  CONSTRAINT `fk_calificaciones_materia` FOREIGN KEY (`ClaveMat`) REFERENCES `materias` (`ClaveMat`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_calificaciones_alumno` FOREIGN KEY (`Matricula`) REFERENCES `alumnos` (`Matricula`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;



-- Insertar registros de docentes
INSERT INTO `docentes` (`CProfesional`, `Nombre`, `Paterno`, `Materno`, `Usuario`, `Contrasena`)
VALUES ('123456', 'Juan', 'Perez', 'Gomez', 'jose', 'jose');

-- Insertar registros de domicilios
INSERT INTO `domicilios` (`Colonia`, `Calle`, `Numero`)
VALUES ('Centro', 'Calle 1', '123'),
       ('Residencial', 'Avenida 2', '456'),
       ('Colonia Norte', 'Calle 3', '789'),
       ('Colonia Sur', 'Calle 4', '101'),
       ('Barrio Antiguo', 'Calle 5', '202');

-- Insertar registros de alumnos
INSERT INTO `alumnos` (`Matricula`, `Nombre`, `Paterno`, `Materno`, `Genero`, `FechaNac`, `Edad`, `IdDomicilio`)
VALUES ('20230001', 'Luis', 'Martinez', 'Garcia', 'M', '2000-05-15', 21, 1),
       ('20230002', 'Ana', 'Rodriguez', 'Lopez', 'F', '2001-08-22', 20, 2),
       ('20230003', 'Carlos', 'Gonzalez', 'Perez', 'M', '2000-10-10', 21, 3),
       ('20230004', 'Maria', 'Lopez', 'Hernandez', 'F', '2001-03-03', 20, 4),
       ('20230005', 'Javier', 'Ramirez', 'Martinez', 'M', '2000-12-20', 21, 5);

-- Insertar registros de materias
INSERT INTO `materias` (`ClaveMat`, `Nombre`, `Cuatrimestre`)
VALUES (101, 'Introducción a la Programación', 1),
       (102, 'Bases de Datos', 2),
       (103, 'Programación Web', 3),
       (104, 'Matemáticas Discretas', 2),
       (105, 'Estructuras de Datos', 3);

-- Insertar registros de calificaciones con valores decimales
INSERT INTO `calificaciones` (`ClaveMat`, `Matricula`, `Parcial1`, `Parcial2`, `Parcial3`, `Extra`)
VALUES (101, '20230001', 8.5, 9.0, 7.75, 6.5),
       (101, '20230002', 7.75, 8.0, 8.5, 9.25),
       (102, '20230001', 9.0, 8.75, 9.5, 8.0),
       (102, '20230002', 8.25, 7.5, 8.0, 7.75),
       (103, '20230001', 7.0, 8.5, 9.0, 6.75),
       (103, '20230002', 8.75, 7.25, 8.5, 9.0),
       (104, '20230001', 9.5, 9.0, 8.75, 9.25),
       (104, '20230002', 8.0, 7.75, 8.5, 7.25),
       (105, '20230001', 8.25, 8.5, 9.0, 8.0),
       (105, '20230002', 9.0, 9.25, 8.75, 9.5);
