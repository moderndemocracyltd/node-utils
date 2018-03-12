import notificationsAddTenant from './notification_topics/add_tenant';
import notificationsDeleteTenant from './notification_topics/delete_tenant';

export {
    notificationsAddTenant,
    notificationsDeleteTenant
};

notificationsAddTenant("dev", "2")
    .then();

notificationsDeleteTenant("dev", "2")
    .then();