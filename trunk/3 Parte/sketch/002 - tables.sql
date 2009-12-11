use msflags
go


print 'Create Table tblUser'
go

create table dbo.tblUser(
	idUser int identity( 1, 1 ) 
	,userName varchar(20) not null
	,password varchar(250) not null    -- não há necessidade de guardar a pwd do utilizador, deverá ser guardado
                                       -- o hash, utilização do algoritmo MD5. o campo deverá ser do tipo char(38)
	,avatarSrc varchar(250) not null
	,firstName varchar(50) not null
	,lastName varchar(50) not null
	,country int not null
	,city varchar(50)
	,dateOfBirth datetime
	,onlineStatus bit
	,constraint pk_user primary key	(idUser)
) on [PRIMARY]
-- faltam as relações nas chaves estrangeiras. [country ] 

go


print 'Create Table tblFriendship'
go

create table dbo.tblFriendship(
	 idUser int not null
	,idFriend int not null
	,constraint pk_fship primary key (idUser,idFriend)
) on [PRIMARY] -- faltam as relações nas chaves estrangeiras [idUser, idFriend]
               -- de questões de performance deverá ser criado um índice por idUser, facilitando as pesquisas

print 'Create Table tblCountry'
go

create table dbo.tblCountry(
	idCountry int identity(1, 1)
	,country varchar(50)
	,constraint pk_country primary key (idCountry)
) on [PRIMARY]
-- com esta implementação é possível criar duas ou mais entradas para o mesmo país. 
-- ou se passa o campo country para chave ou se acrescenta um índice único.


