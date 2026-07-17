using ko.core.Contracts;
using ko.core.Models;
using Mailjet.Client;
using Mailjet.Client.TransactionalEmails;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ko.core.Services
{
    public class EmailServiceMailJet : IEmailServiceMailJet
    {
        private readonly IConfiguration _configuration;

        public EmailServiceMailJet(IConfiguration configuration)
        {
          _configuration = configuration;
        }
       

        public async Task<bool> SendEmailAsync(EmailMessage emailMessage)
        {
            MailjetClient client = new MailjetClient(_configuration["MailJet:ApiKey"], _configuration["MailJet:SecreteKey"]);

            var email = new TransactionalEmailBuilder().
                            WithFrom(new SendContact(_configuration["Email:From"], _configuration["Email:ApplicationName"]))
                            .WithSubject(emailMessage.Subject)
                            .WithHtmlPart(emailMessage.Body)
                            .WithTo(new SendContact(emailMessage.To))
                            .Build();

            var response = await client.SendTransactionalEmailAsync(email);
            if (response.Messages != null)
            {
                if (response.Messages[0].Status == "success")
                {
                    return true;
                }
            }

            return false;

        }
    }
}
