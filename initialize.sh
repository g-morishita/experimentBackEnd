# install required software.
sudo apt update
sudo apt install -y sqlite3 nodejs npm

# update nodeJS
sudo npm install -g n
sudo n latest

# create a new database.
databaseName="pilotIndividualBanditExperiment.db"
unixTime=$(date +%s);

if test -f "${databaseName}"; then
    echo "${databaseName} exists. Rename the existing database to ${unixTime}_${databaseName}"
    mv "${databaseName}" "${unixTime}_${databaseName}"
else
    echo "${databaseName} does not exist."
fi
echo "Create a new database file."
sqlite3 pilotIndividualBanditExperiment.db < createPilotIndividualBanditExperiment.sql

# set up node and express environment
npm install -y

# Set the environmental variables
export DATABASE_PORT=3389
export YOUR_OWN_IP="http://45.113.235.128"
export REACT_APP_DATABASE_URL="${YOUR_OWN_IP}:${DATABASE_PORT}"

# Start the backend server
node app.js
