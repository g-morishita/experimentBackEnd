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
sudo apt install -y node # For ubuntu. If you use different OS, you should change an appropriate package manager.
npm install -y

# Start the backend server
node app.js
