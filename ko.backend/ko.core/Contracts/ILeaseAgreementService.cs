using ko.entity_framework.entities;

namespace ko.core.Contracts
{
    public interface ILeaseAgreementService
    {
        byte[] Generate(Tenancy tenancy);
    }
}
