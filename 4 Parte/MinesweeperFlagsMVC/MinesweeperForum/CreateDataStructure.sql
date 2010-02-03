use master
go

if (object_id('MSF_Forum')) is not null
	drop database MSF_Forum
go

create database MSF_Forum
go

use MSF_Forum

if (object_id('Post')) is not null
	drop table Post
go
if (object_id('Thread')) is not null
	drop table Thread
go

create table Thread(
	id int identity(1,1) primary key,
	title varchar(100),
	addDate datetime,
	visits int,
	publisher varchar(100)
);

create table Post(
	id int identity(1,1) primary key,
	threadId int not null,
	publisher varchar(150),
	addDate datetime,
	body char(1000)
);
go

alter table Post
add constraint fkPost foreign key (threadId) references Thread(id)
go

insert into Thread (title,addDate,visits,publisher)
values ('The first thread',getdate(),0,'Ricardo Neto');

insert into Thread (title,addDate,visits,publisher)
values ('The second thread',getdate(),0,'Ricardo Neto');

insert into Post (threadId,publisher,addDate,body)
values (1,'Ricardo Neto',getdate(),'The first post of the first thread')

insert into Post (threadId,publisher,addDate,body)
values (1,'Ricardo Neto',getdate(),'The second post of the first thread')


insert into Post (threadId,publisher,addDate,body)
values (2,'Ricardo Neto',getdate(),'The first post of the second thread')

insert into Post (threadId,publisher,addDate,body)
values (2,'Ricardo Neto',getdate(),'The second post of the second thread')
