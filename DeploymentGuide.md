
# Windows Server Deployment Guide

This guide outlines the steps to deploy the Monitoring and Evaluation application on a Windows server.

## System Requirements

- Windows Server 2016 or later
- IIS 10.0 or later
- .NET Framework 4.7.2 or later
- Node.js 14.0 or later (for build process)
- 4GB RAM minimum (8GB recommended)
- 10GB available disk space

## Pre-Deployment Steps

1. **Install Required Software**
   - Install IIS (Internet Information Services)
   - Install URL Rewrite Module for IIS
   - Install Node.js LTS version

2. **Configure IIS**
   - Open IIS Manager
   - Create a new Application Pool named "MonitoringEvaluationAppPool"
   - Set the .NET CLR version to "No Managed Code"
   - Set the pipeline mode to "Integrated"

## Deployment Steps

1. **Build the Application**
   ```
   npm install
   npm run build
   ```

2. **Prepare Server Directory**
   - Create a directory for the application: `C:\inetpub\wwwroot\monitoring-evaluation`
   - Create a data directory: `C:\ProgramData\MonitoringEvaluationApp`
   - Ensure IIS_IUSRS has read/write permissions to the data directory

3. **Copy Files to Server**
   - Copy all files from the `dist` directory to `C:\inetpub\wwwroot\monitoring-evaluation`
   - Copy the `web.config` file to the root of the application directory

4. **Configure Application in IIS**
   - Open IIS Manager
   - Add a new website or application pointing to `C:\inetpub\wwwroot\monitoring-evaluation`
   - Assign the "MonitoringEvaluationAppPool" application pool
   - Set the site bindings (hostname, IP, port)

5. **Configure URL Rewrite Rules**
   - Ensure the `web.config` file contains the necessary URL rewrite rules for the SPA

## Post-Deployment Steps

1. **Verify Application**
   - Navigate to the application URL
   - Check for any errors in the browser console or IIS logs

2. **Configure Automatic Startup**
   - Set the application pool to start automatically
   - Configure the website to start automatically

3. **Set Up Monitoring**
   - Configure IIS logging
   - Set up performance monitoring

## Troubleshooting

- **Application Not Loading**
  - Check IIS logs at `%SystemDrive%\inetpub\logs\LogFiles`
  - Verify permissions on application directories
  - Check for URL rewrite module installation

- **API Requests Failing**
  - Verify web.config URL rewrite rules
  - Check CORS settings if applicable
  - Ensure all API endpoints are properly configured

- **Performance Issues**
  - Monitor CPU and memory usage
  - Increase application pool resource limits if needed
  - Consider scaling up server resources

## Backup and Recovery

1. **Regular Backups**
   - Back up the application directory
   - Back up the data directory
   - Export IIS configuration

2. **Recovery Process**
   - Restore from backups
   - Reset IIS (iisreset)
   - Verify application functionality

## Contact Support

For assistance with deployment issues, contact:
- Tech Support: support@example.com
- Documentation: [Internal Wiki URL]
