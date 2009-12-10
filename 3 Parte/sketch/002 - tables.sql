use msflags
go


print 'Create Table tblUser'
go

create table dbo.tblUser(
	idUser int identity( 1, 1 ) 
	,userName varchar(20) not null
	,password varchar(250) not null
	,avatarSrc varchar(250) not null
	,firstName varchar(50) not null
	,lastName varchar(50) not null
	,country int not null
	,city varchar(50)
	,dateOfBirth datetime
	,onlineStatus bit
	,constraint pk_user primary key	(idUser)
) on [PRIMARY]
go


print 'Create Table tblFriendship'
go

create table dbo.tblFriendship(
	idUser int not null
	,idFriend int not null
	,constraint pk_fship primary key (idUser,idFriend)
) on [PRIMARY]


print 'Create Table tblCountry'
go

create table dbo.tblCountry(
	idCountry int identity(1, 1)
	,country varchar(50)
	,constraint pk_country primary key (idCountry)
) on [PRIMARY]

