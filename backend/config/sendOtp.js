import { Resend } from 'resend';

const resend = new Resend('re_EoJh38Ca_EsRYvDr736k3G6WWs3tqocq2'); // Your API key

export const sendEmailOtp = async (email, otp) => {
    console.log('Sending OTP to:', otp);
    // try {
    //     // Temporarily force sending to your verified email for testing
    //     const testEmail = 'nahomhabtamu147@gmail.com';

    //     const data = await resend.emails.send({
    //         from: 'onboarding@resend.dev',
    //         to: testEmail, // Send to yourself for now
    //         subject: `OTP Verification Code: ${otp}`,
    //         html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
    //         text: `Your verification code is: ${otp}` // Plain text version
    //     });
    //     console.log('Test email sent successfully to you');
    //     return data;
    // } catch (error) {
    //     console.error('Email send error:', error);
    //     throw error;
    // }
}