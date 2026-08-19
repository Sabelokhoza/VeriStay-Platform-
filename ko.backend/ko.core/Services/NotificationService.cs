using FirebaseAdmin.Messaging;
using ko.core.Contracts;
using ko.core.Models;
using ko.entity_framework;
using ko.entity_framework.entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ko.core.Services
{
    public class NotificationService : INotificationService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAppLogger<NotificationService> _logger;
        private readonly AppDbContext _appDbContext;

        public NotificationService(
            UserManager<ApplicationUser> userManager,
            IAppLogger<NotificationService> logger,
            AppDbContext appDbContext) 
        {
            _userManager = userManager;
            _logger = logger;
            _appDbContext = appDbContext;
        }


        public async Task SendToUserAsync(
            string userId, string title, string message, string type)
        {
            await SaveNotificationAsync(userId, title, message, type);

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning(
                    "Cannot send FCM. User {UserId} not found.", userId);
                return;
            }

            if (string.IsNullOrWhiteSpace(user.FcmToken))
            {
                _logger.LogWarning(
                    "User {UserId} has no FCM token — notification saved to DB only.",
                    userId);
                return;
            }

            _logger.LogInformation(
                "Sending FCM to user {UserId}.", userId);

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
                        ChannelId = GetChannelId(type),
                    }
                }
            };

            try
            {
                string response = await FirebaseMessaging.DefaultInstance
                    .SendAsync(fcmMessage);
                _logger.LogInformation(
                    "FCM sent to {UserId}. MessageId: {MessageId}",
                    userId, response);
            }
            catch (FirebaseMessagingException ex)
            {
                _logger.LogError(
                    "FCM failed for {UserId}. Code: {Code}. Error: {Error}",
                    userId, ex.ErrorCode, ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    "Unexpected FCM error for {UserId}: {Error}",
                    userId, ex.Message);
            }
        }

        public async Task SendToTopicAsync(
            string topic, string title, string message, string type)
        {
            _logger.LogInformation(
                "Sending FCM to topic {Topic}.", topic);

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

            try
            {
                string response = await FirebaseMessaging.DefaultInstance
                    .SendAsync(fcmMessage);
                _logger.LogInformation(
                    "FCM topic message sent. MessageId: {MessageId}", response);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    "FCM topic send failed for {Topic}: {Error}",
                    topic, ex.Message);
            }
        }


        private async Task SaveNotificationAsync(
            string userId, string title, string message, string type)
        {
            try
            {
                var notification = new AppNotification
                {
                    UserId = userId,
                    Title = title,
                    Message = message,
                    Type = type,
                    IsRead = false,
                    CreatedAt = DateTime.UtcNow,
                };

                await _appDbContext.AppNotifications.AddAsync(notification);
                await _appDbContext.SaveChangesAsync();

                _logger.LogInformation(
                    "Notification saved to DB for user {UserId}.", userId);
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    "Failed to save notification to DB for {UserId}: {Error}",
                    userId, ex.Message);
            }
        }


        public async Task<List<AppNotificationDto>> GetUserNotificationsAsync(
            string userId)
        {
            var notifications = await _appDbContext.AppNotifications
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new AppNotificationDto
                {
                    Id = n.Id,
                    UserId = n.UserId,
                    Title = n.Title,
                    Message = n.Message,
                    Type = n.Type,
                    IsRead = n.IsRead,
                    CreatedAt = n.CreatedAt,
                })
                .ToListAsync();

            return notifications;
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await _appDbContext.AppNotifications
                .CountAsync(n => n.UserId == userId && !n.IsRead);
        }

        public async Task<bool> MarkAsReadAsync(int notificationId)
        {
            var notification = await _appDbContext.AppNotifications
                .FirstOrDefaultAsync(n => n.Id == notificationId);

            if (notification == null) return false;

            notification.IsRead = true;
            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> MarkAllReadAsync(string userId)
        {
            var unread = await _appDbContext.AppNotifications
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToListAsync();

            if (!unread.Any()) return true;

            unread.ForEach(n => n.IsRead = true);
            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int notificationId)
        {
            var notification = await _appDbContext.AppNotifications
                .FirstOrDefaultAsync(n => n.Id == notificationId);

            if (notification == null) return false;

            _appDbContext.AppNotifications.Remove(notification);
            await _appDbContext.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAllAsync(string userId)
        {
            var notifications = await _appDbContext.AppNotifications
                .Where(n => n.UserId == userId)
                .ToListAsync();

            if (!notifications.Any()) return true;

            _appDbContext.AppNotifications.RemoveRange(notifications);
            await _appDbContext.SaveChangesAsync();
            return true;
        }


        private static string GetChannelId(string type) => type switch
        {
            "payment" => "veristay_payments",
            "maintenance" => "veristay_maintenance",
            "announcement" => "veristay_announcements",
            _ => "veristay_applications",
        };
    }
}