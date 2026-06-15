using ko.core.Contracts;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using MimeKit.Text;

namespace ko.core.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendEmailAsync(string fromEmail, string fromName, string toEmail,
           string subject, string body, bool isHtml = false)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            message.Body = new TextPart(isHtml ? TextFormat.Html : TextFormat.Plain)
            {
                Text = body
            };

            await SendMessageAsync(message);
        }

        public async Task SendEmailWithAttachmentsAsync(string fromEmail, string fromName,
            string toEmail, string subject, string body, bool isHtml, params string[] attachmentPaths)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var builder = new BodyBuilder();

            if (isHtml)
                builder.HtmlBody = body;
            else
                builder.TextBody = body;

            foreach (var path in attachmentPaths)
            {
                if (File.Exists(path))
                {
                    builder.Attachments.Add(path);
                }
            }

            message.Body = builder.ToMessageBody();
            await SendMessageAsync(message);
        }

        public async Task SendMultipartEmailAsync(string fromEmail, string fromName,
            string toEmail, string subject, string plainText, string htmlBody)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));
            message.Subject = subject;

            var builder = new BodyBuilder
            {
                TextBody = plainText,
                HtmlBody = htmlBody
            };

            message.Body = builder.ToMessageBody();
            await SendMessageAsync(message);
        }

        public async Task SendEmailWithCcBccAsync(string fromEmail, string fromName,
            string toEmail, string subject, string body,
            string[] ccEmails = null, string[] bccEmails = null)
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(fromName, fromEmail));
            message.To.Add(MailboxAddress.Parse(toEmail));

            if (ccEmails != null)
            {
                foreach (var cc in ccEmails)
                    message.Cc.Add(MailboxAddress.Parse(cc));
            }

            if (bccEmails != null)
            {
                foreach (var bcc in bccEmails)
                    message.Bcc.Add(MailboxAddress.Parse(bcc));
            }

            message.Subject = subject;
            message.Body = new TextPart(TextFormat.Html) { Text = body };

            await SendMessageAsync(message);
        }

        private async Task SendMessageAsync(MimeMessage message)
        {
            using var client = new MailKit.Net.Smtp.SmtpClient();

            try
            {
                // Get configuration values
                var smtpServer = _configuration["Email:smtpServer"];
                var smtpPortStr = _configuration["Email:smtpPort"];
                var username = _configuration["Email:username"];
                var password = _configuration["Email:password"];
                var useSslStr = _configuration["Email:useSsl"];
                var securityOption = _configuration["Email:securityOption"];

                // Validate configuration
                if (string.IsNullOrEmpty(smtpServer))
                    throw new InvalidOperationException("SMTP server is missing");

                if (!int.TryParse(smtpPortStr, out int smtpPort))
                    throw new InvalidOperationException($"Invalid port: '{smtpPortStr}'");

                // Determine security options
                SecureSocketOptions socketOptions = SecureSocketOptions.StartTls; // Default

                if (!string.IsNullOrEmpty(securityOption))
                {
                    socketOptions = securityOption.ToLower() switch
                    {
                        "none" => SecureSocketOptions.None,
                        "auto" => SecureSocketOptions.Auto,
                        "sslonconnect" => SecureSocketOptions.SslOnConnect,
                        "starttls" => SecureSocketOptions.StartTls,
                        "starttlswhenavailable" => SecureSocketOptions.StartTlsWhenAvailable,
                        _ => SecureSocketOptions.StartTls
                    };
                }
                else if (bool.TryParse(useSslStr, out bool useSsl) && useSsl)
                {
                    socketOptions = SecureSocketOptions.SslOnConnect;
                }


                // Try to connect with timeout
                var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                await client.ConnectAsync(smtpServer, smtpPort, socketOptions, cts.Token);
                await client.AuthenticateAsync(username, password, cts.Token);


                await client.SendAsync(message, cts.Token);

                Console.WriteLine("Email sent successfully!");
            }
            catch (OperationCanceledException)
            {
                Console.WriteLine("Connection timeout - check firewall/network settings");
                throw new Exception("Email connection timeout. Please check your network connection and firewall settings.");
            }
            catch (MailKit.Security.SslHandshakeException ex)
            {
                Console.WriteLine($"SSL/TLS error: {ex.Message}");
                throw new Exception($"SSL/TLS handshake failed. Try different security settings. Details: {ex.Message}");
            }
            catch (MailKit.Security.AuthenticationException ex)
            {
                Console.WriteLine($"Authentication failed: {ex.Message}");
                throw new Exception($"Email authentication failed. Check username/password. Details: {ex.Message}");
            }
            catch (System.Net.Sockets.SocketException ex)
            {
                Console.WriteLine($"Network error: {ex.Message}");
                throw new Exception($"Cannot reach email server. Check server address and port. Details: {ex.Message}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error type: {ex.GetType().Name}");
                Console.WriteLine($"Error message: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
                throw;
            }
            finally
            {
                if (client.IsConnected)
                {
                    await client.DisconnectAsync(true);
                }
            }
        }
    }
}
