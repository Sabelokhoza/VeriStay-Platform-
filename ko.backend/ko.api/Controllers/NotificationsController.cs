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

    [HttpGet("user/{userId}")]
    public async Task<ActionResult<ApiResponse<List<AppNotificationDto>>>> GetUserNotifications(
        string userId)
    {
        var result = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(ApiResponse.Success(result, "Notifications retrieved"));
    }

    [HttpGet("unread-count/{userId}")]
    public async Task<ActionResult<ApiResponse<int>>> GetUnreadCount(string userId)
    {
        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(ApiResponse.Success(count, "Unread count retrieved"));
    }

    [HttpPatch("{id}/read")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAsRead(int id)
    {
        var result = await _notificationService.MarkAsReadAsync(id);
        return Ok(ApiResponse.Success(result, "Notification marked as read"));
    }

    [HttpPatch("user/{userId}/read-all")]
    public async Task<ActionResult<ApiResponse<bool>>> MarkAllRead(string userId)
    {
        var result = await _notificationService.MarkAllReadAsync(userId);
        return Ok(ApiResponse.Success(result, "All notifications marked as read"));
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<bool>>> Delete(int id)
    {
        var result = await _notificationService.DeleteAsync(id);
        return Ok(ApiResponse.Success(result, "Notification deleted"));
    }

    [HttpDelete("user/{userId}/all")]
    public async Task<ActionResult<ApiResponse<bool>>> DeleteAll(string userId)
    {
        var result = await _notificationService.DeleteAllAsync(userId);
        return Ok(ApiResponse.Success(result, "All notifications deleted"));
    }
}