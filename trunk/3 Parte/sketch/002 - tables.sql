use msflags
go


print 'Create Table tblUser'
go

create table dbo.tblUser(
	idUser int identity( 1, 1 ) 
	,userName varchar(20) not null
	,password varchar(250) not null    -- n�o h� necessidade de guardar a pwd do utilizador, dever� ser guardado
                                       -- o hash, utiliza��o do algoritmo MD5. o campo dever� ser do tipo char(38)
	,avatarSrc varchar(250) not null
	,firstName varchar(50) not null
	,lastName varchar(50) not null
	,country int not null
	,city varchar(50)
	,dateOfBirth datetime
	,onlineStatus bit
	,constraint pk_user primary key	(idUser)
) on [PRIMARY]
-- faltam as rela��es nas chaves estrangeiras. [country ] 

go


print 'Create Table tblFriendship'
go

create table dbo.tblFriendship(
	 idUser int not null
	,idFriend int not null
	,constraint pk_fship primary key (idUser,idFriend)
) on [PRIMARY] -- faltam as rela��es nas chaves estrangeiras [idUser, idFriend]
               -- de quest�es de performance dever� ser criado um �ndice por idUser, facilitando as pesquisas

print 'Create Table tblCountry'
go

create table dbo.tblCountry(
	idCountry int identity(1, 1)
	,country varchar(50)
	,constraint pk_country primary key (idCountry)
) on [PRIMARY]
-- com esta implementa��o � poss�vel criar duas ou mais entradas para o mesmo pa�s. 
-- ou se passa o campo country para chave ou se acrescenta um �ndice �nico.


