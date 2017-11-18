import AWS from 'aws-sdk';

function flattenConfiguration(parameters) {
    let flatObject = {};
    
    if(parameters && parameters.Parameters) {
    
        parameters.Parameters.forEach(element => {
            const lastPathSeperator = element.Name.lastIndexOf('/');
            const elementName = element.Name.substring(lastPathSeperator+1);
            flatObject[elementName] = element.Value;
        });
    }
    
    return flatObject;
}

class SsmConfigProvider {

    constructor({cache = false} = opts) {
        
    }

    async getValues({path, maxItems = 10, recursive = true, configValidator = (params) => true, valueFactoryMethod, flattener = flattenConfiguration}) {

        if(!path || path === '') {
            throw new Error("Invalid Configuration - Missing Path parameter value");
        }
        
        const requestParameters = {
            Path: path, 
            MaxResults: maxItems, 
            Recursive: recursive, 
            WithDecryption: decrypt
        };

        const ssmClient = new AWS.SSM({apiVersion: '2014-11-06'});
        let parameters = await ssmClient.getParametersByPath(requestParameters).promise();

        parameters = parameterExtractor(parameters);

        if(!await validator(parameters)) {

            if(!valueFactoryMethod) {
                throw new Error(`Configuration parameters at path ${path} failed validation.`);
            }

            parameters = await valueFactoryMethod(path);
        }

        return parameters;

    }

}

export default SsmConfigProvider;