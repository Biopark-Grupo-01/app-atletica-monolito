import { Notification } from '../entities/notification.entity';

export class NotificationDomainService {
  
  validateNotificationContent(notification: Notification): string[] {
    const errors: string[] = [];
    
    if (!notification.title || notification.title.trim().length === 0) {
      errors.push('Notification title is required');
    }
    
    if (notification.title && notification.title.length > 100) {
      errors.push('Notification title must be 100 characters or less');
    }
    
    if (!notification.body || notification.body.trim().length === 0) {
      errors.push('Notification body is required');
    }
    
    if (notification.body && notification.body.length > 500) {
      errors.push('Notification body must be 500 characters or less');
    }
    
    if (!notification.fcmToken || notification.fcmToken.trim().length === 0) {
      errors.push('FCM token is required');
    }
    
    return errors;
  }

  createUserNotification(
    fcmToken: string, 
    title: string, 
    body: string
  ): Notification {
    const notification = new Notification();
    notification.fcmToken = fcmToken;
    notification.title = title.trim();
    notification.body = body.trim();
    
    const validationErrors = this.validateNotificationContent(notification);
    if (validationErrors.length > 0) {
      throw new Error(`Invalid notification: ${validationErrors.join(', ')}`);
    }
    
    return notification;
  }

  createBroadcastNotifications(
    fcmTokens: string[], 
    title: string, 
    body: string
  ): Notification[] {
    if (!fcmTokens || fcmTokens.length === 0) {
      throw new Error('At least one FCM token is required for broadcast');
    }
    
    const notifications: Notification[] = [];
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();
    
    for (const token of fcmTokens) {
      if (token && token.trim().length > 0) {
        try {
          const notification = this.createUserNotification(token, trimmedTitle, trimmedBody);
          notifications.push(notification);
        } catch (error) {
          // Log error but continue with other tokens
          console.warn(`Failed to create notification for token ${token}: ${error.message}`);
        }
      }
    }
    
    if (notifications.length === 0) {
      throw new Error('No valid notifications could be created');
    }
    
    return notifications;
  }

  createEventNotification(
    fcmTokens: string[],
    eventTitle: string,
    eventDate: Date,
    eventType: 'created' | 'updated' | 'cancelled'
  ): Notification[] {
    let title: string;
    let body: string;
    
    switch (eventType) {
      case 'created':
        title = 'Novo Evento Criado!';
        body = `O evento "${eventTitle}" foi criado para ${eventDate.toLocaleDateString('pt-BR')}. Não perca!`;
        break;
      case 'updated':
        title = 'Evento Atualizado';
        body = `O evento "${eventTitle}" foi atualizado. Verifique as novas informações.`;
        break;
      case 'cancelled':
        title = 'Evento Cancelado';
        body = `Infelizmente o evento "${eventTitle}" foi cancelado. Verifique os detalhes no app.`;
        break;
      default:
        throw new Error('Invalid event type');
    }
    
    return this.createBroadcastNotifications(fcmTokens, title, body);
  }

  createProductNotification(
    fcmTokens: string[],
    productName: string,
    notificationType: 'low_stock' | 'out_of_stock' | 'new_product'
  ): Notification[] {
    let title: string;
    let body: string;
    
    switch (notificationType) {
      case 'low_stock':
        title = 'Estoque Baixo!';
        body = `O produto "${productName}" está com estoque baixo. Reponha logo!`;
        break;
      case 'out_of_stock':
        title = 'Produto Esgotado!';
        body = `O produto "${productName}" está esgotado. Considere reabastecer.`;
        break;
      case 'new_product':
        title = 'Novo Produto Disponível!';
        body = `Confira o novo produto "${productName}" em nossa loja!`;
        break;
      default:
        throw new Error('Invalid notification type');
    }
    
    return this.createBroadcastNotifications(fcmTokens, title, body);
  }

  createTrainingNotification(
    fcmTokens: string[],
    trainingTitle: string,
    trainingDate: string,
    trainingTime: string,
    notificationType: 'reminder' | 'cancelled' | 'rescheduled'
  ): Notification[] {
    let title: string;
    let body: string;
    
    switch (notificationType) {
      case 'reminder':
        title = 'Lembrete de Treino';
        body = `Não esqueça do treino "${trainingTitle}" hoje às ${trainingTime}!`;
        break;
      case 'cancelled':
        title = 'Treino Cancelado';
        body = `O treino "${trainingTitle}" de ${trainingDate} foi cancelado.`;
        break;
      case 'rescheduled':
        title = 'Treino Reagendado';
        body = `O treino "${trainingTitle}" foi reagendado para ${trainingDate} às ${trainingTime}.`;
        break;
      default:
        throw new Error('Invalid notification type');
    }
    
    return this.createBroadcastNotifications(fcmTokens, title, body);
  }
}
