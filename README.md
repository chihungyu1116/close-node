Create the folder.

$ sudo mkdir -p /data/db/
Give yourself permission to the folder.

$ sudo chown `id -u` /data/db
Then you can run mongod without sudo. Works on OSX 

mongoimport --db test --collection restaurants --drop --file ~/downloads/primer-dataset.json
# close-node
