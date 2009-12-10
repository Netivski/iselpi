use master

GO

CREATE DATABASE msflags 
ON  PRIMARY ( NAME = N'msflags'    , FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL.1\MSSQL\Data\MSFlags.mdf'    , SIZE = 3072KB , FILEGROWTH = 1024KB )
LOG ON      ( NAME = N'msflags_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL.1\MSSQL\Log\MSFlags_log.ldf' , SIZE = 1024KB , FILEGROWTH = 1024KB )
GO
EXEC dbo.sp_dbcmptlevel @dbname=N'msflags', @new_cmptlevel=90


GO 

use master

ALTER DATABASE msflags ADD FILEGROUP msflagsDataFileGroup
ALTER DATABASE msflags ADD FILEGROUP msflagsIndexFileGroup

ALTER DATABASE msflags ADD FILE  ( 
                                         NAME       = msflagsdata
                                        ,FILENAME   = 'C:\Program Files\Microsoft SQL Server\MSSQL.1\MSSQL\Data\msflagsdata.ndf'
                                        ,SIZE       = 5MB
                                        ,FILEGROWTH = 25MB 
                                  )  TO FILEGROUP [msflagsDataFileGroup];  

ALTER DATABASE msflags ADD FILE  (  
                                      NAME       = msflagsindex
                                     ,FILENAME   = 'C:\Program Files\Microsoft SQL Server\MSSQL.1\MSSQL\Data\msflagsindex.ndf'
                                     ,SIZE       = 5MB
                                     ,FILEGROWTH = 25MB 
                                   )  TO FILEGROUP [msflagsIndexFileGroup];  



GO