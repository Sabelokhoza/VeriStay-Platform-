using ko.core.Contracts;
using ko.core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationsController : ControllerBase
{
    private readonly INotificationService _notificationService;

    public NotificationsController(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    // GET api/Notifications/user/{userId}
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<List<AppNotificationDto>>>> GetUserNotifications(
        string userId)
    {
        var result = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(ApiResponse.Success(result, "Notifications retrieved"));
    }

    // GET api/Notifications/unread-count/{userId}
    [HttpGet("unread-count/{userId}")]
    public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount(string userId)
    {
        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(ApiResponse.Success(count, "Unread count retrieved"));
    }

    // PATCH api/Notifications/{id}/read
    [HttpPatch("{id}/read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(int id)
    {
        var result = await _notificationService.MarkAsReadAsync(id);
        return Ok(ApiResponse.Success(result, "Notification marked as read"));
    }

    // PATCH api/Notifications/user/{userId}/read-all
    [HttpPatch("user/{userId}/read-all")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAllRead(string userId)
    {
        var result = await _notificationService.MarkAllReadAsync(userId);
        return Ok(ApiResponse.Success(result, "All notifications marked as read"));
    }

    // DELETE api/Notifications/{id}
    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _notificationService.DeleteAsync(id);
        return Ok(ApiResponse.Success(result, "Notification deleted"));
    }

    // DELETE api/Notifications/user/{userId}/all
    [HttpDelete("user/{userId}/all")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteAll(string userId)
    {
        var result = await _notificationService.DeleteAllAsync(userId);
        return Ok(ApiResponse.Success(result, "All notifications deleted"));
    }
}