import AWS from 'aws-sdk';
import ms from 'ms';
import promiseMemoize from 'promise-memoize';

function wrapWithCache(memoFn, {cacheMaxAge=ms('1m')} = opts) {
    const func = memoFn;
    return promiseMemoize(func, {maxAge: cacheMaxAge, resolve: (params) => params[0].path});
}

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

        if(cache) {
            this.getValues = wrapWithCache(this.getValues.bind(this), opts);
        }
        else {
            this.getValues = this.getValues.bind(this);
        }
    }

    async getValues({path, maxItems = 10, recursive = true, decrypt = true, configValidator = (params) => true, valueFactoryMethod, flattener = flattenConfiguration}) {

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

        parameters = flattener(parameters);

        if(!await configValidator(parameters)) {

            if(!valueFactoryMethod) {
                throw new Error(`Configuration parameters at path ${path} failed validation.`);
            }

            parameters = await valueFactoryMethod(path);
        }

        return parameters;

    }

}

export default SsmConfigProvider;