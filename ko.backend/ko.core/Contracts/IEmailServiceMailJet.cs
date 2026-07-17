using ko.core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ko.core.Contracts
{
    public interface IEmailServiceMailJet
    {
        Task<bool> SendEmailAsync(EmailMessage emailMessage);
    }
}
