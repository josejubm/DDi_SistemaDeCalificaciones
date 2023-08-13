/* tables */

-- Crear las tablas
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
VALUES
('Centro', 'Calle 1', '123'),
('Residencial', 'Avenida 2', '456'),
('Colonia Norte', 'Calle 3', '789'),
('Colonia Sur', 'Calle 4', '101'),
('Barrio Antiguo', 'Calle 5', '202');



-- Insertar registros de alumnos
INSERT INTO alumnos (Matricula, Nombre, Paterno, Materno, Genero, FechaNac, Edad, IdDomicilio) VALUES
('20230001', 'Juan', 'García', 'Pérez', 'M', '2002-05-10', 21, 1),
('20230002', 'María', 'López', 'Hernández', 'F', '2001-02-15', 22, 2),
('20230003', 'Pedro', 'Martínez', 'González', 'M', '2002-11-20', 21, 3),
('20230004', 'Ana', 'Sánchez', 'Ramírez', 'F', '2001-07-05', 22, 4),
('20230005', 'Javier', 'Fernández', 'Torres', 'M', '2003-01-30', 20, 5);

-- Insertar registros de materias
-- Insertar materias para los 5 cuatrimestres
INSERT INTO `materias` (`ClaveMat`, `Nombre`, `Cuatrimestre`)
VALUES
-- Cuatrimestre 1
('101', 'Matemáticas', 1),
('102', 'Física', 1),
('103', 'Introducción a la programación', 1),
('104', 'Historia', 1),
('105', 'Inglés', 1),
-- Cuatrimestre 2
('201', 'Estadística', 2),
('202', 'Cálculo', 2),
('203', 'Estructura de datos', 2),
('204', 'Literatura', 2),
('205', 'Ética', 2),
-- Cuatrimestre 3
('301', 'Programación orientada a objetos', 3),
('302', 'Bases de datos', 3),
('303', 'Análisis de algoritmos', 3),
('304', 'Geografía', 3),
('305', 'Filosofía', 3),
-- Cuatrimestre 4
('401', 'Programación web', 4),
('402', 'Redes de computadoras', 4),
('403', 'Arquitectura de computadoras', 4),
('404', 'Economía', 4),
('405', 'Psicología', 4),
-- Cuatrimestre 5
('501', 'Inteligencia artificial', 5),
('502', 'Sistemas operativos', 5),
('503', 'Seguridad informática', 5),
('504', 'Derecho informático', 5),
('505', 'Gestión de proyectos', 5);

-- Insertar registros de calificaciones con valores decimales
-- Cuatrimestre 1
INSERT INTO `calificaciones` (`ClaveMat`, `Matricula`, `Parcial1`, `Parcial2`, `Parcial3`, `Extra`)
VALUES
-- Alumno 1
(101, '20230001', 8.5, 9.0, 7.75, 6.5),
(102, '20230001', 9.0, 8.75, 9.5, 8.0),
(103, '20230001', 7.0, 8.5, 9.0, 6.75),
(104, '20230001', 6.5, 7.0, 8.0, 5.0),
(105, '20230001', 8.0, 8.25, 9.0, 7.5),

-- Alumno 2
(101, '20230002', 7.75, 8.0, 8.5, 9.25),
(102, '20230002', 8.25, 7.5, 8.0, 7.75),
(103, '20230002', 8.75, 7.25, 8.5, 9.0),
(104, '20230002', 7.0, 7.5, 8.0, 6.25),
(105, '20230002', 9.25, 9.5, 8.75, 9.75),

-- Alumno 3
(101, '20230003', 6.0, 5.5, 7.25, 4.75),
(102, '20230003', 5.75, 6.0, 5.5, 6.25),
(103, '20230003', 8.5, 9.0, 8.75, 7.75),
(104, '20230003', 7.0, 6.75, 7.5, 6.0),
(105, '20230003', 8.25, 8.5, 8.0, 7.25),

-- Alumno 4
(101, '20230004', 9.5, 9.0, 9.25, 8.75),
(102, '20230004', 8.0, 7.5, 8.25, 7.0),
(103, '20230004', 6.25, 7.0, 7.5, 6.75),
(104, '20230004', 7.5, 8.0, 7.75, 6.5),
(105, '20230004', 8.75, 9.0, 8.5, 7.75),

-- Alumno 5
(101, '20230005', 7.0, 6.5, 7.75, 6.0),
(102, '20230005', 8.5, 8.0, 8.75, 7.25),
(103, '20230005', 9.0, 9.5, 8.5, 9.0),
(104, '20230005', 6.75, 7.0, 7.5, 6.25),
(105, '20230005', 7.5, 8.0, 8.25, 7.0);

-- Cuatrimestre 2
-- Alumno 1
INSERT INTO `calificaciones` (`ClaveMat`, `Matricula`, `Parcial1`, `Parcial2`, `Parcial3`, `Extra`)
VALUES
(201, '20230001', 8.0, 7.5, 7.25, 6.0),
(202, '20230001', 9.0, 8.25, 8.5, 7.75),
(203, '20230001', 7.5, 8.0, 7.75, 6.5),
(204, '20230001', 6.75, 7.0, 8.25, 7.0),
(205, '20230001', 8.25, 8.5, 8.0, 7.25),

-- Alumno 2
(201, '20230002', 7.5, 8.0, 8.5, 7.25),
(202, '20230002', 8.25, 7.5, 8.0, 6.75),
(203, '20230002', 8.75, 7.25, 8.5, 7.0),
(204, '20230002', 7.0, 7.5, 8.0, 6.5),
(205, '20230002', 9.25, 9.5, 8.75, 9.0),

-- Alumno 3
(201, '20230003', 6.5, 6.0, 6.25, 5.0),
(202, '20230003', 6.75, 7.0, 6.5, 6.25),
(203, '20230003', 8.0, 8.5, 8.75, 7.75),
(204, '20230003', 6.5, 6.75, 7.0, 5.5),
(205, '20230003', 8.0, 8.25, 8.5, 7.75),

-- Alumno 4
(201, '20230004', 9.0, 8.5, 8.25, 7.0),
(202, '20230004', 7.75, 7.0, 7.25, 6.5),
(203, '20230004', 6.0, 6.5, 6.75, 5.25),
(204, '20230004', 7.25, 7.75, 7.0, 6.5),
(205, '20230004', 8.5, 8.75, 8.25, 7.5),

-- Alumno 5
(201, '20230005', 6.0, 5.5, 5.75, 4.5),
(202, '20230005', 8.0, 8.5, 8.25, 7.0),
(203, '20230005', 9.5, 9.0, 9.0, 8.5),
(204, '20230005', 5.75, 6.0, 6.5, 5.25),
(205, '20230005', 7.0, 7.5, 7.75, 6.5);

-- Cuatrimestre 3
-- Alumno 1
INSERT INTO `calificaciones` (`ClaveMat`, `Matricula`, `Parcial1`, `Parcial2`, `Parcial3`, `Extra`)
VALUES
(301, '20230001', 8.5, 8.0, 7.75, 6.5),
(302, '20230001', 7.0, 7.5, 8.0, 6.25),
(303, '20230001', 8.75, 8.5, 8.25, 7.0),
(304, '20230001', 6.5, 7.0, 7.5, 6.0),
(305, '20230001', 8.0, 8.25, 8.0, 7.5),

-- Alumno 2
(301, '20230002', 7.75, 8.0, 8.5, 7.25),
(302, '20230002', 8.25, 7.5, 8.0, 6.75),
(303, '20230002', 8.0, 7.25, 8.5, 7.0),
(304, '20230002', 7.0, 7.5, 8.0, 6.5),
(305, '20230002', 9.25, 9.5, 8.75, 9.0),

-- Alumno 3
(301, '20230003', 6.5, 6.0, 6.25, 5.0),
(302, '20230003', 6.75, 7.0, 6.5, 6.25),
(303, '20230003', 8.0, 8.5, 8.75, 7.75),
(304, '20230003', 6.5, 6.75, 7.0, 5.5),
(305, '20230003', 8.0, 8.25, 8.5, 7.75),

-- Alumno 4
(301, '20230004', 9.0, 8.5, 8.25, 7.0),
(302, '20230004', 7.75, 7.0, 7.25, 6.5),
(303, '20230004', 6.0, 6.5, 6.75, 5.25),
(304, '20230004', 7.25, 7.75, 7.0, 6.5),
(305, '20230004', 8.5, 8.75, 8.25, 7.5),

-- Alumno 5
(301, '20230005', 6.0, 5.5, 5.75, 4.5),
(302, '20230005', 8.0, 8.5, 8.25, 7.0),
(303, '20230005', 9.5, 9.0, 9.0, 8.5),
(304, '20230005', 5.75, 6.0, 6.5, 5.25),
(305, '20230005', 7.0, 7.5, 7.75, 6.5);

-- Cuatrimestre 4
-- Alumno 1
INSERT INTO `calificaciones` (`ClaveMat`, `Matricula`, `Parcial1`, `Parcial2`, `Parcial3`, `Extra`)
VALUES
(401, '20230001', 8.0, 8.5, 8.25, 7.0),
(402, '20230001', 7.5, 7.0, 7.25, 6.5),
(403, '20230001', 8.75, 8.0, 8.25, 7.75),
(404, '20230001', 6.5, 6.75, 7.0, 5.5),
(405, '20230001', 8.0, 8.25, 8.5, 7.75),

-- Alumno 2
(401, '20230002', 7.75, 8.0, 8.5, 7.25),
(402, '20230002', 8.25, 7.5, 8.0, 6.75),
(403, '20230002', 8.0, 7.25, 8.5, 7.0),
(404, '20230002', 7.0, 7.5, 8.0, 6.5),
(405, '20230002', 9.25, 9.5, 8.75, 9.0),

-- Alumno 3
(401, '20230003', 6.5, 6.0, 6.25, 5.0),
(402, '20230003', 6.75, 7.0, 6.5, 6.25),
(403, '20230003', 8.0, 8.5, 8.75, 7.75),
(404, '20230003', 6.5, 6.75, 7.0, 5.5),
(405, '20230003', 8.0, 8.25, 8.5, 7.75),

-- Alumno 4
(401, '20230004', 9.0, 8.5, 8.25, 7.0),
(402, '20230004', 7.75, 7.0, 7.25, 6.5),
(403, '20230004', 6.0, 6.5, 6.75, 5.25),
(404, '20230004', 7.25, 7.75, 7.0, 6.5),
(405, '20230004', 8.5, 8.75, 8.25, 7.5),

-- Alumno 5
(401, '20230005', 6.0, 5.5, 5.75, 4.5),
(402, '20230005', 8.0, 8.5, 8.25, 7.0),
(403, '20230005', 9.5, 9.0, 9.0, 8.5),
(404, '20230005', 5.75, 6.0, 6.5, 5.25),
(405, '20230005', 7.0, 7.5, 7.75, 6.5);

-- Cuatrimestre 5
-- Alumno 1
INSERT INTO `calificaciones` (`ClaveMat`, `Matricula`, `Parcial1`, `Parcial2`, `Parcial3`, `Extra`)
VALUES
(501, '20230001', 8.0, 8.5, 8.25, 7.0),
(502, '20230001', 7.5, 7.0, 7.25, 6.5),
(503, '20230001', 8.75, 8.0, 8.25, 7.75),
(504, '20230001', 6.5, 6.75, 7.0, 5.5),
(505, '20230001', 8.0, 8.25, 8.5, 7.75),

-- Alumno 2
(501, '20230002', 7.75, 8.0, 8.5, 7.25),
(502, '20230002', 8.25, 7.5, 8.0, 6.75),
(503, '20230002', 8.0, 7.25, 8.5, 7.0),
(504, '20230002', 7.0, 7.5, 8.0, 6.5),
(505, '20230002', 9.25, 9.5, 8.75, 9.0),

-- Alumno 3
(501, '20230003', 6.5, 6.0, 6.25, 5.0),
(502, '20230003', 6.75, 7.0, 6.5, 6.25),
(503, '20230003', 8.0, 8.5, 8.75, 7.75),
(504, '20230003', 6.5, 6.75, 7.0, 5.5),
(505, '20230003', 8.0, 8.25, 8.5, 7.75),

-- Alumno 4
(501, '20230004', 9.0, 8.5, 8.25, 7.0),
(502, '20230004', 7.75, 7.0, 7.25, 6.5),
(503, '20230004', 6.0, 6.5, 6.75, 5.25),
(504, '20230004', 7.25, 7.75, 7.0, 6.5),
(505, '20230004', 8.5, 8.75, 8.25, 7.5),

-- Alumno 5
(501, '20230005', 6.0, 5.5, 5.75, 4.5),
(502, '20230005', 8.0, 8.5, 8.25, 7.0),
(503, '20230005', 9.5, 9.0, 9.0, 8.5),
(504, '20230005', 5.75, 6.0, 6.5, 5.25),
(505, '20230005', 7.0, 7.5, 7.75, 6.5);


-- Disparador para crear registros de calificaciones en 0 al agregar un nuevo alumno
DELIMITER //
CREATE TRIGGER trig_after_insert_alumnos
AFTER INSERT ON alumnos
FOR EACH ROW
BEGIN
    INSERT INTO calificaciones (ClaveMat, Matricula, Parcial1, Parcial2, Parcial3, Extra)
    SELECT ClaveMat, NEW.Matricula, 0, 0, 0, 0
    FROM materias;
END;
//
DELIMITER ;


DELIMITER //
CREATE TRIGGER trig_after_insert_materias
AFTER INSERT ON materias
FOR EACH ROW
BEGIN
    DECLARE matriculas TEXT;
    SET matriculas = (SELECT GROUP_CONCAT(Matricula) FROM alumnos);
    
    INSERT INTO calificaciones (ClaveMat, Matricula, Parcial1, Parcial2, Parcial3, Extra)
    SELECT NEW.ClaveMat, Matricula, 0, 0, 0, 0 FROM alumnos;
END;
//
DELIMITER ;
