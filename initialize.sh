# install required software.
sudo apt update
sudo apt install -y nodejs npm

# update nodeJS
sudo npm install -g n
sudo n latest

# set up node and express environment
npm install -y

# Set the environmental variables
export BACKEND_PORT=3389
export YOUR_OWN_IP="http://45.113.235.128"
export REACT_APP_BACKEND_URL="${YOUR_OWN_IP}:${BACKEND_PORT}"
export MYSQL_USER="test"
export MYSQL_PASSWORD="REPLACE_ME"
export DATABASE="bandit"

# Start the backend server
node app.js
