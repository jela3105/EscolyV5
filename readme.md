# Escoly
Backend application of Escoly.

## **Development installation**

### 1. Download the repo
- Clone the repo with ssh:
`git clone git@github.com:jela3105/EscolyV5.git`

or

- Clone with GitHub CLI:
`gh repo clone jela3105/EscolyV5`

### 2. Create file .env
Create .env file to setup myslq credentials, you can use .env.template to setup the following credentials:
```ini
PORT=3000
MYSQL_HOST=escoly-mysql-db
MYSQL_DOCKER_PORT=3306
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=Escoly
NODE_ENV=dev
JWT_SEED=seed
MAILER_EMAIL=
MAILER_SERVICE=
MAILER_SECRET_KEY=
WEB_SERVICE_URL=
```

You can downlaod the dev .env with the values to run locally [here](https://drive.google.com/file/d/1-4WoA9N2mtvKC40NsW1bQIOrlW8cJ4Ft/view?usp=sharing) 

### 3. Load script to create the schema and the initial info of the database 
Create a new directory in root with the name `mysql-init/` and download the following files:
- [The script to create the database schema](https://drive.google.com/file/d/1lIyxdvrjjKE5vYGqmQHDxH3n7I9evscq/view?usp=drive_link) and name it `init.sql`
- [The script to initialize database with the basic information](https://drive.google.com/file/d/1O7tsNSMyWef9cclmS-gOtu4kQIOwuZr5/view?usp=drive_link) and name it `initdata.sql`;

*Important note:* The files are load in alphabetic order, so make dure to first load the database schema, and the file that inserts data 


### 4. Run the project
In order to run the project, you can use: 
```bash
docker-compose up
```

## **Log into mysql docker containner**

- Get into the shell of the containner:
```bash
docker exec -it <container_name_or_id> bash
```

- Log in direcly as root in mysql:
```bash
docker exec -it <container_name_or_id> mysql -u root -p
```

## **Notes for development with poOs!**

- Be able to remove the mysql volume directory generated
```bash
sudo chown -R $USER <directory>
```
