using ko.core.Models;

namespace ko.core.Contracts
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(LoginDto loginDto);
        Task<RegistrationResponse> RegisterStudentAsync(RegisterStudentDto registerDto);
        //Task<RegistrationResponse> RegisterCentreAdmin(RegisterCentreAdminDto registerDto);
        //Task<AuthResponse> RefreshUserToken(string email);
        //Task<bool> ForgotPassword(RequestForgotPasswordDto model);
        //Task<bool> ResetPassword(ResetPasswordRequestDto model);
        //Task<UpdateProfileDto> UpdateProfile(UpdateProfileDto updateProfileDto);

    }
}
