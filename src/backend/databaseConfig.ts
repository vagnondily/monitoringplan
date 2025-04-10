
// SQL Database Configuration for Windows Server

import sql from 'mssql';
import { serverConfig } from '@/config/serverConfig';

// SQL Server connection configuration
const sqlConfig = {
  user: process.env.DB_USER || 'mems_admin',
  password: process.env.DB_PASSWORD || 'YourSecurePassword',
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'MEMS_DB',
  options: {
    encrypt: true, // For secure connections
    trustServerCertificate: true, // For development only
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Create a connection pool
const pool = new sql.ConnectionPool(sqlConfig);

// Connect to SQL Server
const connectToDatabase = async () => {
  try {
    await pool.connect();
    console.log('Connected to SQL Server');
    return pool;
  } catch (error) {
    console.error('Failed to connect to SQL Server:', error);
    throw error;
  }
};

// Execute a query
const executeQuery = async (query: string, params: any[] = []) => {
  try {
    const request = pool.request();
    
    // Add parameters
    params.forEach((param, index) => {
      request.input(`param${index}`, param);
    });
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error executing query:', error);
    throw error;
  }
};

// Execute a stored procedure
const executeStoredProcedure = async (procedureName: string, params: Record<string, any> = {}) => {
  try {
    const request = pool.request();
    
    // Add parameters
    Object.entries(params).forEach(([key, value]) => {
      request.input(key, value);
    });
    
    const result = await request.execute(procedureName);
    return result.recordset;
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    throw error;
  }
};

// Initialize database (create tables, etc.)
const initializeDatabase = async () => {
  try {
    // List of all tables that should exist in the database
    const tables = [
      {
        name: 'Users',
        createSql: `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
          CREATE TABLE Users (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            Name NVARCHAR(100) NOT NULL,
            Email NVARCHAR(100) NOT NULL UNIQUE,
            PasswordHash NVARCHAR(255) NOT NULL,
            Role NVARCHAR(50) NOT NULL,
            Active BIT DEFAULT 1,
            LastLogin DATETIME NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
          )
        `
      },
      {
        name: 'Sites',
        createSql: `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Sites' AND xtype='U')
          CREATE TABLE Sites (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            Name NVARCHAR(100) NOT NULL,
            Location NVARCHAR(255) NOT NULL,
            SubOfficeName NVARCHAR(100) NULL,
            Antenne NVARCHAR(100) NULL,
            Region NVARCHAR(100) NULL,
            District NVARCHAR(100) NULL,
            Commune NVARCHAR(100) NULL,
            Fokontany NVARCHAR(100) NULL,
            SiteId NVARCHAR(50) NULL,
            GpsLatitude NVARCHAR(50) NULL,
            GpsLongitude NVARCHAR(50) NULL,
            ActivityCategory NVARCHAR(100) NULL,
            ProgramArea NVARCHAR(100) NULL,
            Status NVARCHAR(50) DEFAULT 'Actif',
            LastUpdate DATETIME DEFAULT GETDATE(),
            LastVisitDate DATETIME NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
          )
        `
      },
      {
        name: 'Projects',
        createSql: `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Projects' AND xtype='U')
          CREATE TABLE Projects (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            Name NVARCHAR(100) NOT NULL,
            Description NVARCHAR(MAX) NULL,
            StartDate DATETIME NOT NULL,
            EndDate DATETIME NOT NULL,
            Status NVARCHAR(50) DEFAULT 'En cours',
            Progress FLOAT DEFAULT 0,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
          )
        `
      },
      {
        name: 'SiteProjects',
        createSql: `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SiteProjects' AND xtype='U')
          CREATE TABLE SiteProjects (
            SiteId UNIQUEIDENTIFIER,
            ProjectId UNIQUEIDENTIFIER,
            PRIMARY KEY (SiteId, ProjectId),
            FOREIGN KEY (SiteId) REFERENCES Sites(Id),
            FOREIGN KEY (ProjectId) REFERENCES Projects(Id)
          )
        `
      },
      {
        name: 'Parameters',
        createSql: `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Parameters' AND xtype='U')
          CREATE TABLE Parameters (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            Name NVARCHAR(100) NOT NULL,
            Value NVARCHAR(MAX) NOT NULL,
            Description NVARCHAR(255) NULL,
            Category NVARCHAR(100) NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
          )
        `
      },
      {
        name: 'OverarchingParameters',
        createSql: `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='OverarchingParameters' AND xtype='U')
          CREATE TABLE OverarchingParameters (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            CspActivityNumber NVARCHAR(50) NOT NULL,
            FieldOffice NVARCHAR(100) NOT NULL,
            ActivityCategory NVARCHAR(100) NOT NULL,
            OperationDuration INT NOT NULL,
            NumberOfSites INT NOT NULL,
            RiskLevel INT NOT NULL,
            MinimumRequiredInterval INT NOT NULL,
            TargetedNumberOfSites INT NOT NULL,
            FeasibleNumberOfSites INT NOT NULL,
            AdjustedRequiredInterval FLOAT NOT NULL,
            FeasibilityRatio FLOAT NOT NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE()
          )
        `
      },
      {
        name: 'ReportTemplates',
        createSql: `
          IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='ReportTemplates' AND xtype='U')
          CREATE TABLE ReportTemplates (
            Id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
            Name NVARCHAR(100) NOT NULL,
            Description NVARCHAR(MAX) NULL,
            Category NVARCHAR(50) NOT NULL,
            Sections NVARCHAR(MAX) NOT NULL,
            CreatedBy UNIQUEIDENTIFIER NULL,
            CreatedAt DATETIME DEFAULT GETDATE(),
            UpdatedAt DATETIME DEFAULT GETDATE(),
            FOREIGN KEY (CreatedBy) REFERENCES Users(Id)
          )
        `
      }
    ];
    
    // Create all tables
    for (const table of tables) {
      await executeQuery(table.createSql);
      console.log(`Table ${table.name} checked/created`);
    }
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Create default admin user if not exists
const createDefaultAdminUser = async () => {
  try {
    const adminExists = await executeQuery(`
      SELECT COUNT(*) AS count FROM Users WHERE Email = 'admin@mems.org'
    `);
    
    if (adminExists[0].count === 0) {
      // In a real app, you would hash this password
      await executeQuery(`
        INSERT INTO Users (Name, Email, PasswordHash, Role)
        VALUES ('Admin User', 'admin@mems.org', 'admin123', 'administrator')
      `);
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin user:', error);
    throw error;
  }
};

// Export database functions
export const database = {
  connect: connectToDatabase,
  query: executeQuery,
  procedure: executeStoredProcedure,
  initialize: initializeDatabase,
  createDefaultAdmin: createDefaultAdminUser,
  close: async () => {
    try {
      await pool.close();
      console.log('Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error);
      throw error;
    }
  }
};

export default database;
