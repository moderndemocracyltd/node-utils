const datasource = (repository) => {
    return (target, key, descriptor) => {
        
        const origin = descriptor.value;
        descriptor.value = async function() {

            // Get database connection
            let dbConnection = undefined;

            try{
                dbConnection = await repository.buildConnection(); // TODO: Implement Connection Pooling
                const newArgs = Array.from(arguments);
                newArgs.push(dbConnection);
                return origin.apply(this, newArgs);
            }
            finally {
                if(dbConnection) {
                    dbConnection.end(); // TODO: Implement Connection Pooling
                }
            }
        };
        return descriptor;
    };
};

export default datasource;