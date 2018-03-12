import {S3Filesystem} from '../services/s3/index';
import {REGIONS, ENVIRONMENTS, CURRENT_TOPICS} from '../constants';

const notificationsAddTenant = async (env, tenant) => {
    if (!ENVIRONMENTS.includes(env)){
        console.error(`The supplied environment (${env}) is not in the accept list of environments.`);
        console.error("Accepted environments = ", ENVIRONMENTS);
        process.exit(1);
    }

    let bucket_errors = [];

    // Adds the new tenant to all currently used regions
    for (let r = 0; r < REGIONS.length; r++){
        try {
            const NOTIFICATIONS_DATA_BUCKET = `notifications-topics-subscribers-${env}-${REGIONS[r]}`;
            const S3_CLIENT = new S3Filesystem(NOTIFICATIONS_DATA_BUCKET);
            const TOPICS_FILE_NAME = 'DecsTestNotificationTopics.json';

            // Checks if bucket exists, if there is an error a message is added to an array for displaying at the end
            const bucketExists = await S3_CLIENT.bucketExists();
            if (!bucketExists) {
                const message = `Bucket ${NOTIFICATIONS_DATA_BUCKET} doesn't exist.`;
                console.error(message);
                bucket_errors.push(message);
                continue;
            }

            // Gets the notifications details from an S3 bucket
            let topicsContent = await S3_CLIENT.readFile(TOPICS_FILE_NAME);
            if (typeof(topicsContent) === 'string'){
                topicsContent = JSON.parse(topicsContent);
            }
            // Ensures the data was retrieved successfully
            if ('statusCode' in topicsContent) {
                if (topicsContent.statusCode === 404) {
                    console.log(`The supplied file name (${TOPICS_FILE_NAME}) does not exist.`);
                    console.log("This process will create a new file.");
                    topicsContent = {};
                }
                else if (topicsContent.statusCode > 400) {
                    console.error("There was an error while trying to retrieve the file contents: ");
                    console.error(topicsContent);
                    process.exit(1);
                }
            }

            // Does nothing if tenant already exists
            if (tenant in topicsContent) {
                console.log(`Tenant ${tenant} already exists, done.`);
            }
            else {
                console.log(`tenant ${tenant} not found, setting up tenant...`);
                // Adds an empty object for the tenant then adds the topics to the new tenant object
                topicsContent[tenant] = {};
                topicsContent[tenant] = CURRENT_TOPICS;

                console.log("topicsContent = ", JSON.stringify(topicsContent, null, 2));
                // Uploads the whole data object to a file in S3 and creates a new file if it doesn't already exist
                const result = await S3_CLIENT.writeFile(TOPICS_FILE_NAME, JSON.stringify(topicsContent, null, 2));

                if ('err' in result) {
                    console.error(result.err);
                    process.exit(1);
                }
                else {
                    console.log('Update Successfully Completed:');
                    console.log('Location = ', result.Location);
                    console.log('Bucket = ', result.Bucket);
                }
            }
        }
        catch (err) {
            console.error("An error occurred: ");
            console.error(err);
            process.exit(1);
        }
    }

    if (bucket_errors.length > 0) {
        console.error("There were errors while trying to access buckets: ");
        console.error(bucket_errors);
        process.exit(1);
    }
};

export default notificationsAddTenant;