import CreatePublishNotificationHandler from './handler';
import {createErrorResponse} from '../../services/exception-processing/error-response-builder';
const requestHandler = new CreatePublishNotificationHandler();

const executePublishNotification = (event, context, callback) => {
    try {
        console.log("context = ", context.invokedFunctionArn.split(":")[4]);
        requestHandler.execute(event)
            .then((response) => {
                callback(null, response);
            })
            .catch((error) => {
                callback(null, createErrorResponse(error));
            });
    }
    catch(error) {
        callback(null, createErrorResponse(error));
    }
};

export default executePublishNotification;