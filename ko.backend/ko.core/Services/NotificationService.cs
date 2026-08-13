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

        // Send to a specific user by their FCM token
        public async Task SendToUserAsync(string userId, string title,
                                           string message, string type)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null || string.IsNullOrEmpty(user.FcmToken)) return;

            var fcmMessage = new Message
            {
                Token = user.FcmToken,
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
            },
                Android = new AndroidConfig
                {
                    Priority = Priority.High,
                    Notification = new AndroidNotification
                    {
                        Sound = "default",
                        ClickAction = "FLUTTER_NOTIFICATION_CLICK",
                    }
                }
            };

            try
            {
                string response = await FirebaseMessaging.DefaultInstance
                    .SendAsync(fcmMessage);
                _logger.LogInformation("Notification sent: {0}", response);
            }
            catch (Exception ex)
            {
                _logger.LogInformation("Notification failed: {0}", ex.Message);
            }
        }

        // Send to all students/landlords via topic
        public async Task SendToTopicAsync(string topic, string title,
                                            string message, string type)
        {
            var fcmMessage = new Message
            {
                Topic = topic, // "student" or "landlord"
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