using FirebaseAdmin.Messaging;
using ko.core.Contracts;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;

namespace ko.core.Services
{
    public class NotificationService : INotificationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAppLogger<NotificationService> _logger;

        public NotificationService(
            UserManager<ApplicationUser> userManager,
            IAppLogger<NotificationService> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public async Task SendToUserAsync(
     string userId,
     string title,
     string message,
     string type)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                _logger.LogWarning(
                    "Cannot send notification. User {UserId} was not found.",
                    userId);

                return;
            }

            if (string.IsNullOrWhiteSpace(user.FcmToken))
            {
                _logger.LogWarning(
                    "Cannot send notification. User {UserId} has no FCM token.",
                    userId);

                return;
            }

            _logger.LogInformation(
                "Sending FCM notification to user {UserId}. Token: {Token}",
                userId,
                user.FcmToken);

            var fcmMessage = new Message
            {
                Token = user.FcmToken,

                Notification = new Notification
                {
                    Title = title,
                    Body = message
                },

                Data = new Dictionary<string, string>
        {
            { "type", type },
            { "title", title },
            { "message", message }
        },

                Android = new AndroidConfig
                {
                    Priority = Priority.High,

                    Notification = new AndroidNotification
                    {
                        Sound = "default",
                        ClickAction = "FLUTTER_NOTIFICATION_CLICK"
                    }
                }
            };

            try
            {
                string response =
                    await FirebaseMessaging.DefaultInstance.SendAsync(fcmMessage);

                _logger.LogInformation(
                    "Firebase notification sent successfully to user {UserId}. Message ID: {MessageId}",
                    userId,
                    response);
            }
            catch (FirebaseMessagingException ex)
            {
                _logger.LogError(
                    ex.Message,
                    "Firebase notification failed for user {UserId}. ErrorCode: {ErrorCode}",
                    userId,
                    ex.ErrorCode);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex.Message,
                    "Unexpected notification error for user {UserId}",
                    userId);
            }
        }

        public async Task SendToTopicAsync(string topic, string title,
                                            string message, string type)
        {
            var fcmMessage = new Message
            {
                Topic = topic,
                Notification = new Notification
                {
                    Title = title,
                    Body = message,
                },
                Data = new Dictionary<string, string>
            {
                { "type",    type    },
                { "title",   title   },
                { "message", message },
            }
            };

            await FirebaseMessaging.DefaultInstance.SendAsync(fcmMessage);
        }
    }
}