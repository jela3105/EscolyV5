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
Create .env file to setup myslq credentials, you can use .env.template to setup  the follwoing credentials:
```ini
PORT=3000
MYSQL_HOST=localhost
MYSQL_DOCKER_PORT=3306
MYSQL_ROOT_PASSWORD=root
MYSQL_DATABASE=Escoly
NODE_ENV=dev
```

### 3. Load the init.sql script for database
- Save the database init file in root directory (EscolyV5/) in order load the schema into the docker containner.
- You can request access in here: https://drive.google.com/file/d/1lIyxdvrjjKE5vYGqmQHDxH3n7I9evscq/view?usp=sharing

### 4. Run the project
In order to run the project, you can use: 
```bash
docker-compose up
```

## **Log into mysql docker containner**

- Get into the shell of the containner:
`docker exec -it <container_name_or_id> bash`

- Log in direcly as root in mysql:
`docker exec -it <container_name_or_id> mysql -u root -p`

## **Notes for development with poOs!**

- Be able to remove the mysql volume
`sudo chown -R $USER <directory>`
